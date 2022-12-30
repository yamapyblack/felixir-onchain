import { ethers } from "hardhat";
import { KmsSigner } from "../common";
import { Addr } from "../addresses";
import { FLXPrimitiveV2 } from "../../typechain/FLXPrimitiveV2";

async function main() {
  const signer = KmsSigner();

    // const parentTokenId = 598;
    const parentTokenId = 1613;

  const c0 = (await ethers.getContractAt(
    "FLXPrimitiveV2",
    Addr.FLXPrimitiveV2
  )) as FLXPrimitiveV2;

  const tx2 = await c0.connect(signer).unJunctionAll(parentTokenId);
  console.log(tx2);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
