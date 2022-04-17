// SPDX-License-Identifier: MIT

pragma solidity 0.8.13;

import "../interfaces/IERC721FullyOnchain.sol";
import "../interfaces/IERC721Junction.sol";
import "./FLXDescriptor.sol";
import "hardhat/console.sol";

contract FLXDescriptorPrimitive is FLXDescriptor {
    using Strings for uint256;

    IERC721Junction public token;

    constructor() {}

    uint8 constant CHARA = 12;
    uint constant COLORS = 64;
    string constant PREFIX1 = "PREFIX1";
    string constant PREFIX2 = "PREFIX2";
    string constant PREFIX3 = "PREFIX3";
    string constant PREFIX4 = "PREFIX4";

    string[] ATTRIBUTES = ['name', 'tribe', 'guardian beast', 'felix word'];
    bool[] IS_INT = [false, false, false, false];

    string[] NAMES = [
        'Satoshi',
        'Kyle',
        'Tiana',
        'Nika',
        'Leafus',
        'Awen',
        'Hawkie',
        'Carabinero',
        'Gan-G',
        'Frey',
        'Mia',
        'Philan'
    ];

    string[] DESCRIPTIONS = [
        'Kind-hearted traveler. He also has a heartbreaking past.',
        'Powerful mercenary with his longsword. His swordsman skills is his only credo.',
        'The Princess of the Duchy of Apollon. She is Brave and fearless from a young age.',
        'Childhood friend from Satoshi. Takes good care of but a bit over-caring.',
        'The chief of the elves. He is trusted by his clan, but he has no mercy for other clans.',
        'A master archer. He lives in nature and can communicate with animals.',
        'A young warrior chief of the Garuda tribe. He is quite talkative and loud.',
        'A mage knight who controls an evil force. He has excellent leadership skills and will show no mercy to those who oppose him.',
        'A Dwarf who boasts of his strength. He is brave and courageous, and has no second thoughts.',
        'A cheerful, talkative dwarf. He is very particular about his money.',
        'Has sharp claws and can climb high places without difficulty. Also nimble and have excellent information-gathering abilities.',
        'He has a mild-mannered personality. He is skilled in the art of protecting his friends.'
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
        return string(abi.encodePacked(NAMES[getSeedIdx(_tokenId)], " FelixirNFT #", _tokenId.toString()));
    }

    function generateDescription(uint256 _tokenId)
        public
        view
        override
        returns (string memory)
    {
        return DESCRIPTIONS[getSeedIdx(_tokenId)];

        return string(abi.encodePacked(NAMES[getSeedIdx(_tokenId)], " #", _tokenId.toString()));
    }

    function getSeedIdx(uint _tokenId) private view returns(uint8){
        return uint8(random(_tokenId, PREFIX1) % CHARA);
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

        uint base_ = getSeedIdx(_tokenId) * COLORS;

        uint totalColor_ = random(_tokenId, PREFIX4) % COLORS;

        return (seeds[getSeedIdx(_tokenId)], palettes[base_ + totalColor_]);
    }

    // prettier-ignore
    function generateAttributes(uint256 _tokenId)
        public
        view
        override
        returns (string memory)
    {
        string[4] memory values = [
            NAMES[getSeedIdx(_tokenId)],
            TRIBES[getSeedIdx(_tokenId)],
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
