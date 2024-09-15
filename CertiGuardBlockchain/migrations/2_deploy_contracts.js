const CertiGuard = artifacts.require("CertiGuard");

module.exports = async function(deployer) {
  try {
    await deployer.deploy(CertiGuard);
    const deployedContract = await CertiGuard.deployed();
    console.log('CertiGuard contract deployed at address:', deployedContract.address);
  } catch (error) {
    console.error('Error deploying CertiGuard contract:', error);
  }
};
