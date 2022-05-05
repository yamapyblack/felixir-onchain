import { ethers } from "hardhat";
import { Addr } from "../../addresses"
import { encode } from "../../svg/encoder";
import { FLXPrimitive } from "../../../typechain/FLXPrimitive"
import { NilAddress } from "../../../scripts/common";
import { Addresses, KmsSigner } from "../../common"

async function main() {
  const signer = KmsSigner()

  const c0 = (await ethers.getContractAt("FLXPrimitive", Addr.FLXPrimitive)) as FLXPrimitive
  
  const tx = await c0.connect(signer).setDescriptor(NilAddress)
  console.log(tx)
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
