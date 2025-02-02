const hre = require("hardhat");

async function main() {
    console.log("Starting deployment...");

    // Get the contract factory
    const Transactions = await hre.ethers.getContractFactory("Transactions");
    console.log("Transactions contract factory obtained");

    // Deploy the contract
    const transactions = await Transactions.deploy();
    console.log("Transactions contract deployment initiated");

    // Wait for the deployment to be mined
    const receipt = await transactions.deploymentTransaction().wait();
    console.log("Transaction Mined in Block:", receipt.blockNumber);

    // Log the full transaction receipt
    console.log("Transaction Receipt:", receipt);

    // Ensure the contract is deployed and retrieve the address
    const contractAddress = receipt.contractAddress || transactions.address;
    if (contractAddress) {
        console.log("Transactions contract deployed to:", contractAddress);
    } else {
        console.error("Failed to get the contract address.");
    }
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});

// const deploy async () =>{
//     const Transactions = await hre.ethers.getContractFactory("Transactions");
//     const transactions = await Transactions.deploy();

//     await transactions.deployer();

//     console.log("Transactions deployed to:",transactions.address);
// };

// const runDeploy = async() =>{
//     try{
//         await deploy();
//         process.exit(0);
//     }catch(err){
//         console.log(err);
//         process.exit(1);
//     }
// };

// runDeploy();