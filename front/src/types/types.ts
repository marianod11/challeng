import { TypedDataDomain, TypedDataField } from "ethers";

export type NewValue = {
    tokenAddress: string;
    price: bigint;
    quantity: bigint;
    nonce: bigint;
}

export type BodyListTokenOrStoreSignature = {
    seller?: string;
    tokenAddress: string;
    price: string ;
    quantity: string;
    signature ?: string;
    nonce ?: string;
}

export type Signature = {
     domain: TypedDataDomain;
      types: Record<string, TypedDataField[]>;
}

export type TokensData = {
    seller: string;
    tokenName: string;
    tokenSymbol: string;
    tokenAddress: string;
    price: string;
    quantity: string;
    sold?: boolean;
    withdrawn?: boolean;
    tokenId?: number;
    signature?: string;
};

export type TokenListAvailableAndSold = {
    availableTokens: TokensData[];
    soldTokens: TokensData[];
};

export type BodyTokenId = {
    tokenId: number;
}

export type EventData = {
    data: string;
    value?: string;
};

export type StoreSignature = {
    executed: boolean;
    message: string;
}

