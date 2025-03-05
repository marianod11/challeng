import { Injectable, HttpStatus, HttpException } from '@nestjs/common';
import { ethers } from 'ethers';
import * as dotenv from 'dotenv';
import marketplaceABI from './ABIS/MarketPlaceAbi.json';
import { BodyListTokenOrStoreSignature, TokenList } from './interfaces/interfaces';

dotenv.config();

@Injectable()
export class SmartcontractsService {
    private provider: ethers.JsonRpcProvider;
    private contract: ethers.Contract;
    private marketplaceAddress: string = process.env.MARKETPLACE_ADDRESS;

    constructor() {
        this.provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
        this.contract = new ethers.Contract(this.marketplaceAddress, marketplaceABI, this.provider);
    }
    

    async listTokenWithSignature(
        data: BodyListTokenOrStoreSignature
    ) {
        try {
            const {seller, tokenAddress, price, quantity, signature } = data;

            const priceInWei = BigInt(price);
            const quantityInWei = BigInt(quantity);
            const txData = this.contract.interface.encodeFunctionData("listTokenWithSignature", [
                seller,
                tokenAddress,
                priceInWei,
                quantityInWei,
                signature
            ]);

            return {
                data: txData
            };
        } catch (error) {
            throw new HttpException(`Failed to list token: ${error.message}`, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async listToken(data: BodyListTokenOrStoreSignature) {
        try {
            const { tokenAddress, price, quantity } = data;
            const priceInWei = ethers.parseEther(price);
            const quantityInWei = ethers.parseEther(quantity);

            const txData = this.contract.interface.encodeFunctionData("listToken", [
                tokenAddress,
                priceInWei,
                quantityInWei
            ]);

            return {
                data: txData
            };
        } catch (error) {
            throw new HttpException(`Failed to list token: ${error.message}`, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async purchaseToken(tokenId: number) {
        try {
            const tokenList = await this.contract.listTokens(tokenId);
            const priceInWei = tokenList.price.toString();

            const txData = this.contract.interface.encodeFunctionData("buyToken", [tokenId]);

            return {
                data: txData,
                value: priceInWei 
            };
        } catch (error) {
            throw new HttpException(`Failed to buy token: ${error.message}`, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async withdrawToken(tokenId: number) {
        try {
            const txData = this.contract.interface.encodeFunctionData("withdrawToken", [tokenId]);

            return {
                data: txData
            };
        } catch (error) {
            throw new HttpException(`Failed to withdraw token: ${error.message}`, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async getNonce(address: string) {
        try {
            const nonce = await this.contract.getNonce.staticCall(address);
            return nonce.toString();
        } catch (error: any) {
            throw new HttpException(`Failed to fetch nonce: ${error.message}`, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    private mapTokenList(tokenListRaw: any[]): TokenList[] {
        return tokenListRaw.map((token: any) => ({
            seller: token[0],
            tokenName: token[1],
            tokenSymbol: token[2],
            tokenAddress: token[3],
            price: token[4].toString(),
            quantity: token[5].toString(),
            sold: token[6],
            withdrawn: token[7],
            tokenId: token[8].toString(),
        }));
    }

    async getAvailableAndSoldTokens(): Promise<{ availableTokens: TokenList[]; soldTokens: TokenList[] }> {
        try {
            const tokenListRaw = await this.contract.getAllTokens.staticCall();
            const tokens = this.mapTokenList(tokenListRaw);
            const availableTokens = tokens.filter((token) => !token.sold);
            const soldTokens = tokens.filter((token) => token.sold);

            return { availableTokens, soldTokens };
        } catch (error: any) {
            throw new HttpException(`Failed to fetch tokens: ${error.message}`, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async getTokenListUser(address: string) {
        try {
            const tokenListRaw = await this.contract.getUsersListTokens(address);
            return this.mapTokenList(tokenListRaw);
        } catch (error: any) {
            throw new HttpException(`Failed to fetch tokens: ${error.message}`, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
        
}
