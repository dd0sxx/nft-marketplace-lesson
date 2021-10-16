// SPDX-License-Identifier: MIT

pragma solidity 0.8.2;
/*
   NFT Contract along the lines of CryptoPunks. For the original see:
   https://github.com/larvalabs/cryptopunks/blob/master/contracts/CryptoPunksMarket.sol
*/
contract TigerBasicNFT {

    // how many unique tiger tokens exist
    uint public constant totalSupply = 1000;
    
    // address that deployed this contract
    address private deployer;

    // address of the artist, initial owner of all tiger tokens, recipient of artist's fees
    address private artist;
    
    // mapping from token ID to owner address
    mapping(uint256 => address) private tigerOwners;

    // tigers currently up for sale
    struct SaleOffer {
        bool isForSale;
        address seller;
        uint price;
        address onlySellTo; //isForSale true plus zero for onlySellTo address means sell to anyone 
    }
    mapping (uint => SaleOffer) public tigersForSale;

    // ether held by the contract on behalf of addresses that have interacted with it
    mapping (address => uint) public pendingWithdrawals;

    // create the contract, artist is set here and never changes subsequently
    constructor(address _artist) {
        require(_artist != address(0));
        artist = _artist;
        deployer = msg.sender;
    }

    // allow anyone to see if a tiger is for sale and, if so, for how much
    function isForSale(uint tigerIndex) external view returns (bool, uint) {
        require(tigerIndex < totalSupply, "index out of range");
        // @todo does the use of this memory variable save gas or use more of it?
        SaleOffer memory saleOffer = tigersForSale[tigerIndex];
        if (saleOffer.isForSale
            && ((saleOffer.onlySellTo == address(0)) || saleOffer.onlySellTo == msg.sender)) {
            return(true, saleOffer.price);
        }
        return (false, 0);
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

    // allow the current owner to put a tiger token up for sale
    function putUpForSale(uint tigerIndex, uint minSalePriceInWei) external {
        require(tigerIndex < totalSupply, "index out of range");
        require(getOwner(tigerIndex) == msg.sender, "not owner");
        tigersForSale[tigerIndex] = SaleOffer(true, msg.sender, minSalePriceInWei, address(0));
    }

    // allow the current owner to put a tiger token up for sale
    function putUpForSaleToAddress(uint tigerIndex, uint minSalePriceInWei, address buyer) external {
        require(tigerIndex < totalSupply, "index out of range");
        require(getOwner(tigerIndex) == msg.sender, "not owner");
        tigersForSale[tigerIndex] = SaleOffer(true, msg.sender, minSalePriceInWei, buyer);
    }

    // allow the current owner to withdraw a tiger token from sale
    function withdrawFromSale(uint tigerIndex) external {
        require(tigerIndex < totalSupply, "index out of range");
        require(getOwner(tigerIndex) == msg.sender, "not owner");
        tigersForSale[tigerIndex] = SaleOffer(false, address(0), 0, address(0));
    }

    // allow someone to buy a tiger offered for sale to them
    function buyTiger(uint tigerIndex) external payable {
        require(tigerIndex < totalSupply, "index out of range");
        SaleOffer memory saleOffer = tigersForSale[tigerIndex];
        require(saleOffer.isForSale && (saleOffer.onlySellTo == address(0) || saleOffer.onlySellTo == msg.sender),
                "not for sale");
        require(msg.value >= saleOffer.price, "price not met");
        require(saleOffer.seller == getOwner(tigerIndex), "seller no longer owns");
        tigerOwners[tigerIndex] = msg.sender;
        tigersForSale[tigerIndex] = SaleOffer(false, address(0), 0, address(0));
        pendingWithdrawals[saleOffer.seller] += msg.value;
    }

    
}