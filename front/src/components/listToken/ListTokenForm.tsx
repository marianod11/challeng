import React, { useState, useEffect } from "react";
import { useAppContext } from "../../context/appContext";
import { approveToken, handleSubmit, checkTokenApproval } from "./formUtils";
import addresses from "../../config.json";

export const ListTokenForm: React.FC = () => {
  const { signer, address, connected } = useAppContext();
  const [tokenAddress, setTokenAddress] = useState(addresses.tokenAddress);
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [useSignature, setUseSignature] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isApproved, setIsApproved] = useState(false);

  useEffect(() => {
    const checkApproval = async () => {
      if (connected) {
        setLoading(true);

         await checkTokenApproval(
           signer!,
           tokenAddress,
           addresses.marketPlace,
           setIsApproved,
           quantity
         );

        setLoading(false);
      }
    };

    if (connected && tokenAddress) {
      checkApproval();
    }
  }, [connected, isApproved, tokenAddress]);

  return (
    <form
      onSubmit={(e) =>
        handleSubmit(
          e,
          signer!,
          address!,
          tokenAddress,
          price,
          quantity,
          useSignature,
          setLoading,
          connected
        )
      }
      style={{ maxWidth: "30%", margin: "0 auto" }}
    >
      <h2>List Token</h2>
      <div>
        <label>Token Address:</label>
        <input
          type="text"
          value={tokenAddress}
          onChange={(e) => setTokenAddress(e.target.value)}
          required
        />
      </div>
      <div>
        <label>Price (ETH):</label>
        <input
          type="text"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          required
        />
      </div>
      <div>
        <label>Quantity:</label>
        <input
          type="text"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          required
        />
      </div>
      <div>
        <label style={{ display: "flex", alignItems: "center" }}>
          Use Signature (EIP-712)
          <input
            type="checkbox"
            checked={useSignature}
            onChange={(e) => setUseSignature(e.target.checked)}
          />
        </label>
      </div>
      <div
        style={{
          marginBottom: "1rem",
          display: "flex",
          justifyContent: "center",
          marginTop: "1rem",
        }}
      >
        {!isApproved && (
          <button
            className="header-buttons"
            type="button"
            onClick={() => approveToken(signer!, tokenAddress, quantity, connected)}
            disabled={loading}
          >
            {loading ? "Approving..." : "Approve Token"}
          </button>
        )}
        {isApproved && (
          <button className="header-buttons" type="submit" disabled={loading}>
            {loading ? "Submitting..." : "List Token"}
          </button>
        )}
      </div>
    </form>
  );
};
