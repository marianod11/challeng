import { apiClient, handleError } from './apiClient';
import { BodyTokenId, EventData } from "../types/types";

export const purchaseToken = async (body: BodyTokenId): Promise<EventData | undefined> => {
    try {
        const response = await apiClient.post<EventData>(`smartcontracts/purchase`, JSON.stringify(body));
        return response.data;
    } catch (error) {
        handleError(error);
    }
};

export const withdrawToken = async (body: BodyTokenId): Promise<EventData | undefined> => {
    try {
        const response = await apiClient.post<EventData>(`smartcontracts/withdraw`, JSON.stringify(body));
        return response.data;
    } catch (error) {
        handleError(error);
    }
};

