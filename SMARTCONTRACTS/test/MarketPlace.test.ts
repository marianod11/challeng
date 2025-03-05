import {
  loadFixture,
} from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { expect } from "chai";
import hre, { ethers } from "hardhat";
import { TypedDataDomain } from "ethers";

describe("MarketPlace", function () {
  async function deployFixture() {
    const [owner, seller, buyer] = await hre.ethers.getSigners();

    const MarketPlace = await hre.ethers.getContractFactory("MarketPlace");
    const marketPlace = await MarketPlace.deploy();
    await marketPlace.waitForDeployment();

    const BaseToken = await hre.ethers.getContractFactory("BaseToken");
    const baseTokenA = await BaseToken.deploy("TOKENA", "TOKENA");
    await baseTokenA.waitForDeployment();

    const amount = ethers.parseEther("10000")
    const txTranfer = await baseTokenA.connect(owner).transfer(seller.address, amount);
    await txTranfer.wait();

    return { marketPlace, baseTokenA, seller, buyer, owner};
  }

  describe("TEST E2E", function () {
    it("Should E2E WITHOUT SIGNATURE", async function () {
      const { marketPlace, baseTokenA, seller, buyer,  } = await loadFixture(deployFixture);
      const quantity = ethers.parseEther("500")
      const marketPlaceAddress = marketPlace.target
      const baseTokenAddress = baseTokenA.target
      const approve = await baseTokenA.connect(seller).approve(marketPlaceAddress, quantity);
      await approve.wait()

      const price = ethers.parseEther("5")
      const listToken = await marketPlace.connect(seller).listToken(baseTokenAddress, price, quantity )
      await listToken.wait()

      const buyToken = await marketPlace.connect(buyer).buyToken(0, { value: price })
      await buyToken.wait()


      const tokenListAfterBuy = await marketPlace.listTokens.staticCall(0)
      
      expect(tokenListAfterBuy.sold).to.be.true


      const withdrawToken = await marketPlace.connect(seller).withdrawToken(0)
      await withdrawToken.wait()

      const tokenListAfterWithdraw = await marketPlace.listTokens.staticCall(0)
      expect(tokenListAfterWithdraw.withdrawn).to.be.true


    });

    it("Should E2E WITH SIGNATURE", async function () {
      const { marketPlace, baseTokenA, seller, buyer, owner } = await loadFixture(deployFixture);
    
      const quantity = ethers.parseEther("500");
      const price = ethers.parseEther("5");
      const marketPlaceAddress = marketPlace.target;
      const baseTokenAddress = baseTokenA.target;

      const nonce = await marketPlace.getNonce(seller.address);
      const chainId = (await ethers.provider.getNetwork()).chainId;

      const domain:TypedDataDomain = {
        name: "Marketplace",
        version: "1",
        chainId: Number(chainId),
        verifyingContract: marketPlaceAddress.toString(),
      };

      const types = {
        ListToken: [
          { name: "tokenAddress", type: "address" },
          { name: "price", type: "uint256" },
          { name: "quantity", type: "uint256" },
          { name: "nonce", type: "uint256" },
        ],
      };

      const value = {
        tokenAddress: baseTokenA.target,
        price: price,
        quantity: quantity,
        nonce:nonce,
      };


      const signature = await seller.signTypedData(domain, types, value);

      await baseTokenA.connect(seller).approve(marketPlaceAddress, quantity);


      const listToken = await marketPlace.connect(owner).listTokenWithSignature(seller.address, baseTokenAddress, price, quantity, signature,{ value: price });
      await listToken.wait();

 
      const tokenListAfterBuy = await marketPlace.listTokens.staticCall(0)

      expect(tokenListAfterBuy.sold).to.be.true

      const withdrawToken = await marketPlace.connect(seller).withdrawToken(0);
      await withdrawToken.wait();


      const tokenListAfterWithdraw = await marketPlace.listTokens.staticCall(0);
      expect(tokenListAfterWithdraw.withdrawn).to.be.true;

    });
  })
});
