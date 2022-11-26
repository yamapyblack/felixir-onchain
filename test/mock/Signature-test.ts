import "@nomiclabs/hardhat-waffle";
import { ethers } from "hardhat";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/dist/src/signer-with-address";

const encodeParameters = (types: any[], values: any[]) => {
  const abi = new ethers.utils.AbiCoder()
  return ethers.utils.keccak256(abi.encode(types, values))
}

describe("PopMock-test", async () => {
  let owner :SignerWithAddress, addr1 :SignerWithAddress, addr2 :SignerWithAddress

  beforeEach(async () => {
    [owner, addr1, addr2,] = await ethers.getSigners()
  });

  describe("test", async () => {    
    it("success setName", async () => {
      const types = ["address"];
      const values = ["0x12fA9a179f1db2a97052CcbFD7a4AAAA91Fef780"];
  
      console.log('fuga');
  
      const encodedData = encodeParameters(types, values)
      const encodedDataBytes = ethers.utils.arrayify(encodedData);
      const signature = await owner.signMessage(encodedDataBytes)
      
      //validate
      const rec = ethers.utils.recoverAddress(encodedDataBytes, signature);
      console.log(rec)  

    });
  });

});


    
    
