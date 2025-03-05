import { apiClient, handleError } from './apiClient';
import { TokenListAvailableAndSold, TokensData } from "../types/types";

export const availableAndSold = async (): Promise<TokenListAvailableAndSold | undefined> => {
    try {
        const response = await apiClient.get<TokenListAvailableAndSold>(`smartcontracts/availableAndSold`);
        return {
            availableTokens: response.data.availableTokens,
            soldTokens: response.data.soldTokens,
        } ;
    } catch (error) {
        handleError(error);
    }
};

export const getTokenSignature = async (): Promise<TokensData[] | []> => {
    try {
        const response = await apiClient.get<TokensData[]>(`smartcontracts/tokenListSignatures`);
        return response.data;
    } catch (error) {
        handleError(error);
        return [];
    }
}

export const getWithdrawUsers = async (address: string): Promise<TokensData[] | []> => {
    try{
        const response = await apiClient.get<TokensData[]>(`smartcontracts/tokenListUser/${address}`);
        return response.data;
    } catch (error) {
        handleError(error);
        return [];
    }
}


