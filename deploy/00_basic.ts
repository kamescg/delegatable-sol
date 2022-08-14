import { HardhatRuntimeEnvironment } from "hardhat/types";

export default async function deploy(hardhat: HardhatRuntimeEnvironment) {
  const { deployments, getNamedAccounts } = hardhat;

  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();
  await deploy("DelegatableBasic", {
    contract: "DelegatableBasic",
    from: deployer,
    args: [],
    skipIfAlreadyDeployed: true,
    log: true,
  });
}
