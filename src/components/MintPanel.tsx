import { useState } from "react";

interface Props {
  onMint: (to: string, amount: string) => Promise<boolean>;
  isPending: boolean;
  symbol: string;
  isOwner: boolean;
}

export const MintPanel = ({ onMint, isPending, symbol, isOwner }: Props) => {
  const [to, setTo] = useState("");
  const [amount, setAmount] = useState("");

  const handleSubmit = async () => {
    if (!to || !amount) return;
    const ok = await onMint(to, amount);
    if (ok) { setTo(""); setAmount(""); }
  };

  return (
    <div className="panel">
      <div className="panel-header">
        <span className="panel-icon">⬡</span>
        <span className="panel-title">Mint</span>
        <span className="panel-badge minter">
          {isOwner ? "OWNER" : "MINTER ONLY"}
        </span>
      </div>
      <div className="panel-body">
        {!isOwner ? (
          <div className="locked-msg">
            🔒 Only the contract owner<br />can access this function
          </div>
        ) : (
          <>
            <div className="field">
              <label className="field-label">Recipient Address</label>
              <input
                className="field-input"
                placeholder="0x..."
                value={to}
                onChange={(e) => setTo(e.target.value)}
              />
            </div>
            <div className="field">
              <label className="field-label">Amount ({symbol})</label>
              <input
                className="field-input"
                placeholder="0.00"
                type="number"
                min="0"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </div>
            <button
              className="btn btn-blue btn-full"
              onClick={handleSubmit}
              disabled={isPending || !to || !amount}
            >
              {isPending
                ? <><span className="spinner" /> Minting…</>
                : <>⬡ Mint Tokens</>
              }
            </button>
          </>
        )}
      </div>
    </div>
  );
};
