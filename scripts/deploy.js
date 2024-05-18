const hre = require("hardhat");

async function main() {
    const [deployer] = await hre.ethers.getSigners();
    console.log("Deploying contracts with the account:", deployer.address);
  
    // Deploy Admin contract
    const Admin = await ethers.getContractFactory("Admin");
    console.log("Deploying contract...");
    const admin = await Admin.deploy(deployer.address);
    console.log("Admin contract deployed to:", admin.target);
  
    // Deploy Payment contract
    const Payment = await hre.ethers.getContractFactory("Payment");
    console.log("Deploying contract...");
    const payment = await Payment.deploy(deployer.address, 1.000000, 5, 10); // Adjust constructor arguments as necessary
    console.log("Payment contract deployed to:", payment.target);
  
    // Deploy Voting contract
    const Voting = await hre.ethers.getContractFactory("Voting");
    console.log("Deploying contract...");
    const voting = await Voting.deploy(deployer.address, admin.target, payment.target);
    console.log("Voting contract deployed to:", voting.target);
    
  
    // Save contract addresses and ABIs to files
    saveFrontendFiles(admin, 'Admin');
    saveFrontendFiles(payment, 'Payment');
    saveFrontendFiles(voting, 'Voting');
  }
  
  function saveFrontendFiles(contract, name) {
    const fs = require("fs");
    const contractsDir = __dirname + "/../frontend/src/contracts";
  
    if (!fs.existsSync(contractsDir)) {
        fs.mkdirSync(contractsDir, { recursive: true });
      }
  
    fs.writeFileSync(
      contractsDir + `/${name}-address.json`,
      JSON.stringify({ address: contract.address }, undefined, 2)
    );
  
    const ContractArtifact = hre.artifacts.readArtifactSync(name);
  
    fs.writeFileSync(
      contractsDir + `/${name}.json`,
      JSON.stringify(ContractArtifact, null, 2)
    );
  }
  
  main()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });

