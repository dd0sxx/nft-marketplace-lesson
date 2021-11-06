// SPDX-License-Identifier: MIT

pragma solidity 0.8.2;
import "hardhat/console.sol";
/*
   NFT Contract along the lines of CryptoPunks. For the original see:
   https://github.com/larvalabs/cryptopunks/blob/master/contracts/CryptoPunksMarket.sol
*/
contract TigerNFT {

    // how many unique tiger tokens exist
    uint public constant totalSupply = 100;
    
    // address that deployed this contract
    address private deployer;

    // address of the artist, initial owner of all tiger tokens, recipient of artist's fees
    address private artist;
    
    // initial sale price for all tokens
    uint private startingPrice;

    // mapping from token ID to owner address
    mapping(uint => address) private tigerOwners;

    // mapping from owner address to number of tokens they own
    mapping(address => uint) private balanceOf;

    // mapping from owner address to list of IDs of all tokens they own
    mapping(address => mapping(uint256 => uint256)) private tigersOwnedBy;

    // mapping from token ID to its index position in the owner's tokens list
    mapping(uint256 => uint256) private tigersOwnedByIndex;

    // tigers currently up for sale
    struct SaleOffer {
        bool isForSale;
        address seller;
        uint price;
    }
    mapping (uint => SaleOffer) public tigersForSale;

    // ether held by the contract on behalf of addresses that have interacted with it
    mapping (address => uint) public pendingWithdrawals;

    event TigerForSale(address indexed seller, uint indexed tigerId, uint price);
    event TigerSold(address indexed seller, address indexed buyer, uint indexed tigerId, uint price);
    event TigerWithdrawnFromSale(address indexed seller, uint indexed tigerId);
    
    // create the contract, artist is set here and never changes subsequently
    constructor(address _artist, uint _startingPrice) {
        require(_artist != address(0));
        artist = _artist;
        startingPrice = _startingPrice;
        deployer = msg.sender;
    }

    // allow anyone to see if a tiger is for sale and, if so, for how much
    function isForSale(uint tigerIndex) external view returns (bool, uint) {
        require(tigerIndex < totalSupply, "index out of range");
        SaleOffer memory saleOffer = getSaleInfo(tigerIndex);
        if (saleOffer.isForSale) {
            return(true, saleOffer.price);
        }
        return (false, 0);
    }

    // tokens which have never been sold are for sale at the starting price,
    // all others are not unless the owner puts them up for sale
    function getSaleInfo(uint tigerIndex) private view returns (SaleOffer memory saleOffer) {
        if (tigerOwners[tigerIndex] == address(0)) {
            saleOffer = SaleOffer(true, artist, startingPrice);
        } else {
            saleOffer = tigersForSale[tigerIndex];
        }
    }

    // get the number of tigers owned by the address
    function getBalance(address owner) public view returns (uint) {
        return balanceOf[owner ];
    }

    // get the current owner of a token, unsold tokens belong to the artist
    function getOwner(uint tigerIndex) public view returns (address) {
        require(tigerIndex < totalSupply, "index out of range");
        address owner = tigerOwners[tigerIndex];
        if (owner == address(0)) {
            owner = artist;
        }
        return owner;
    }

    // get the ID of the index'th tiger belonging to owner (who must own at least index + 1 tigers)
    function tigerByOwnerAndIndex(address owner, uint index) public view returns (uint) {
        require(index < balanceOf[owner], "owner doesn't have that many tigers");
        return tigersOwnedBy[owner][index];
    }
    

    // allow the current owner to put a tiger token up for sale
    function putUpForSale(uint tigerIndex, uint minSalePriceInWei) external {
        require(tigerIndex < totalSupply, "index out of range");
        require(getOwner(tigerIndex) == msg.sender, "not owner");
        tigersForSale[tigerIndex] = SaleOffer(true, msg.sender, minSalePriceInWei);
        emit TigerForSale(msg.sender, tigerIndex, minSalePriceInWei);
    }


    // allow the current owner to withdraw a tiger token from sale
    function withdrawFromSale(uint tigerIndex) external {
        require(tigerIndex < totalSupply, "index out of range");
        require(getOwner(tigerIndex) == msg.sender, "not owner");
        tigersForSale[tigerIndex] = SaleOffer(false, address(0), 0);
        emit TigerWithdrawnFromSale(msg.sender, tigerIndex);
    }

    // update ownership tracking for newly acquired tiger token
    function updateTigerOwnership(uint tigerId, address newOwner, address previousOwner) private {
        bool firstSale = tigerOwners[tigerId] == address(0);
        tigerOwners[tigerId] = newOwner;
        balanceOf[newOwner]++;
        if (!firstSale) {
            balanceOf[previousOwner]--;

            // To prevent a gap in previousOwner's tokens array
            // we store the last token in the index of the token to delete, and
            // then delete the last slot (swap and pop).

            uint lastTokenIndex = balanceOf[previousOwner];
            uint tokenIndex = tigersOwnedByIndex[tigerId];

            // When the token to delete is the last token, the swap operation is unnecessary
            if (tokenIndex != lastTokenIndex) {
                uint lastTokenId = tigersOwnedBy[previousOwner][lastTokenIndex];

                tigersOwnedBy[previousOwner][tokenIndex] = lastTokenId; // Move the last token to the slot of the to-delete token
                tigersOwnedByIndex[lastTokenId] = tokenIndex; // Update the moved token's index
            }

            delete tigersOwnedBy[previousOwner][lastTokenIndex];
        }
        uint newIndex = balanceOf[newOwner] - 1;
        tigersOwnedBy[newOwner][newIndex] = tigerId;
        tigersOwnedByIndex[tigerId] = newIndex;
    }

    // allow someone to buy a tiger offered for sale to them
    function buyTiger(uint tigerIndex) external payable {
        require(tigerIndex < totalSupply, "index out of range");
        SaleOffer memory saleOffer = getSaleInfo(tigerIndex);
        require(saleOffer.isForSale,"not for sale");
        require(msg.value >= saleOffer.price, "price not met");
        require(saleOffer.seller == getOwner(tigerIndex), "seller no longer owns");
        updateTigerOwnership(tigerIndex, msg.sender, saleOffer.seller);
        tigersForSale[tigerIndex] = SaleOffer(false, address(0), 0);
        uint contractRoyalty = msg.value / 100;
        pendingWithdrawals[deployer] += contractRoyalty;
        uint artistRoyalty = msg.value / 20;
        pendingWithdrawals[artist] += artistRoyalty;
        pendingWithdrawals[saleOffer.seller] += msg.value - (contractRoyalty + artistRoyalty);
        emit TigerSold(saleOffer.seller, msg.sender, tigerIndex, saleOffer.price);
    }

    // allow participant to withdraw accumulated funds
    function withdrawFunds() external {
        uint amount = pendingWithdrawals[msg.sender];
        require(amount > 1e10, "insufficient available funds");
        pendingWithdrawals[msg.sender] = 0;
        (bool sent, ) = payable(msg.sender).call{value:amount}("");
        require(sent, "transfer failed");
    }

 }
