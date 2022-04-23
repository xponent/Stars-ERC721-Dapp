// contracts/GameItem.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

    struct Star {
        string name;
    }
contract StarNotary is ERC721 {


    mapping(uint256 => Star) public starToIdInfo;
    mapping(uint256 => uint256) public starsForSale;

    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    constructor() ERC721("Star", "S") {}

    function createStar(string memory _name) public returns (uint256) {
        Star memory newStar = Star(_name);
        _tokenIds.increment();
        uint256 itemId = _tokenIds.current();
        starToIdInfo[itemId] = newStar;
        _safeMint(msg.sender, itemId);
        allowTransfers(itemId);
        return itemId;
    }

    function setStarForSale(uint256 _id, uint256 _price) public {
        // Sets star for sale and approval of the contract to handle the token.
        require(ownerOf(_id) == msg.sender, "Must be the owner of this star.");
        allowTransfers(_id);
        starsForSale[_id] = _price;
    }

    function buyStar(uint256 _id) public payable {
        require(starsForSale[_id] > 0, "The star must be for sale.");
        uint256 cost = starsForSale[_id];
        address owner = ownerOf(_id);
        require(msg.value >= cost, "Minimum balance needs to cover the cost.");
        this.safeTransferFrom(owner, msg.sender, _id);
        payable(owner).transfer(cost);
        starsForSale[_id] = 0;
        if(msg.value > cost) {
            payable(msg.sender).transfer(msg.value - cost);
        }
    }

    // Implement Task 1 lookUptokenIdToStarInfo
    function lookUptokenIdToStarInfo (uint _tokenId) public view returns (string memory) {
        //1. You should return the Star saved in tokenIdToStarInfo mapping
        Star memory currentStar = starToIdInfo[_tokenId];
        return currentStar.name;
    }

    // Implement Task 1 Exchange Stars function
    function exchangeStars(uint256 _tokenId1, uint256 _tokenId2) public {
        //1. Passing to star tokenId you will need to check if the owner of _tokenId1 or _tokenId2 is the sender
        //2. You don't have to check for the price of the token (star)
        //3. Get the owner of the two tokens (ownerOf(_tokenId1), ownerOf(_tokenId2)
        //4. Use _transferFrom function to exchange the tokens.
        require((msg.sender == ownerOf(_tokenId1)) || (msg.sender == ownerOf(_tokenId2)),
            "You must own either of the stars.");
        address token1owner = ownerOf(_tokenId1);
        address token2owner = ownerOf(_tokenId2);
        this.safeTransferFrom(token1owner, token2owner, _tokenId1);
        this.safeTransferFrom(token2owner, token1owner, _tokenId2);
    }

    // Implement Task 1 Transfer Stars
    function transferStar(address _to1, uint256 _tokenId) public {
        //1. Check if the sender is the ownerOf(_tokenId)
        //2. Use the transferFrom(from, to, tokenId); function to transfer the Star
        require(msg.sender == ownerOf(_tokenId));
        this.safeTransferFrom(msg.sender, _to1, _tokenId);
    }

    function allowTransfers(uint256 _id) public {
        // Allows contract to transfer Stars.
        // Must be re-approved by the owners after transfer.
        require(msg.sender == ownerOf(_id));
        approve(address(this), _id);
    }
}