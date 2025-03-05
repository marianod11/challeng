import React from "react";
import {TokensData} from "../../types/types";
import { ethers } from "ethers";
import { useAppContext } from "../../context/appContext";
import {
  buyToken,
  listToken,
  withdrawTokenUser,
} from "./tokenActions";

interface TokenCardProps {
  token: TokensData;
}

export const TokenCard: React.FC<TokenCardProps> = ({ token,  }) => {

  const { signer, connected, address } = useAppContext();

    const isSold = token.sold;
    const isWithdrawn = token.withdrawn;
    const hasSignature = token.signature;
    const isOwnToken = address === token.seller;

  return (
    <div className="token-card">
      <h3>
        <strong>ID:</strong> {token.tokenId}
      </h3>
      <h3>
        <strong>Name Token</strong> {token.tokenName}
      </h3>
      <p>
        <strong>Seller:</strong> {token.seller}
      </p>
      <p>
        <strong>Address:</strong> {token.tokenAddress}
      </p>
      <p>
        <strong>Price:</strong> {ethers.formatEther(token.price)}
      </p>
      <p>
        <strong>Quantity:</strong> {ethers.formatEther(token.quantity)}
      </p>
      {isWithdrawn ? (
        <button className="header-buttons" style={{ cursor: "not-allowed" }}>
          Reward already withdrawn
        </button>
      ) : isSold ? (
        <button
          className="header-buttons"
          onClick={() =>
            withdrawTokenUser(signer!, connected, Number(token.tokenId))
          }
        >
          Withdraw
        </button>
      ) : hasSignature ? (
        <button
          className="header-buttons"
          onClick={() =>
            listToken(
              signer!,
              connected,
              token.tokenAddress,
              token.price,
              token.quantity,
              token.seller,
              token.signature
            )
          }
        >
          Ejecute Listing and Purchase
        </button>
      ) : isOwnToken ? (
        <button className="header-buttons" style={{ cursor: "not-allowed" }}>
          Token propio aún no vendido
        </button>
      ) : (
        <button
          className="header-buttons"
          onClick={() => buyToken(signer!, connected, Number(token.tokenId))}
        >
          Buy
        </button>
      )}
    </div>
  );
}

