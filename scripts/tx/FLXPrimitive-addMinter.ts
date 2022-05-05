import { ethers } from "hardhat";
import { KmsSigner, Addresses } from "../common"
import { Addr } from "../addresses"
import { encode } from "../svg/encoder";
import { FLXPrimitive } from "../../typechain/FLXPrimitive"

async function main() {
  const signer = KmsSigner()

  const c0 = (await ethers.getContractAt("FLXPrimitive", Addr.FLXPrimitive)) as FLXPrimitive
  const tx = await c0.connect(signer).grantRole((await c0.MINTER_ROLE()), Addr.FelixirShop)
  console.log(tx)
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
