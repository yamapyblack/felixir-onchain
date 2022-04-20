import { ethers } from "hardhat";
import { Addresses, KmsSigner } from "../common"
import { FLXPrimitive } from "../../typechain/FLXPrimitive"

import { waffle } from "hardhat";
const { deployContract } = waffle;

async function main() {
  const signer = KmsSigner()
  // const addresses = Addresses()!

  const NFTDescriptor = await ethers.getContractFactory("NFTDescriptor");
  const c0 = await NFTDescriptor.connect(signer).deploy();
  await c0.deployed();
  console.log("NFTDescriptor to:", c0.address);

  const FLXPrimitive = await ethers.getContractFactory("FLXPrimitive");
  const c1 = (await FLXPrimitive.connect(signer).deploy()) as FLXPrimitive
  await c1.deployed();
  console.log("FLXPrimitive to:", c1.address);

  const FLXDescriptorPrimitive = await ethers.getContractFactory("FLXDescriptorPrimitive", {
    libraries: { NFTDescriptor: c0.address },
  });
  const c2 = await FLXDescriptorPrimitive.connect(signer).deploy();
  await c2.deployed();
  console.log("FLXDescriptorPrimitive to:", c2.address);

  const tx1 = await c1.connect(signer).setDescriptor(c2.address)
  console.log(tx1)
  const tx2 = await c2.connect(signer).setToken(c1.address)
  console.log(tx2)

}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
