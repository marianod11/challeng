import { Link } from "react-router-dom";
import "./index.css";
import { useAppContext } from "../../context/appContext";
import Logo from "../../assets/react.svg"


export const Header = () => {
  const { connected, address, connectWallet, disconnectWallet } =
    useAppContext();

  return (
    <div className="header">
      <div className="header-logo">
        <Link to="/">
          <img src={Logo} alt="Logo" className="logo" />
        </Link>
      </div>
      <nav className="header-nav">
        <ul className="nav-list">
          <li>
            <Link to="/">Market Place</Link>
          </li>
          <li>
            <Link to="/list-tokens">List tokens</Link>
          </li>
          <li>
            <Link to="/withdraw">Withdraw</Link>
          </li>
          <li>
            <Link to="/users">Users</Link>
          </li>
        </ul>
      </nav>
      <div className="header-buttons">
        {connected ? (
          <div>
            <span onClick={disconnectWallet} style={{ cursor: "pointer" }}>
              {address?.slice(0, 6)}...{address?.slice(-4)}
            </span>
          </div>
        ) : (
          <div>
            <button onClick={connectWallet}>Conect Wallet</button>
          </div>
        )}
      </div>
    </div>
  );
};
