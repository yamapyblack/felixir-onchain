// SPDX-License-Identifier: CC0

pragma solidity 0.8.13;

import "@openzeppelin/contracts/access/Ownable.sol";
import {ReentrancyGuard} from "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import {Pausable} from "@openzeppelin/contracts/security/Pausable.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {IERC721} from "@openzeppelin/contracts/token/ERC721/IERC721.sol";

contract FelixirGiveBack is Ownable, ReentrancyGuard, Pausable {
    mapping(uint256 => bool) public backedTokenIds;
    address public immutable nft;

    constructor(address _nft) {
        nft = _nft;
    }

    function bulkDeposit(uint256[] memory _tokenIds)
        public
        nonReentrant
        whenNotPaused
    {
        for (uint256 i = 0; i < _tokenIds.length; i++) {
            _deposit(_tokenIds[i]);
        }
    }

    function deposit(uint256 _tokenId) public nonReentrant whenNotPaused {
        _deposit(_tokenId);
    }

    function _deposit(uint256 _tokenId) private {
        require(
            !backedTokenIds[_tokenId],
            "FelixirGiveBack::deposit: This token is already backed."
        );
        backedTokenIds[_tokenId] = true;
        IERC721(nft).transferFrom(msg.sender, address(this), _tokenId);

        //giving 100 Ether back to the user
        payable(msg.sender).transfer(100 ether);
    }

    //owners functions
    function withdrawEther(uint256 _amount) external onlyOwner {
        payable(msg.sender).transfer(_amount);
    }

    function withdrawERC20(address _token) external onlyOwner {
        IERC20(_token).transfer(
            msg.sender,
            IERC20(_token).balanceOf(address(this))
        );
    }

    function withdrawERC721(address _token, uint256 _tokenId)
        external
        onlyOwner
    {
        IERC721(_token).transferFrom(address(this), msg.sender, _tokenId);
    }

    function pause() external onlyOwner {
        _pause();
    }

    function unpause() external onlyOwner {
        _unpause();
    }

    receive() external payable {}
}
