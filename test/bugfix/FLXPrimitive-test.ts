import "@nomiclabs/hardhat-waffle";
import { ethers } from "hardhat";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/dist/src/signer-with-address";
import { encode } from "../../scripts/svg/encoder";
import { promises as fs } from "fs";
import { expect, use } from 'chai'
import path from "path";

// test contracts and parameters
import { FLXPrimitive } from "../../typechain/FLXPrimitive";
import { FLXPrimitiveV2 } from "../../typechain/FLXPrimitiveV2";

describe("FLXPrimitive-test", async () => {
  let owner :SignerWithAddress, addr1 :SignerWithAddress, addr2 :SignerWithAddress

  let c: FLXPrimitive;
  let c2: FLXPrimitiveV2;

  beforeEach(async () => {
    [owner, addr1, addr2,] = await ethers.getSigners()

    const FLXPrimitive = await ethers.getContractFactory("FLXPrimitive");
    c = (await FLXPrimitive.deploy()) as FLXPrimitive;
    await c.deployed();

    const FLXPrimitiveV2 = await ethers.getContractFactory("FLXPrimitiveV2");
    c2 = (await FLXPrimitiveV2.deploy()) as FLXPrimitiveV2;
    await c2.deployed();
  });

  describe("test", async () => {
    it("fail V1 1", async () => {
      await c["mint(address,uint256)"](addr1.address, 1)
      // bug
      await expect(c.connect(addr1)["safeTransferFrom(address,address,uint256)"](addr1.address, addr2.address, 1)).reverted
    });

    it("fail V1 2", async () => {
      await c["mint(address,uint256)"](addr1.address, 1)
      await c["mint(address,uint256)"](addr1.address, 2)
      await c.connect(addr1)["safeTransferFrom(address,address,uint256)"](addr1.address, addr2.address, 1)
      // bug
      await expect(c.connect(addr1)["safeTransferFrom(address,address,uint256)"](addr1.address, addr2.address, 2)).reverted
    });

    it("success V2", async () => {
      await c2["mint(address,uint256)"](addr1.address, 1)
      await c2.connect(addr1)["safeTransferFrom(address,address,uint256)"](addr1.address, addr2.address, 1)
      await c2.connect(addr2)["safeTransferFrom(address,address,uint256)"](addr2.address, addr1.address, 1)
      expect(await c2.ownerOf(1)).equals(addr1.address)
    });

    it("success V2 2", async () => {
      await c2["mint(address,uint256)"](addr1.address, 1)
      await c2["mint(address,uint256)"](addr1.address, 2)
      await c2.connect(addr1)["safeTransferFrom(address,address,uint256)"](addr1.address, addr2.address, 1)
      await c2.connect(addr1)["safeTransferFrom(address,address,uint256)"](addr1.address, addr2.address, 2)
      expect(await c2.ownerOf(1)).equals(addr2.address)
      expect(await c2.ownerOf(2)).equals(addr2.address)
    });
  });
});
