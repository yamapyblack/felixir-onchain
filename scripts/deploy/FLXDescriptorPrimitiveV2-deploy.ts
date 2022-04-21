import { ethers } from "hardhat";
import { Addresses, KmsSigner } from "../common"
import { Addr } from "../addresses"
import { FLXPrimitiveV2 } from "../../typechain/FLXPrimitiveV2"
import { FLXDescriptorPrimitive } from "../../typechain/FLXDescriptorPrimitive"

import { waffle } from "hardhat";
const { deployContract } = waffle;

async function main() {
  const signer = KmsSigner()

  const FLXPrimitiveV2 = await ethers.getContractFactory("FLXPrimitiveV2");
  const c1 = (await FLXPrimitiveV2.connect(signer).deploy()) as FLXPrimitiveV2
  // const c1 = (await FLXPrimitiveV2.deploy()) as FLXPrimitiveV2
  await c1.deployed();
  console.log("FLXPrimitiveV2 to:", c1.address);

  const c2 = (await ethers.getContractAt("FLXDescriptorPrimitive", Addr.FLXDescriptorPrimitive)) as FLXDescriptorPrimitive

  // const tx1 = await c1.setDescriptor(c2.address)
  const tx1 = await c1.connect(signer).setDescriptor(c2.address)
  console.log(tx1)
  // const tx2 = await c2.setToken(c1.address)
  const tx2 = await c2.connect(signer).setToken(c1.address)
  console.log(tx2)
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
