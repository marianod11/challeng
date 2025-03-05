import { ethers } from "ethers";
import {
    createListTokenOrStoreSignature,
    createStoreSignature,
    generateEIP712Message,
    getNonce,
} from "../../service/apiCreateListTokenAndSignature";
import addresses from "../../config.json";
import { NewValue, BodyListTokenOrStoreSignature } from "../../types/types";



export const createSignature = async (
    signer: ethers.JsonRpcSigner,
    body: NewValue
   
): Promise<string | undefined> => {
    try {
        const response = await generateEIP712Message()
        const sig = await signer.signTypedData(
            response.domain,
            response.types,
            body
        );
        return sig;
    } catch (err) {
        console.error("Error creating signature", err);
        throw err;
    }
};

export const handleSubmit = async (
    e: React.FormEvent,
    signer: ethers.JsonRpcSigner,
    address: string,
    tokenAddress: string,
    price: string,
    quantity: string,
    useSignature: boolean,
    setLoading: (loading: boolean) => void,
    connected: boolean
) => {
    if (!connected) {
        alert("Please connect your wallet");
        return;
    }
    e.preventDefault();
    setLoading(true);
    const nonce = await getNonce(address);
    const body: BodyListTokenOrStoreSignature = {
        seller: address,
        tokenAddress,
        price: ethers.parseEther(price).toString(),
        quantity: ethers.parseEther(quantity).toString(),
        nonce:nonce
    };



    if (useSignature) {
        const newValue: NewValue = {
            tokenAddress,
            price: BigInt(ethers.parseEther(price)),
            quantity: BigInt(ethers.parseEther(quantity)),
            nonce: BigInt(nonce?.toString()),
        };

        const sig = await createSignature(signer, newValue);
        if (!sig) {
            alert("Signature could not be generated");
            setLoading(false);
            return;
        }
        body.signature = sig;
        try {
            const response = await createStoreSignature(body);
            alert(response!.message);
        } catch (error) {
            console.error("Error", error);
        }
    } else {
        try {
            const response = await createListTokenOrStoreSignature(body);
            const data = {
                to: addresses.marketPlace,
                data: response!.data,
                value: 0,
            };
            const txResponse = await signer.sendTransaction(data);
            await txResponse.wait();
            alert("Token listed successfully (direct)");
        } catch (error) {
            console.error("Error in direct listing", error);
        }
    }
    setLoading(false);
};

const erc20Abi = [
    "function approve(address spender, uint256 amount) public returns (bool)",
    "function allowance(address owner, address spender) public view returns (uint256)",
];

export const approveToken = async (
    signer: ethers.JsonRpcSigner,
    tokenAddress: string,
    quantity: string,
    connected: boolean
) => {
    try {
        if(!connected) {
            alert("Please connect your wallet");
            return;
        }
        const contract = new ethers.Contract(tokenAddress, erc20Abi, signer);
        const tx = await contract.approve(
            addresses.marketPlace,
            ethers.parseEther(quantity)
        );
        await tx.wait();
        alert("Approval successful!");
    } catch (error) {
        console.error("Error in approveToken", error);
    }
};


export const checkTokenApproval = async (
    signer: ethers.JsonRpcSigner,
    tokenAddress: string,
    spenderAddress: string,
    setIsApproved: (approved: boolean) => void,
    quantity: string
) => {
    try {
        const tokenContract = new ethers.Contract(tokenAddress, erc20Abi, signer);

        const allowance = await tokenContract.allowance(signer.address, spenderAddress);
        if ( Number(allowance) >= Number(ethers.formatEther(quantity))) {
        setIsApproved(true)
        }
    } catch (error) {
        console.error("Error checking token approval", error);
        return false; 
    }
};