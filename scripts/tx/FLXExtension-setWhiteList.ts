import { ethers } from "hardhat";
import { KmsSigner } from "../common";
import { Addr } from "../addresses";
import { encode } from "../svg/encoder";
import { FLXPrimitiveV2 } from "../../typechain/FLXPrimitiveV2";

async function main() {
  const signer = KmsSigner();

  const c0 = (await ethers.getContractAt(
    "FLXPrimitiveV2",
    Addr.FLXPrimitiveV2
  )) as FLXPrimitiveV2;
  const tx = await c0.connect(signer).setWhiteList(Addr.FLXExtension, true);
  console.log(tx);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
