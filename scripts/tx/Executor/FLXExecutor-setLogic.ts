import { ethers } from "hardhat";
import { Addr } from "../../addresses";
import { KmsSigner } from "../../common";
import { FelixirExecutor } from "../../../typechain/FelixirExecutor";

async function main() {
  const signer = KmsSigner();

  const c0 = (await ethers.getContractAt(
    "FelixirExecutor",
    Addr.FelixirExecutor
  )) as FelixirExecutor;
  const tx = await c0.connect(signer).setLogic("");
  console.log(tx);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
