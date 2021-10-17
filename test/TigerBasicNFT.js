const { expect } = require("chai")

describe("TigerBasicNFT contract", function () {

    let tiger
    let deployer
    let artist
    let alice
    let bob
    let addrs
    
    const logger = ethers.utils.Logger.globalLogger()
    
    beforeEach(async function () {
        ;[deployer, artist, alice, bob, ...addrs] = await ethers.getSigners()
        tigerFactory = await ethers.getContractFactory("TigerBasicNFT")
        tiger = await tigerFactory.deploy(artist.address)
        await tiger.deployed()
    })

    it("artist should be initial owner", async function () {
        expect(await tiger.getOwner(0)).to.equal(artist.address)
        expect(await tiger.getOwner(999)).to.equal(artist.address)
    })

    it("initially nothing should be for sale", async function () {
        forSale = await tiger.isForSale(0)
        expect(forSale[0]).to.equal(false)
        expect(forSale[1]).to.equal(ethers.utils.parseEther("0"))
        forSale = await tiger.isForSale(999)
        expect(forSale[0]).to.equal(false)
        expect(forSale[1]).to.equal(ethers.utils.parseEther("0"))
    })

    it("only owner can put tiger up for sale", async function () {
        await expect(tiger.putUpForSale(13, ethers.utils.parseEther("1"))).to.be.revertedWith("not owner")
    })

    it("artist can put tiger up for sale", async function () {
        await tiger.connect(artist).putUpForSale(13, ethers.utils.parseEther("1"))
        forSale = await tiger.isForSale(13)
        expect(forSale[0]).to.equal(true)
        expect(forSale[1]).to.equal(ethers.utils.parseEther("1"))
    })

    it("artist can withdraw tiger from sale", async function () {
        await tiger.connect(artist).putUpForSale(13, ethers.utils.parseEther("1"))
        await tiger.connect(artist).withdrawFromSale(13)
        expect((await tiger.isForSale(13))[0]).to.equal(false)
    })

    it("someone can buy a tiger that is for sale", async function () {
        await tiger.connect(artist).putUpForSale(13, ethers.utils.parseEther("1"))
        await tiger.connect(bob).buyTiger(13, {value:ethers.utils.parseEther("1")})
        expect(await tiger.connect(alice).getOwner(13)).to.equal(bob.address)
    })

    it("tiger should show as no longer for sale after it's been bought", async function () {
        await tiger.connect(artist).putUpForSale(389, ethers.utils.parseEther("1"))
        await tiger.connect(bob).buyTiger(389, {value:ethers.utils.parseEther("1")})
        expect((await tiger.isForSale(389))[0]).to.equal(false)
        expect(await tiger.connect(alice).getOwner(389)).to.equal(bob.address)
    })

    it("can't buy a tiger that is not for sale", async function () {
        await expect(tiger.connect(bob).buyTiger(13, {value:ethers.utils.parseEther("1")})).to.be.revertedWith("not for sale")
    })

    it("someone can buy a tiger that is for sale just to them", async function () {
        await tiger.connect(artist).putUpForSaleToAddress(13, ethers.utils.parseEther("1"), bob.address)
        await tiger.connect(bob).buyTiger(13, {value:ethers.utils.parseEther("1")})
        expect((await tiger.isForSale(13))[0]).to.equal(false)
        expect(await tiger.connect(alice).getOwner(13)).to.equal(bob.address)
    })

    it("can't buy a tiger that is for sale only to someone else", async function () {
        await tiger.connect(artist).putUpForSaleToAddress(13, ethers.utils.parseEther("1"), alice.address)
        await expect(tiger.connect(bob).buyTiger(13, {value:ethers.utils.parseEther("1")})).to.be.revertedWith("not for sale")
    })


})
