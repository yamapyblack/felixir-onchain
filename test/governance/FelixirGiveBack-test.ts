import "@nomiclabs/hardhat-waffle";
import { ethers } from "hardhat";
import { utils } from "ethers";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/dist/src/signer-with-address";
import { expect } from "chai";
import { FelixirGiveBack } from "../../typechain-types/contracts/governance/FelixirGiveBack";
import { ERC721Mock } from "../../typechain/ERC721Mock";

describe("FelixirGiveBack.sol", () => {
  let felixirGiveBack: FelixirGiveBack;
  let mockERC721: ERC721Mock;
  let owner: SignerWithAddress;
  let user1: SignerWithAddress;
  let user2: SignerWithAddress;
  let other: SignerWithAddress;

  beforeEach(async () => {
    [owner, user1, user2, other] = await ethers.getSigners();
    mockERC721 = (await (
      await ethers.getContractFactory("ERC721Mock")
    ).deploy()) as ERC721Mock;
    felixirGiveBack = (await (
      await ethers.getContractFactory("FelixirGiveBack")
    ).deploy(mockERC721.address)) as FelixirGiveBack;
    //mint
    await mockERC721.mint(user1.address, 1);
    await mockERC721.mint(user1.address, 2);
    await mockERC721.mint(user1.address, 3);
    //send eth to FelixirGiveBack
    // console.log("ownerbal", (await owner.getBalance()).toString());
    await owner.sendTransaction({
      value: utils.parseEther("400"),
      to: felixirGiveBack.address,
    });
  });

  describe("constructor()", () => {});

  describe("deposit()", () => {
    it("fail not own", async () => {
      await expect(felixirGiveBack.connect(user1).deposit(4)).to.be.reverted;
    });
    it("fail not approved", async () => {
      await expect(felixirGiveBack.connect(user1).deposit(1)).to.be.reverted;
    });
    it("success", async () => {
      //initial user1's ETH balance
      console.log("before", (await user1.getBalance()).toString());

      await mockERC721
        .connect(user1)
        .setApprovalForAll(felixirGiveBack.address, true);
      await felixirGiveBack.connect(user1).deposit(1);

      console.log("after", (await user1.getBalance()).toString());
      expect(await mockERC721.ownerOf(1)).to.equal(felixirGiveBack.address);
      expect(await felixirGiveBack.backedTokenIds(1)).to.equal(true);
    });
    it("fail twice", async () => {
      await mockERC721
        .connect(user1)
        .setApprovalForAll(felixirGiveBack.address, true);
      await felixirGiveBack.connect(user1).deposit(1);
      await expect(felixirGiveBack.connect(user1).deposit(1)).to.be.reverted;
    });
  });
  describe("deposit()", () => {
    it("success", async () => {
      console.log("before", (await user1.getBalance()).toString());

      await mockERC721
        .connect(user1)
        .setApprovalForAll(felixirGiveBack.address, true);
      await felixirGiveBack.connect(user1).bulkDeposit([1, 2]);

      console.log("after", (await user1.getBalance()).toString());
    });
    it("fail twice", async () => {
      await mockERC721
        .connect(user1)
        .setApprovalForAll(felixirGiveBack.address, true);
      await expect(felixirGiveBack.connect(user1).bulkDeposit([1, 1, 2])).to.be
        .reverted;
    });
  });
});
