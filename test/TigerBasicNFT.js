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
        tiger = await tigerFactory.deploy(artist.address, ethers.utils.parseEther("1"))
        await tiger.deployed()
    })

    it("artist should be initial owner", async function () {
        expect(await tiger.getOwner(0)).to.equal(artist.address)
        expect(await tiger.getOwner(99)).to.equal(artist.address)
    })

    it("initially everything should be for sale", async function () {
        forSale = await tiger.isForSale(0)
        expect(forSale[0]).to.equal(true)
        expect(forSale[1]).to.equal(ethers.utils.parseEther("1"))
        forSale = await tiger.isForSale(99)
        expect(forSale[0]).to.equal(true)
        expect(forSale[1]).to.equal(ethers.utils.parseEther("1"))
    })

    it("only owner can put tiger up for sale", async function () {
        await expect(tiger.connect(bob).putUpForSale(13, ethers.utils.parseEther("1"))).to.be.revertedWith("not owner")
    })

    it("owner can put tiger up for sale", async function () {
        await tiger.connect(bob).buyTiger(13, {value:ethers.utils.parseEther("1")})
        await tiger.connect(bob).putUpForSale(13, ethers.utils.parseEther("2"))
        forSale = await tiger.isForSale(13)
        expect(forSale[0]).to.equal(true)
        expect(forSale[1]).to.equal(ethers.utils.parseEther("2"))
    })

    it("owner can withdraw tiger from sale", async function () {
        await tiger.connect(bob).buyTiger(13, {value:ethers.utils.parseEther("1")})
        await tiger.connect(bob).putUpForSale(13, ethers.utils.parseEther("2"))
        await tiger.connect(bob).withdrawFromSale(13)
        forSale = await tiger.isForSale(13)
        expect(forSale[0]).to.equal(false)
        expect(forSale[1]).to.equal(ethers.utils.parseEther("0"))
    })

    it("someone can buy a tiger that is for sale", async function () {
        expect(await tiger.connect(alice).getBalance(bob.address)).to.equal(0)
        await tiger.connect(bob).buyTiger(13, {value:ethers.utils.parseEther("1")})
        expect(await tiger.connect(alice).getOwner(13)).to.equal(bob.address)
        expect(await tiger.connect(alice).getBalance(bob.address)).to.equal(1)
        expect(await tiger.connect(alice).tigerByOwnerAndIndex(bob.address, 0)).to.equal(13)
    })

    it("purchaser can resell a tiger", async function () {
        await tiger.connect(bob).buyTiger(13, {value:ethers.utils.parseEther("1")})
        expect(await tiger.getBalance(bob.address)).to.equal(1)
        expect(await tiger.getOwner(13)).to.equal(bob.address)
        expect(await tiger.tigerByOwnerAndIndex(bob.address, 0)).to.equal(13)
        await tiger.connect(bob).putUpForSale(13, ethers.utils.parseEther("2"))
        await tiger.connect(alice).buyTiger(13, {value:ethers.utils.parseEther("2")})
        expect(await tiger.getBalance(bob.address)).to.equal(0)
        expect(await tiger.getBalance(alice.address)).to.equal(1)
        expect(await tiger.getOwner(13)).to.equal(alice.address)
        expect(await tiger.tigerByOwnerAndIndex(alice.address, 0)).to.equal(13)
    })

    it("multiple tiger purchases can be tracked", async function () {
        await tiger.connect(bob).buyTiger(3, {value:ethers.utils.parseEther("1")})
        await tiger.connect(bob).buyTiger(13, {value:ethers.utils.parseEther("1")})
        await tiger.connect(bob).buyTiger(23, {value:ethers.utils.parseEther("1")})
        expect(await tiger.getBalance(bob.address)).to.equal(3)
        expect(await tiger.getOwner(13)).to.equal(bob.address)
        expect(await tiger.tigerByOwnerAndIndex(bob.address, 0)).to.equal(3)
        expect(await tiger.tigerByOwnerAndIndex(bob.address, 1)).to.equal(13)
        expect(await tiger.tigerByOwnerAndIndex(bob.address, 2)).to.equal(23)
    })

    it("multiple tiger purchases and resales can be tracked", async function () {
        await tiger.connect(bob).buyTiger(3, {value:ethers.utils.parseEther("1")})
        await tiger.connect(bob).buyTiger(13, {value:ethers.utils.parseEther("1")})
        await tiger.connect(bob).buyTiger(23, {value:ethers.utils.parseEther("1")})
        await tiger.connect(bob).putUpForSale(3, ethers.utils.parseEther("2"))
        await tiger.connect(bob).putUpForSale(13, ethers.utils.parseEther("2"))
        await tiger.connect(alice).buyTiger(3, {value:ethers.utils.parseEther("2")})
        await tiger.connect(alice).buyTiger(13, {value:ethers.utils.parseEther("2")})
        expect(await tiger.getBalance(bob.address)).to.equal(1)
        expect(await tiger.tigerByOwnerAndIndex(bob.address, 0)).to.equal(23)
        await expect(tiger.tigerByOwnerAndIndex(bob.address, 1)).to.be.revertedWith("owner doesn't have that many tigers")
        expect(await tiger.getBalance(alice.address)).to.equal(2)
        expect(await tiger.tigerByOwnerAndIndex(alice.address, 0)).to.equal(3)
        expect(await tiger.tigerByOwnerAndIndex(alice.address, 1)).to.equal(13)
    })

    it("tiger should show as no longer for sale after it's been bought", async function () {
        await tiger.connect(bob).buyTiger(38, {value:ethers.utils.parseEther("1")})
        expect((await tiger.isForSale(38))[0]).to.equal(false)
        expect(await tiger.connect(alice).getOwner(38)).to.equal(bob.address)
    })

    it("can't buy a tiger that is not for sale", async function () {
        await tiger.connect(alice).buyTiger(38, {value:ethers.utils.parseEther("1")})
        await expect(tiger.connect(bob).buyTiger(38, {value:ethers.utils.parseEther("1")})).to.be.revertedWith("not for sale")
    })

    it("can't buy a tiger that has just been bought by someone else", async function () {
        await tiger.connect(alice).buyTiger(13, {value:ethers.utils.parseEther("1")})
        await tiger.connect(alice).putUpForSale(13, ethers.utils.parseEther("1"))
        await tiger.connect(bob).buyTiger(13, {value:ethers.utils.parseEther("1")})
        await expect(tiger.connect(alice).buyTiger(13, {value:ethers.utils.parseEther("1")})).to.be.revertedWith("not for sale")
    })

})
