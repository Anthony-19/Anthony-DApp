import { useState } from "react";

interface Props {
  onApprove: (spender: string, amount: string) => Promise<boolean>;
  isPending: boolean;
  symbol: string;
  onFetchAllowance: (owner: string, spender: string) => Promise<void>;
  allowance: string;
  account: string;
}

export const ApprovePanel = ({ onApprove, isPending, symbol, onFetchAllowance, allowance, account }: Props) => {
  const [spender, setSpender] = useState("");
  const [amount, setAmount] = useState("");
  const [checkSpender, setCheckSpender] = useState("");
  const [checked, setChecked] = useState(false);

  const handleApprove = async () => {
    if (!spender || !amount) return;
    const ok = await onApprove(spender, amount);
    if (ok) { setSpender(""); setAmount(""); }
  };

  const handleCheck = async () => {
    if (!checkSpender || !account) return;
    await onFetchAllowance(account, checkSpender);
    setChecked(true);
  };

  return (
    <div className="panel">
      <div className="panel-header">
        <span className="panel-icon">✓</span>
        <span className="panel-title">Approve / Allowance</span>
      </div>
      <div className="panel-body">
        <div className="section-title">Set Approval</div>
        <div className="field">
          <label className="field-label">Spender Address</label>
          <input
            className="field-input"
            placeholder="0x..."
            value={spender}
            onChange={(e) => setSpender(e.target.value)}
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
          className="btn btn-orange btn-full"
          onClick={handleApprove}
          disabled={isPending || !spender || !amount}
        >
          {isPending ? <><span className="spinner" /> Approving…</> : <>✓ Approve Spender</>}
        </button>

        <div className="section-title" style={{ marginTop: 8 }}>Check Allowance</div>
        <div className="field">
          <label className="field-label">Spender to Check</label>
          <input
            className="field-input"
            placeholder="0x..."
            value={checkSpender}
            onChange={(e) => { setCheckSpender(e.target.value); setChecked(false); }}
          />
        </div>
        <button
          className="btn btn-cyan btn-full"
          onClick={handleCheck}
          disabled={!checkSpender || !account}
        >
          ◈ Check Allowance
        </button>
        {checked && (
          <div className="allowance-display">
            {parseFloat(allowance).toFixed(4)} {symbol}
          </div>
        )}
      </div>
    </div>
  );
};
