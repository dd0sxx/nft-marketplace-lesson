async function main() {
    const [deployer] = await ethers.getSigners();
    const addrs = await ethers.getSigners();

    console.log("Deploying contracts with the account:", deployer.address);

    console.log("Account balance:", (await deployer.getBalance()).toString());

    const TigerNFT = await ethers.getContractFactory("TigerNFT")
    const tiger = await TigerNFT.deploy(deployer.address, ethers.utils.parseEther("0.01"))


    console.log("TigerNFT address:", tiger.address);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
