import { purchaseToken, withdrawToken } from "../../service/apiPurchaseAndWithdraw";
import { createListTokenOrStoreSignature, deleteSignature } from "../../service/apiCreateListTokenAndSignature";
import { ethers } from "ethers";
import addresses from "../../config.json";

export async function buyToken(signer: ethers.JsonRpcSigner, connected: boolean, tokenId: number) {
    try {
        if (!connected) {
            alert("Please connect your wallet");
            return;
        }

        const body = { tokenId };
        const response = await purchaseToken(body);

        const data = {
            to: addresses.marketPlace,
            data: response!.data,
            value: response!.value,
        };

        const txResponse = await signer!.sendTransaction(data);
        await txResponse.wait();
        alert("Token purchased successfully");
    } catch (error: any) {
        alert(error.reason);
    }
}

export async function listToken(
    signer: ethers.JsonRpcSigner,
    connected: boolean,
    tokenAddress: string,
    price: string,
    quantity: string,
    seller?: string,
    signature?: string
) {
    try {
        if (!connected) {
            alert("Please connect your wallet");
            return;
        }

        const body = { seller, tokenAddress, price, quantity, signature };
        const response = await createListTokenOrStoreSignature(body);

        const data = {
            to: addresses.marketPlace,
            data: response!.data,
            value: signature ? price : 0,
        };

        const txResponse = await signer!.sendTransaction(data);
        await txResponse.wait();
        if (signature) {
            await deleteSignature(signature);
        }
        alert("Token listed successfully");
    } catch (error: any) {
        alert(error.reason);
    }
}

export async function withdrawTokenUser(signer: ethers.Signer, connected: boolean, tokenId: number) {
    try {
        if (!connected) {
            alert("Please connect your wallet");
            return;
        }

        const body = { tokenId };
        const response = await withdrawToken(body);

        const data = {
            to: addresses.marketPlace,
            data: response!.data,
            value: response!.value,
        };

        const txResponse = await signer!.sendTransaction(data);
        await txResponse.wait();

        alert("ETH withdrawn successfully");
    } catch (error: any) {
        alert(error.reason);
    }
}
