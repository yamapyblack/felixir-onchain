import { ethers } from "hardhat";
import { KmsSigner } from "../../common";
import { Addr } from "../../addresses";

async function main() {
  const signer = KmsSigner();

  const amount = "2";
  const to = Addr.FLXTemp;
  const tx = await signer.sendTransaction({
    to: to,
    value: ethers.utils.parseEther(amount),
    // gasLimit: 22000,
  });
  console.log(tx);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
