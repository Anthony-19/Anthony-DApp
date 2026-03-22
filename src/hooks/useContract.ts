import { useMemo } from "react";
import { Contract } from "ethers";
import { getAddress } from "ethers";
import useRunners from "./useRunner";
import { erc20TokenAbi } from "../ABI/Erc20";

export const useTodoContract = (withSigner = false) => {
  const { readOnlyProvider, signer } = useRunners();

  return useMemo(() => {
    if (withSigner) {
      if (!signer) return null;
      return new Contract(
        getAddress(import.meta.env.VITE_ERC20_CONTRACT_ADDRESS),
        erc20TokenAbi,
        signer
      );
    }
    return new Contract(
      getAddress(import.meta.env.VITE_ERC20_CONTRACT_ADDRESS),
     erc20TokenAbi,
      readOnlyProvider
    );
  }, [readOnlyProvider, signer, withSigner]);
};
