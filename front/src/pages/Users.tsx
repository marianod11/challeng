import { useEffect , useState} from "react";
import { getWithdrawUsers, TokensData } from "../service/apiCallsTokensList";
import { TokenCard } from "../components/tokenCard/tokenCard";
import { useAppContext } from "../context/appContext";


export const Users = () => {

    const {address} = useAppContext();
    const [withdrawableUsers, setWithdrawableUsers] = useState<TokensData[]>(
      []
    );

    useEffect(() => {
    const fetchData = async () => {
        const tokensList = await getWithdrawUsers(address!);
        setWithdrawableUsers(tokensList!);
    };
    fetchData();
    }, []);


    return (
      <main>
        <section>
          <h2 className="title">Users Token List</h2>
          <div className="token-grid">
            {withdrawableUsers.length > 0 ? (
              withdrawableUsers
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