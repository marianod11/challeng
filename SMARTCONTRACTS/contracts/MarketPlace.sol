// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/extensions/IERC20Metadata.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import "@openzeppelin/contracts/utils/cryptography/EIP712.sol";
import "hardhat/console.sol";

contract MarketPlace is EIP712 {
    using ECDSA for bytes32;

    error InvalidQuantityOrPrice(uint256 quantity, uint256 price);
    error TokenAlreadySold(uint256 tokenId);
    error IncorrectPayment(uint256 sent, uint256 required);
    error TokenAlreadyWithdrawn(uint256 tokenId);
    error OnlySellerCanWithdraw(address caller);
    error ItemNotSoldYet(uint256 tokenId);
    error InvalidSignature(address signer);

    struct TokenList {
        address seller;
        string tokenName;
        string tokenSymbol;
        address tokenAddress;
        uint256 price;
        uint256 quantity;
        bool sold;
        bool withdrawn;
        uint256 tokenId;
    }

    string public constant NAME712 = "Marketplace";
    string public constant VERSION712 = "1";

    bytes32 private constant LIST_TYPEHASH = keccak256(
        "ListToken(address tokenAddress,uint256 price,uint256 quantity,uint256 nonce)"
    );

    mapping(address => uint256) public nonces;
    mapping(uint256 => TokenList) public listTokens;
    mapping(address => uint256[]) public userTokenListIds;
    uint256 public tokenCount;

    event ItemListed(address seller, address tokenAddress, uint256 tokenId, uint256 price, uint256 quantity);
    event ItemPurchased(address buyer, address tokenAddress, uint256 price, uint256 quantity);
    event FundsWithdrawn(address withdrawer, uint256 amount);

    constructor() EIP712(NAME712, VERSION712) {}

    /// @notice Lists a token on the marketplace.
    /// @param tokenAddress The address of the ERC20 token contract.
    /// @param price The price at which the token is to be sold.
    /// @param quantity The quantity of tokens to sell.
    function listToken(address tokenAddress, uint256 price, uint256 quantity) public {
        _listToken(msg.sender, tokenAddress, price, quantity);
    }

    function _listToken(
        address seller,
        address _tokenAddress,
        uint256 _price,
        uint256 _quantity
    ) internal returns (uint256) {
        if (_quantity == 0 || _price == 0) {
            revert InvalidQuantityOrPrice(_quantity, _price);
        }
        IERC20Metadata(_tokenAddress).transferFrom(seller, address(this), _quantity);
        string memory tokenName = IERC20Metadata(_tokenAddress).name();
        string memory tokenSymbol = IERC20Metadata(_tokenAddress).symbol();
        uint256 tokenId = tokenCount;
        listTokens[tokenCount] = TokenList({
            seller: seller,
            tokenAddress: _tokenAddress,
            tokenName: tokenName,
            tokenSymbol: tokenSymbol,
            price: _price,
            quantity: _quantity,
            sold: false,
            withdrawn: false,
            tokenId: tokenId
        });
        userTokenListIds[seller].push(tokenCount);
        emit ItemListed(seller, _tokenAddress, tokenCount, _price, _quantity);
        tokenCount++;
        return tokenId;
    }

    /// @notice Purchases a listed token from the marketplace.
    /// @param _tokenId The ID of the token to purchase.
    function buyToken(uint256 _tokenId) public payable {
        TokenList storage tokenList = listTokens[_tokenId];

        if (tokenList.sold) {
            revert TokenAlreadySold(_tokenId);
        }
        if (msg.value != tokenList.price) {
            revert IncorrectPayment(msg.value, tokenList.price);
        }
        IERC20(tokenList.tokenAddress).transfer(msg.sender, tokenList.quantity);
        tokenList.sold = true;
        emit ItemPurchased(msg.sender, tokenList.tokenAddress, tokenList.price, tokenList.quantity);
    }

    /// @notice Withdraws the funds obtained from the sale of a token.
    /// @param _tokenId The ID of the sold token.
    function withdrawToken(uint256 _tokenId) public {
        TokenList storage tokenList = listTokens[_tokenId];
        if (tokenList.withdrawn) {
            revert TokenAlreadyWithdrawn(_tokenId);
        }
        if (msg.sender != tokenList.seller) {
            revert OnlySellerCanWithdraw(msg.sender);
        }
        if (!tokenList.sold) {
            revert ItemNotSoldYet(_tokenId);
        }

        payable(msg.sender).transfer(tokenList.price);
        tokenList.withdrawn = true;
        emit FundsWithdrawn(msg.sender, tokenList.price);
    }

    function _hashListToken(
        address tokenAddress,
        uint256 price,
        uint256 quantity,
        uint256 nonce
    ) internal view returns (bytes32) {
        return _hashTypedDataV4(
            keccak256(abi.encode(LIST_TYPEHASH, tokenAddress, price, quantity, nonce))
        );
    }

    /// @notice Retrieves the current nonce of a user.
    /// @param user The address of the user.
    /// @return uint256 The current nonce of the user.
    function getNonce(address user) public view returns (uint256) {
        return nonces[user];
    }

    /// @notice Lists a token on the marketplace using a signature.
    /// @param seller The address of the seller.
    /// @param tokenAddress The address of the ERC20 token contract.
    /// @param price The price at which the token is to be sold.
    /// @param quantity The quantity of tokens to sell.
    /// @param signature The seller's signature.
    function listTokenWithSignature(
        address seller,
        address tokenAddress,
        uint256 price,
        uint256 quantity,
        bytes memory signature
    ) public payable {
        bytes32 digest = _hashListToken(tokenAddress, price, quantity, nonces[seller]);

        address signer = digest.recover(signature);
        if (signer != seller) {
            revert InvalidSignature(signer);
        }
        nonces[seller]++;
        uint256 tokenId = _listToken(seller, tokenAddress, price, quantity);

        buyToken(tokenId);
    }

    /// @notice Retrieves all tokens listed on the marketplace.
    /// @return TokenList[] List of tokens.
    function getAllTokens() public view returns (TokenList[] memory) {
        TokenList[] memory tokens = new TokenList[](tokenCount);
        for (uint256 i = 0; i < tokenCount; i++) {
            tokens[i] = listTokens[i];
        }
        return tokens;

    }

    /// @notice Retrieves all tokens listed by a user.
    /// @param _user Address of the user.
    /// @return TokenList[] List of tokens.
    function getUsersListTokens(address _user) public view returns (TokenList[] memory) {
        TokenList[] memory tokens = new TokenList[](userTokenListIds[_user].length);
        for (uint256 i = 0; i < userTokenListIds[_user].length; i++) {
            tokens[i] = listTokens[userTokenListIds[_user][i]];
        }
        return tokens;
    }
}
