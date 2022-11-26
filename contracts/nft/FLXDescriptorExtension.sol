// SPDX-License-Identifier: MIT

pragma solidity 0.8.13;

import "../interfaces/IERC721FullyOnchain.sol";
import "../interfaces/IERC721Junction.sol";
import "./FLXDescriptor.sol";
import "hardhat/console.sol";

contract FLXDescriptorExtension is FLXDescriptor {
    using Strings for uint256;

    constructor() {}

    function getSeedAndPalettes(uint256 _tokenId)
        public
        view
        override
        returns (bytes memory, string[] memory)
    {
        return (seeds[uint8(_tokenId)], palettes[_tokenId]);
    }

    // prettier-ignore
    function generateAttributes(uint256 _tokenId)
        public
        view
        override
        returns (string memory ret)
    {
        string memory _trait = string(
            abi.encodePacked("extension",_tokenId.toString())
        );
        ret = _buildAttributes(ret, _trait, generateName(_tokenId), false);
    }

}
