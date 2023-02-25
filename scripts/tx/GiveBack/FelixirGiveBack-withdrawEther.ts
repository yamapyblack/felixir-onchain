import { ethers } from "hardhat";
import { utils } from "ethers";
import { Addr } from "../../addresses";
import { KmsSigner } from "../../common";
import { FelixirGiveBack } from "../../../typechain-types/contracts/governance/FelixirGiveBack";

async function main() {
  const signer = KmsSigner();

  const c0 = (await ethers.getContractAt(
    "FelixirGiveBack",
    Addr.FelixirGiveBack
  )) as FelixirGiveBack;

  const tx = await c0.connect(signer).withdrawEther(utils.parseEther("5"));
  console.log(tx);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
