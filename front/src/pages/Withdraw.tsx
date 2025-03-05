import { useEffect , useState} from "react";
import { availableAndSold, TokensData } from "../service/apiCallsTokensList";
import { TokenCard } from "../components/tokenCard/tokenCard";


export const Withdraw = () => {

    const [withdrawableTokens, setWithdrawableTokens] = useState<TokensData[]>([]);

    useEffect(() => {
    const fetchData = async () => {
        const tokensList = await availableAndSold();
        setWithdrawableTokens(tokensList!.soldTokens);
    };
    fetchData();
    }, []);


    return (
      <main>
        <section>
          <h2 className="title">Withdraw ALL</h2>
          <div className="token-grid">
            {withdrawableTokens.length > 0 ? (
              withdrawableTokens
                .filter((token) => !token.withdrawn)
                .map((token, index) => (
                  <TokenCard
                    key={`${token.tokenAddress}-${index}`}
                    token={token}
                  />
                ))
            ) : (
              <p>No withdrawable tokens.</p>
            )}
          </div>
        </section>
      </main>
    );
};