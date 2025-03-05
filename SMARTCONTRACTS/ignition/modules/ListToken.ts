import { ethers } from "hardhat";

async function main() {
    const [deployer, seller] = await ethers.getSigners();

    const baseTokenAAddress = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";
    const marketPlaceAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

    const baseTokenA = await ethers.getContractAt("BaseToken", baseTokenAAddress);

    const marketPlace = await ethers.getContractAt("MarketPlace", marketPlaceAddress);

    const quantity = ethers.parseEther("500"); 
    const price = ethers.parseEther("5");      

    const txTranfer = await baseTokenA.connect(deployer).transfer(seller.address, quantity);
    await txTranfer.wait();


    const approveTx = await baseTokenA.connect(seller).approve(marketPlaceAddress, quantity);
    await approveTx.wait();

    const listTokenTx = await marketPlace.connect(seller).listToken(baseTokenAAddress, price, quantity);
    await listTokenTx.wait();
    console.log("Token listado correctamente.");
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error("Error en el script:", error);
        process.exit(1);
    });