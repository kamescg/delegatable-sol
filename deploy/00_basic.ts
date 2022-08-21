import { HardhatRuntimeEnvironment } from "hardhat/types";

export default async function deploy(hardhat: HardhatRuntimeEnvironment) {
  const { deployments, getNamedAccounts } = hardhat;

  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();
  await deploy("DelegatableFacet", {
    contract: "DelegatableFacet",
    from: deployer,
    args: [],
    skipIfAlreadyDeployed: true,
    log: true,
  });
}
