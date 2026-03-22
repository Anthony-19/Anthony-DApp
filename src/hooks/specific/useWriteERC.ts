import { useCallback, useState } from "react";
import { ethers } from "ethers";
import { useTodoContract } from "../useContract";

type TxStatus = "idle" | "pending" | "success" | "error";

export const useWriteERC = () => {
  const contract = useTodoContract(true);

  const [requestStatus, setRequestStatus] = useState<TxStatus>("idle");
  const [mintStatus, setMintStatus] = useState<TxStatus>("idle");
  const [transferStatus, setTransferStatus] = useState<TxStatus>("idle");
  const [approveStatus, setApproveStatus] = useState<TxStatus>("idle");
  const [txHash, setTxHash] = useState<string>("");
  const [error, setError] = useState<string>("");

  const parseContractError = (err: unknown): string => {
    if (err instanceof Error) {
      const msg = err.message;
      if (msg.includes("AlreadyClaimed")) {
        const match = msg.match(/AlreadyClaimed\((\d+)\)/);
        if (match) {
          const secs = Number(match[1]);
          const h = Math.floor(secs / 3600);
          const m = Math.floor((secs % 3600) / 60);
          const s = secs % 60;
          return `Already claimed. Retry in ${h}h ${m}m ${s}s`;
        }
        return "Already claimed. Please wait 24 hours.";
      }
      if (msg.includes("MaxSupplyExceeded")) return "Max supply has been reached.";
      if (msg.includes("InvalidAmount")) return "Invalid amount.";
      if (msg.includes("InvalidAddress")) return "Invalid address.";
      if (msg.includes("user rejected")) return "Transaction rejected.";
      if (msg.includes("insufficient funds")) return "Insufficient funds for gas.";
      return msg.slice(0, 100);
    }
    return "An unknown error occurred.";
  };

  const requestToken = useCallback(async (): Promise<boolean> => {
    if (!contract) { setError("Connect wallet first"); return false; }
    setRequestStatus("pending");
    setError("");
    try {
      const tx = await contract.requestToken();
      setTxHash(tx.hash);
      await tx.wait();
      setRequestStatus("success");
      return true;
    } catch (err) {
      setError(parseContractError(err));
      setRequestStatus("error");
      return false;
    }
  }, [contract]);

  const mint = useCallback(async (to: string, amount: string): Promise<boolean> => {
    if (!contract) { setError("Connect wallet first"); return false; }
    setMintStatus("pending");
    setError("");
    try {
      const tx = await contract.mint(to, ethers.parseEther(amount));
      setTxHash(tx.hash);
      await tx.wait();
      setMintStatus("success");
      return true;
    } catch (err) {
      setError(parseContractError(err));
      setMintStatus("error");
      return false;
    }
  }, [contract]);

  const transfer = useCallback(async (to: string, amount: string): Promise<boolean> => {
    if (!contract) { setError("Connect wallet first"); return false; }
    setTransferStatus("pending");
    setError("");
    try {
      const tx = await contract.transfer(to, ethers.parseEther(amount));
      setTxHash(tx.hash);
      await tx.wait();
      setTransferStatus("success");
      return true;
    } catch (err) {
      setError(parseContractError(err));
      setTransferStatus("error");
      return false;
    }
  }, [contract]);

  const approve = useCallback(async (spender: string, amount: string): Promise<boolean> => {
    if (!contract) { setError("Connect wallet first"); return false; }
    setApproveStatus("pending");
    setError("");
    try {
      const tx = await contract.approve(spender, ethers.parseEther(amount));
      setTxHash(tx.hash);
      await tx.wait();
      setApproveStatus("success");
      return true;
    } catch (err) {
      setError(parseContractError(err));
      setApproveStatus("error");
      return false;
    }
  }, [contract]);

  const resetStatus = useCallback(() => {
    setRequestStatus("idle");
    setMintStatus("idle");
    setTransferStatus("idle");
    setApproveStatus("idle");
    setError("");
    setTxHash("");
  }, []);

  return {
    requestToken, mint, transfer, approve,
    requestStatus, mintStatus, transferStatus, approveStatus,
    txHash, error, resetStatus,
  };
};
