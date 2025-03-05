import "./App.css";
import {Home} from "./pages/Home";
import {ListToken} from "./pages/ListToken";
import {Withdraw} from "./pages/Withdraw";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Header } from "./components/header/Header";
import { AppProvider } from "./context/appContext";
import { Users } from "./pages/Users";
import "./index.css";


function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/list-tokens" element={<ListToken />} />
          <Route path="/withdraw" element={<Withdraw />} />
          <Route path="/users" element={<Users />} />
        </Routes>
      </BrowserRouter>
    </AppProvider>
  );
}

export default App;
