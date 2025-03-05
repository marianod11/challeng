export interface BodyListTokenOrStoreSignature {
    seller: string;
    tokenAddress: string;
    price: string;
    quantity: string;
    signature?: string;
    nonce?: string;
}

export type BodyTokenId = {
    tokenId: number;
}

export interface TokenList {
    seller: string;
    tokenName: string;
    tokenSymbol: string;
    tokenAddress: string;
    price: string;     
    quantity: string;
    sold: boolean;
    withdrawn: boolean;
}
