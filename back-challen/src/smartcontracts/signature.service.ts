import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { ethers } from 'ethers';
import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';
import marketplaceABI from './ABIS/MarketPlaceAbi.json';
import { BodyListTokenOrStoreSignature, TokenList } from './interfaces/interfaces';
import { TypedDataDomain, TypedDataField } from 'ethers';

dotenv.config();

@Injectable()
export class SignatureService {
    private provider: ethers.JsonRpcProvider;
    private contract: ethers.Contract;
    private filePath: string;
    private marketplaceAddress: string = process.env.MARKETPLACE_ADDRESS;

    constructor() {
        this.provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
        this.contract = new ethers.Contract(this.marketplaceAddress, marketplaceABI, this.provider);
        this.filePath = path.join(__dirname, '../../tokenListSignatures.json');
    }


    async storeSignature(data: BodyListTokenOrStoreSignature) {
        try {
            let tokenListSign: BodyListTokenOrStoreSignature[] = [];

            if (fs.existsSync(this.filePath)) {
                const fileData = fs.readFileSync(this.filePath, 'utf8');
                if (fileData) {
                    tokenListSign = JSON.parse(fileData);
                }
            }

            const dataFormatted = {
                seller: data.seller,
                tokenAddress: data.tokenAddress,
                price: data.price.toString(),
                quantity: data.quantity.toString(),
                signature: data.signature,
            };

            tokenListSign.push(dataFormatted);

            fs.writeFileSync(this.filePath, JSON.stringify(tokenListSign, null, 2));

            return { success: true, message: 'Signature stored successfully' };
        } catch (error) {
            throw new HttpException(`Error storing signature: ${error.message}`, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async getTokenListStoreSignatures(): Promise<BodyListTokenOrStoreSignature[]> {
        try {
            let tokenListSign: BodyListTokenOrStoreSignature[] = [];
            if (fs.existsSync(this.filePath)) {
                const fileData = fs.readFileSync(this.filePath, 'utf8');
                if (fileData) {
                    tokenListSign = JSON.parse(fileData);
                }
            }
            return tokenListSign;
        } catch (error: any) {
            throw new HttpException(`Error storing signature: ${error.message}`, HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }


    public async generateEIP712Message(): Promise<{ domain: TypedDataDomain; types: Record<string, TypedDataField[]> }> {
        try {
            const chainId = (await this.provider.getNetwork()).chainId;
            const name = await this.contract.NAME712();
            const version = await this.contract.VERSION712();
            const domain: TypedDataDomain = {
                name: name,
                version: version,
                chainId: Number(chainId),
                verifyingContract: this.marketplaceAddress.toString()
            };

            const types: Record<string, TypedDataField[]> = {
                ListToken: [
                    { name: "tokenAddress", type: "address" },
                    { name: "price", type: "uint256" },
                    { name: "quantity", type: "uint256" },
                    { name: "nonce", type: "uint256" },
                ],
            };

            return { domain, types };
        } catch (error) {
            throw new HttpException(`Error generating EIP712 message: ${error.message}`, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    public async deleteSignature(signature: string): Promise<{ success: boolean; message: string }> {
        try {
            if (!fs.existsSync(this.filePath)) {
                return
            }

            const fileData = fs.readFileSync(this.filePath, 'utf8');
            if (!fileData) {
                return
            }

            let tokenListSign: BodyListTokenOrStoreSignature[] = JSON.parse(fileData);
            const initialLength = tokenListSign.length;
            tokenListSign = tokenListSign.filter(item => item.signature !== signature);
            if (tokenListSign.length === initialLength) {
                return 
            }
            fs.writeFileSync(this.filePath, JSON.stringify(tokenListSign, null, 2));

            return 
        } catch (error) {
            throw new HttpException(`Error deleting signature: ${error.message}`, HttpStatus.INTERNAL_SERVER_ERROR);
        }

    }
}
