import  { useEffect, useState } from "react";
import {
  availableAndSold,
  getTokenSignature,
} from "../service/apiCallsTokensList";
import { TokenCard } from "../components/tokenCard/tokenCard";
import { TokensData } from "../types/types";

export const Home = () => {
  const [availableTokens, setAvailableTokens] = useState<TokensData[]>([]);
  const [tokensSignature, setTokensSignature] = useState<TokensData[]>([]);
  const [soldTokens, setSoldTokens] = useState<TokensData[]>([]);
  const [sortOption, setSortOption] = useState<
    "lowToHigh" | "highToLow" | "default"
  >("default");

  useEffect(() => {
    const fetchData = async () => {
      const allTokensList = await availableAndSold();
      const tokensListSignature = await getTokenSignature();
      setTokensSignature(tokensListSignature);
      setAvailableTokens(allTokensList!.availableTokens);
      setSoldTokens(allTokensList!.soldTokens);
    };
    fetchData();
  }, []);

  const sortTokens = (tokens: TokensData[]) => {
    if (sortOption === "default") return tokens;

    return [...tokens].sort((a, b) => {
      const priceA = a.price ?? 0;
      const priceB = b.price ?? 0;

      return sortOption === "lowToHigh" ? Number(priceB) - Number(priceA) : Number(priceA) - Number(priceB);
    });
  };

  const renderTokenSection = (
    title: string,
    tokens: TokensData[],
    emptyMessage: string
  ) => {
    const sortedTokens = sortTokens(tokens);

    return (
      <section>
        <div className="section-header">
          <h2 className="title">{title}</h2>
          <select
            className="sort-select"
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value as any)}
          >
            <option value="default">Default Order</option>
            <option value="lowToHigh">Price: Low to High</option>
            <option value="highToLow">Price: High to Low</option>
          </select>
        </div>

        <div className="token-grid">
          {sortedTokens.length > 0 ? (
            sortedTokens.map((token, index) => (
              <TokenCard key={`${token.tokenAddress}-${index}`} token={token} />
            ))
          ) : (
            <p>{emptyMessage}</p>
          )}
        </div>
      </section>
    );
  };

  return (
    <main>
      {renderTokenSection(
        "Tokens Signature",
        tokensSignature,
        "No tokens signature."
      )}

      {renderTokenSection(
        "Available Tokens",
        availableTokens,
        "No available tokens."
      )}

      {renderTokenSection("Sold Tokens", soldTokens, "No sold tokens.")}
    </main>
  );
};
