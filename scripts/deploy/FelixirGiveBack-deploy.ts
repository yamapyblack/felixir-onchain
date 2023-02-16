import { ethers } from "hardhat";
import { KmsSigner, Addresses } from "../common";
import { Addr } from "../addresses";
import { FelixirGiveBack } from "../../typechain-types/contracts/governance/FelixirGiveBack";

async function main() {
  const signer = KmsSigner();

  const FelixirGiveBack = await ethers.getContractFactory("FelixirGiveBack");
  const c0 = await FelixirGiveBack.connect(signer).deploy(Addr.FLXPrimitiveV2);
  await c0.deployed();
  console.log("deployed to:", c0.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
