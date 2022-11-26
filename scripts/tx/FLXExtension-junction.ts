import { ethers } from "hardhat";
import { KmsSigner } from "../common";
import { Addr } from "../addresses";
import { encode } from "../svg/encoder";
import { FLXPrimitiveV2 } from "../../typechain/FLXPrimitiveV2";
import { FLXExtension } from "../../typechain/FLXExtension";

async function main() {
  const signer = KmsSigner();

  const parentTokenId = 598;
  const childTokenId = 2;

  const c0 = (await ethers.getContractAt(
    "FLXPrimitiveV2",
    Addr.FLXPrimitiveV2
  )) as FLXPrimitiveV2;

  const tx2 = await c0
    .connect(signer)
    .junction(parentTokenId, [{ addr: Addr.FLXExtension, id: childTokenId }]);
  console.log(tx2);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
