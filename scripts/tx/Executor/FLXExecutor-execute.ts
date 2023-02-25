import { ethers } from "hardhat";
import { utils, BigNumberish, BytesLike } from "ethers";
import { Addr } from "../../addresses";
import { FelixirExecutor } from "../../../typechain/FelixirExecutor";

type Param = {
  target: string;
  value: BigNumberish;
  signature: string;
  data: BytesLike;
  eta: BigNumberish;
};

export const encodeParameters = (
  types: string[],
  values: unknown[]
): string => {
  const abi = new ethers.utils.AbiCoder();
  return abi.encode(types, values);
};

async function main() {
  const c0 = (await ethers.getContractAt(
    "FelixirExecutor",
    Addr.FelixirExecutor
  )) as FelixirExecutor;

  let param: Param = {
    target: Addr.FLXTemp,
    value: utils.parseEther("400000"),
    signature: "",
    data: encodeParameters(["address"], [Addr.FLXTemp]),
    eta: 1677030142,
  };

  const tx = await c0.executeTransaction(
    param.target,
    param.value,
    param.signature,
    param.data,
    param.eta
  );
  console.log(tx);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
