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

const days8 = 60 * 60 * 24 * 8;

export const encodeParameters = (
  types: string[],
  values: unknown[]
): string => {
  const abi = new ethers.utils.AbiCoder();
  return abi.encode(types, values);
};

async function main() {
  // let param_: Param = {
  //   target: Addr.FLXTemp,
  //   value: utils.parseEther("400000"),
  //   signature: "",
  //   data: encodeParameters(["address"], [Addr.FLXTemp]),
  //   eta: 1674293493,
  // };

  // const encodedParam_ = utils.keccak256(
  //   encodeParameters(
  //     ["address", "uint256", "string", "bytes", "uint256"],
  //     [param_.target, param_.value, param_.signature, param_.data, param_.eta]
  //   )
  // );
  // console.log(encodedParam_);
  //0x84e42a9a2f700f364234c84e3c2024a3e14972102c50771bf016fb746113cd7b

  // return;

  const c0 = (await ethers.getContractAt(
    "FelixirExecutor",
    Addr.FelixirExecutor
  )) as FelixirExecutor;

  let param: Param = {
    target: Addr.FLXTemp,
    value: utils.parseEther("400000"),
    signature: "",
    data: encodeParameters(["address"], [Addr.FLXTemp]),
    eta: Math.floor(Date.now() / 1000) + days8,
  };

  const ret = await c0.queueTransaction(
    param.target,
    param.value,
    param.signature,
    param.data,
    param.eta
  );
  console.log(ret);

  const encodedParam = utils.keccak256(
    encodeParameters(
      ["address", "uint256", "string", "bytes", "uint256"],
      [param.target, param.value, param.signature, param.data, param.eta]
    )
  );

  const tx = await c0.queuedTransactions(encodedParam);
  console.log(tx);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
