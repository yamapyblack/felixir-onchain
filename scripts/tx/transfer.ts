import { ethers } from "hardhat";
import { KmsSigner } from "../common";
import { Addr } from "../addresses";
import { IERC721 } from "../../typechain/IERC721";

async function main() {
  const signer = KmsSigner();

  const tokenId = 1613;
  const to = "";

  const c0 = (await ethers.getContractAt(
    "IERC721",
    Addr.FLXPrimitiveV2
  )) as IERC721;

  const tx2 = await c0.connect(signer).transferFrom(Addr.Deployer, to, tokenId);
  console.log(tx2);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
