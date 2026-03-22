import { useCallback, useState } from "react";
import { ethers } from "ethers";
import { useTodoContract } from "../useContract";

export const useReadERC = () => {
  const contract = useTodoContract(false);

  const [balance, setBalance] = useState<string>("0");
  const [totalSupply, setTotalSupply] = useState<string>("0");
  const [faucetAmount, setFaucetAmount] = useState<string>("0");
  const [maxSupply, setMaxSupply] = useState<string>("0");
  const [owner, setOwner] = useState<string>("");
  const [tokenName, setTokenName] = useState<string>("");
  const [tokenSymbol, setTokenSymbol] = useState<string>("");
  const [decimals, setDecimals] = useState<number>(18);
  const [lastClaimed, setLastClaimed] = useState<number>(0);
  const [allowance, setAllowance] = useState<string>("0");
  const [hasRole, setHasRole] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchBalance = useCallback(async (address: string) => {
    if (!contract || !address) return;
    try {
      const bal = await contract.balanceOf(address);
      setBalance(ethers.formatEther(bal));
    } catch {}
  }, [contract]);

  const fetchTotalSupply = useCallback(async () => {
    if (!contract) return;
    try {
      const supply = await contract.totalSupply();
      setTotalSupply(ethers.formatEther(supply));
    } catch {}
  }, [contract]);

  const fetchFaucetAmount = useCallback(async () => {
    if (!contract) return;
    try {
      const amt = await contract.faucetAmount();
      setFaucetAmount(ethers.formatEther(amt));
    } catch {}
  }, [contract]);

  const fetchMaxSupply = useCallback(async () => {
    if (!contract) return;
    try {
      const max = await contract.maxsupply();
      setMaxSupply(ethers.formatEther(max));
    } catch {}
  }, [contract]);

  const fetchOwner = useCallback(async () => {
    if (!contract) return;
    try {
      const o = await contract.owner();
      setOwner(o);
    } catch {}
  }, [contract]);

  const fetchTokenInfo = useCallback(async () => {
    if (!contract) return;
    try {
      const [name, symbol, dec] = await Promise.all([
        contract.name(),
        contract.symbol(),
        contract.decimals(),
      ]);
      setTokenName(name);
      setTokenSymbol(symbol);
      setDecimals(Number(dec));
    } catch {}
  }, [contract]);

  const fetchLastClaimed = useCallback(async (address: string) => {
    if (!contract || !address) return;
    try {
      const ts = await contract.lastClaimed(address);
      setLastClaimed(Number(ts));
    } catch {}
  }, [contract]);

  const fetchAllowance = useCallback(async (owner: string, spender: string) => {
    if (!contract || !owner || !spender) return;
    try {
      const al = await contract.allowance(owner, spender);
      setAllowance(ethers.formatEther(al));
    } catch {}
  }, [contract]);

  const checkHasRole = useCallback(async (role: string, account: string) => {
    if (!contract || !account) return;
    setLoading(true);
    try {
      const roleBytes =
        role === "DEFAULT_ADMIN_ROLE"
          ? await contract.DEFAULT_ADMIN_ROLE()
          : await contract.MINTER_ROLE();
      const result = await contract.hasRole(roleBytes, account);
      setHasRole(result);
    } catch {
      setHasRole(null);
    } finally {
      setLoading(false);
    }
  }, [contract]);

  const fetchAllData = useCallback(async (address: string) => {
    await Promise.all([
      fetchBalance(address),
      fetchTotalSupply(),
      fetchFaucetAmount(),
      fetchMaxSupply(),
      fetchOwner(),
      fetchTokenInfo(),
      fetchLastClaimed(address),
    ]);
  }, [fetchBalance, fetchTotalSupply, fetchFaucetAmount, fetchMaxSupply, fetchOwner, fetchTokenInfo, fetchLastClaimed]);

  return {
    balance, totalSupply, faucetAmount, maxSupply, owner,
    tokenName, tokenSymbol, decimals, lastClaimed, allowance, hasRole, loading,
    fetchBalance, fetchTotalSupply, fetchFaucetAmount, fetchMaxSupply,
    fetchOwner, fetchTokenInfo, fetchLastClaimed, fetchAllowance,
    checkHasRole, fetchAllData,
    setHasRole,
  };
};
