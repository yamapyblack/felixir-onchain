// SPDX-License-Identifier: MIT

/*************************************************************************************
 * ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ *
 * ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░███████████████░░░░░░░░░░░░░░░ *
 * ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░██████░░░░░░░░░░░░░░░██████░░░░░░░░░ *
 * ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░███░░░░░░░░░░░░░░░░░░░░░░░░░░░███░░░░░░ *
 * ░░░░░░██████░░░░░░███░░░░░░░░░███░░░░░░███░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░███░░░ *
 * ░░░███░░░░░░███░░░██████░░░██████░░░░░░███░░░░░░░░░███░░░░░░░░░░░░░░░░░░░░░███░░░ *
 * ░░░███░░░░░░░░░░░░███░░░███░░░███░░░░░░███░░░░░░███░░░███░░░░░░░░░░░░███░░░███░░░ *
 * ░░░███░░░██████░░░███░░░███░░░███░░░░░░███░░░███░░░░░░░░░███░░░░░░░░░░░░██████░░░ *
 * ░░░███░░░░░░███░░░███░░░░░░░░░███░░░░░░░░░██████░░░██████░░░███░░░███░░░░░░███░░░ *
 * ░░░░░░██████░░░░░░███░░░░░░░░░███░░░░░░░░░░░░███░░░   ░░░░░░░░░███░░░███░░░███░░░ *
 * ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░███░░░   ░░░░░░░░░░░░░░░██████░░░░░░ *
 * ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░███░░░░░░░░░░░░░░░░░░██████░░░░░░░░░ *
 * ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░███░░░░░░░░░██████░░░░░░░░░░░░░░░ *
 * ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░█████████░░░░░░░░░░░░░░░░░░░░░ *
 * ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ *
**************************************************************************************/

pragma solidity 0.8.13;

import "../lib/ERC721FullyOnchain.sol";
import "../lib/ERC721Junction.sol";
import "../lib/ERC721Votes.sol";
import "../lib/ERC721Mintable.sol";

contract FLXPrimitiveV2 is ERC721FullyOnchain, ERC721Junction, ERC721Votes, ERC721Mintable {
    constructor()
        ERC721Mintable("FelixirV2", "FLX")
        EIP712("FelixirV2","1")
    {}

    //
    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 tokenId
    ) internal virtual override(ERC721Enumerable, ERC721) {
        super._beforeTokenTransfer(from, to, tokenId);
    }

    function _afterTokenTransfer(
        address from,
        address to,
        uint256 tokenId
    ) internal virtual override(ERC721Votes, ERC721) {
        super._afterTokenTransfer(from, to, tokenId);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        virtual
        override(ERC721Mintable, ERC721)
        returns (bool)
    {
        return
            ERC721Mintable.supportsInterface(interfaceId) ||
            ERC721.supportsInterface(interfaceId);
    }

    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721FullyOnchain, ERC721)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }

}
