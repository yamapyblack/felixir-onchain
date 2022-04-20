import { ethers } from "hardhat";
import { Addr } from "../addresses"
import { encode } from "../svg/encoder";
import { FLXDescriptorPrimitive } from "../../typechain/FLXDescriptorPrimitive"

async function main() {
  const c0 = (await ethers.getContractAt("FLXDescriptorPrimitive", Addr.FLXDescriptorPrimitive)) as FLXDescriptorPrimitive
  const tx = await c0.generateImage(5001)
  console.log(tx)
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
