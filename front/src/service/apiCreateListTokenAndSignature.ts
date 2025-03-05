
import { apiClient, handleError } from './apiClient';
import { BodyListTokenOrStoreSignature, EventData, StoreSignature, Signature } from "../types/types";




export const createListTokenOrStoreSignature = async (body: BodyListTokenOrStoreSignature): Promise<EventData | undefined> => {
    try {
        const response = await apiClient.post<EventData>(`smartcontracts/list`, JSON.stringify(body));
        return response.data;
    } catch (error) {
        handleError(error);
    }
};

export const createStoreSignature = async (body: BodyListTokenOrStoreSignature): Promise<StoreSignature | undefined> => {
    try {
        const response = await apiClient.post<StoreSignature>(`smartcontracts/storeSignature`, JSON.stringify(body));
        return response.data;
    } catch (error) {
        handleError(error);
    }
};


export const getNonce = async (address: string): Promise<string | undefined> => {
    try { 
        const response = await apiClient.get<string>(`smartcontracts/nonce/${address}`);
        return response.data;
    } catch (error) {
        handleError(error);
    }
};



export const generateEIP712Message = async (): Promise<Signature> => {
    try {
        const response = await apiClient.post<Signature>(`smartcontracts/genereteEIP712Message`);
        return response.data;
    } catch (error) {
        handleError(error);
        throw new Error("Error al generar el mensaje EIP-712.");
    }
};

export const deleteSignature = async (signature: string) => {
    try {
        await apiClient.post(`smartcontracts/deleteSignature`, {signature});
        
    } catch (error) {
        handleError(error);
    }
};


