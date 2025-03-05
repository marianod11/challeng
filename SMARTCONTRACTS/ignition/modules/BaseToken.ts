import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";


const BaseTokenModule = buildModule("BaseTokenModule", (m) => {


  const baseTokenA = m.contract("BaseToken", ["TOKENA", "TOKENA"]);

    return { baseTokenA };
});
export default BaseTokenModule;
