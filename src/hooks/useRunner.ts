import { useAppKitProvider, useAppKitAccount } from "@reown/appkit/react";
import { BrowserProvider, JsonRpcSigner, type Eip1193Provider } from "ethers";
import { useEffect, useMemo, useState } from "react";
import { jsonRpcProvider } from "../constants/provider";

const useRunners = () => {
  const [signer, setSigner] = useState<JsonRpcSigner | null>(null);
  const { isConnected } = useAppKitAccount();

  // useAppKitProvider can throw before AppKit hydrates – guard it
  let walletProvider: Eip1193Provider | undefined;
  try {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const result = useAppKitProvider<Eip1193Provider>("eip155");
    walletProvider = result.walletProvider;
  } catch {
    walletProvider = undefined;
  }

  const provider = useMemo(
    () => (walletProvider ? new BrowserProvider(walletProvider) : null),
    [walletProvider]
  );

  useEffect(() => {
    if (!provider || !isConnected) {
      setSigner(null);
      return;
    }
    provider.getSigner().then((s) => setSigner(s)).catch(() => setSigner(null));
  }, [provider, isConnected]);

  return { provider, signer, readOnlyProvider: jsonRpcProvider };
};

export default useRunners;
