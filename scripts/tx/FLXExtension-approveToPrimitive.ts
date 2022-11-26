import { ethers } from "hardhat";
import { KmsSigner } from "../common";
import { Addr } from "../addresses";
import { encode } from "../svg/encoder";
import { FLXPrimitiveV2 } from "../../typechain/FLXPrimitiveV2";
import { FLXExtension } from "../../typechain/FLXExtension";

async function main() {
  const signer = KmsSigner();

  const c1 = (await ethers.getContractAt(
    "FLXExtension",
    Addr.FLXExtension
  )) as FLXExtension;

  const tx = await c1
    .connect(signer)
    .setApprovalForAll(Addr.FLXPrimitiveV2, true);
  console.log(tx);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
