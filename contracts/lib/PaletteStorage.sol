// SPDX-License-Identifier: CC0

pragma solidity 0.8.13;

import "@openzeppelin/contracts/access/Ownable.sol";
import "../interfaces/IPaletteStorage.sol";

abstract contract PaletteStorage is Ownable, IPaletteStorage {
    mapping(uint8 => bytes) public seeds;
    mapping(uint => string[]) public palettes;

    function setSeed(uint8 _seedIdx, bytes calldata _seed)
        external
        override
        onlyOwner
    {
        seeds[_seedIdx] = _seed;
    }

    function addBulkBulkColorsToPalette(
        uint[] calldata paletteIndex,
        string[][] calldata newColors
    ) external onlyOwner {
        for (uint256 i = 0; i < paletteIndex.length; i++) {
            addBulkColorsToPalette(paletteIndex[i], newColors[i]);
        }
    }

    function addBulkColorsToPalette(
        uint paletteIndex,
        string[] calldata newColors
    ) public override onlyOwner {
        require(
            palettes[paletteIndex].length + newColors.length <= 256,
            "Palettes can only hold 256 colors"
        );
        for (uint256 i = 0; i < newColors.length; i++) {
            _addColorToPalette(paletteIndex, newColors[i]);
        }
    }

    function addColorToPalette(uint _paletteIndex, string calldata _color)
        external
        override
        onlyOwner
    {
        require(
            palettes[_paletteIndex].length <= 255,
            "Palettes can only hold 256 colors"
        );
        _addColorToPalette(_paletteIndex, _color);
    }

    function _addColorToPalette(uint _paletteIndex, string calldata _color)
        internal
    {
        palettes[_paletteIndex].push(_color);
    }
}
