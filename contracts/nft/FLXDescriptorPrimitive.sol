// SPDX-License-Identifier: CC0

pragma solidity 0.8.13;

import "../interfaces/IERC721FullyOnchain.sol";
import "../interfaces/IERC721Junction.sol";
import "./FLXDescriptor.sol";
import "hardhat/console.sol";

contract FLXDescriptorPrimitive is FLXDescriptor {
    using Strings for uint256;

    IERC721Junction public token;

    constructor() {}

    uint8 constant CAP = 192;
    string constant PREFIX1 = "PREFIX1";
    string constant PREFIX2 = "PREFIX2";
    string constant PREFIX3 = "PREFIX3";

    string[] ATTRIBUTES = ['tribe', 'guardian beast', 'felix word'];
    bool[] IS_INT = [false, false, false, false];

    string[] NAMES = [
        'name1',
        'name2',
        'name3',
        'name4',
        'name5',
        'name6',
        'name7',
        'name8',
        'name9',
        'name10',
        'name11',
        'name12'
    ];

    string[] DESCRIPTIONS = [
        'de1',
        'de2',
        'de3',
        'de4',
        'de5',
        'de6',
        'de7',
        'de8',
        'de9',
        'de10',
        'de11',
        'de12'
    ];

    string[] TRIBES = [
        'Hulan',
        'Hulan',
        'Hulan',
        'Hulan',
        'Elf',
        'Elf',
        'Garuda',
        'Drake',
        'Dwarf',
        'Dwarf',
        'Miakiss',
        'Tabbit'
    ];
    string [] GUARDIAN_BEAST = [
        'Basmu',
        'Usumgallu',
        'Musmahhu',
        'Mushussu',
        'Lahmu',
        'Ugallu',
        'Uridimmu',
        'Girtablullu',
        'Umu dabrutu',
        'Kulullu',
        'Kusarikku'
    ];
    string[] FELIX_WORD = [
        "wogr",
        "ur",
        "fe",
        "iss",
        "oss",
        "woi",
        "toh",
        "ar",
        "cur",
        "stor",
        "brus",
        "berk",
        "ert",
        "wvv",
        "moh",
        "soi"
    ];

    function setToken(address _token) external onlyOwner {
        token = IERC721Junction(_token);
    }

    function random(uint256 tokenId, string memory keyPrefix) internal view returns (uint) {
        return uint256(
            keccak256(
                abi.encodePacked(
                    (
                        string(abi.encodePacked(keyPrefix, tokenId.toString()))
                    )
                )
            )
        );
    }

    function generateName(uint256 _tokenId)
        public
        view
        override
        returns (string memory)
    {
        return string(abi.encodePacked(NAMES[getSeedIdx(_tokenId) / 16], _tokenId.toString()));
    }

    function generateDescription(uint256 _tokenId)
        public
        view
        override
        returns (string memory)
    {
        return TRIBES[getSeedIdx(_tokenId) / 16];
    }

    function getSeedIdx(uint _tokenId) private view returns(uint8){
        return uint8(random(_tokenId, PREFIX1) % CAP);
    }

    function getSeedAndPalettes(uint256 _tokenId)
        public
        view
        override
        returns (bytes memory, string[] memory)
    {
        // console.log(getSeedIdx(_tokenId));
        // console.log(seeds[getSeedIdx(_tokenId)]);
        // console.log(palettes[getSeedIdx(_tokenId)][0]);
        return (seeds[getSeedIdx(_tokenId) / 16], palettes[getSeedIdx(_tokenId)]);
    }

    // prettier-ignore
    function generateAttributes(uint256 _tokenId)
        public
        view
        override
        returns (string memory)
    {
        string[3] memory values = [
            TRIBES[getSeedIdx(_tokenId) / 16],
            GUARDIAN_BEAST[random(_tokenId, PREFIX2) % GUARDIAN_BEAST.length],
            FELIX_WORD[random(_tokenId, PREFIX3) % FELIX_WORD.length]
        ];

        string memory ret = "";
        for (uint8 i = 0; i < values.length; i++) {
            if (i > 0) {
                ret = string(
                    abi.encodePacked(ret,",")
                );
            }
            ret = _buildAttributes(ret, ATTRIBUTES[i], values[i], IS_INT[i]);
        }

        string memory tmp;
        IERC721Junction.ChildToken[] memory children = token.getChildren(
            _tokenId
        );
        for (uint8 i = 0; i < children.length; i++) {
            tmp = IFLXDescriptor(
                IERC721FullyOnchain(children[i].addr).descriptor()
            ).generateAttributes(children[i].id);
            ret = string(
                abi.encodePacked(ret, ",", tmp)
            );
        }

        return ret;
    }

    function generateSVGImage(uint256 tokenId)
        public
        view
        override
        returns (string memory)
    {
        (bytes memory seed, string[] memory palette) = getSeedAndPalettes(
            tokenId
        );
        string memory ret = string(
            abi.encodePacked(MultiPartRLEToSVG.generateSVGRects(seed, palette))
        );

        string memory svg;
        IERC721Junction.ChildToken[] memory children = token.getChildren(
            tokenId
        );
        for (uint8 i = 0; i < children.length; i++) {
            svg = IFLXDescriptor(
                IERC721FullyOnchain(children[i].addr).descriptor()
            ).generateSVGImage(children[i].id);
            ret = string(abi.encodePacked(ret, svg));
        }

        return ret;
    }
}
