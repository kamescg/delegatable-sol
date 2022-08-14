import { ethers } from "ethers";
import { Provider } from "@ethersproject/providers";
const MNEMONIC = "test test test test test test test test test test test junk";

export function getPrivateKeys(provider: Provider) {
  const wallet1 = ethers.Wallet.fromMnemonic(MNEMONIC, `m/44'/60'/0'/0/1`);
  const wallet2 = ethers.Wallet.fromMnemonic(MNEMONIC, `m/44'/60'/0'/0/2`);
  const wallet3 = ethers.Wallet.fromMnemonic(MNEMONIC, `m/44'/60'/0'/0/3`);
  return [
    wallet1.connect(provider),
    wallet2.connect(provider),
    wallet3.connect(provider),
  ];
}
