import { useState } from "react";

interface Props {
  account: string;
  owner: string;
  tokenName: string;
  symbol: string;
  decimals: number;
  onCheckBalance: (addr: string) => Promise<void>;
  onCheckRole: (role: string, addr: string) => Promise<void>;
  hasRole: boolean | null;
  hasRoleLoading: boolean;
}

export const ReadPanel = ({
  account, owner, tokenName, symbol, decimals,
  onCheckBalance, onCheckRole, hasRole, hasRoleLoading
}: Props) => {
  const [balAddr, setBalAddr] = useState("");
  const [balResult, setBalResult] = useState<string | null>(null);
  const [roleAddr, setRoleAddr] = useState("");
  const [selectedRole, setSelectedRole] = useState("MINTER_ROLE");
  const [checkedRole, setCheckedRole] = useState(false);

  const handleBalCheck = async () => {
    if (!balAddr) return;
    await onCheckBalance(balAddr);
    setBalResult("fetched");
  };

  const handleRoleCheck = async () => {
    if (!roleAddr) return;
    await onCheckRole(selectedRole, roleAddr);
    setCheckedRole(true);
  };

  const fmt = (addr: string) => addr ? `${addr.slice(0, 6)}...${addr.slice(-4)}` : "—";

  return (
    <div className="panel">
      <div className="panel-header">
        <span className="panel-icon">◉</span>
        <span className="panel-title">Contract Info</span>
      </div>
      <div className="panel-body">
        <div className="section-title">Token Details</div>
        <div className="info-row">
          <span className="info-key">Name</span>
          <span className="info-val">{tokenName || "—"}</span>
        </div>
        <div className="info-row">
          <span className="info-key">Symbol</span>
          <span className="info-val hl">{symbol || "—"}</span>
        </div>
        <div className="info-row">
          <span className="info-key">Decimals</span>
          <span className="info-val">{decimals}</span>
        </div>
        <div className="info-row">
          <span className="info-key">Owner</span>
          <span className="info-val addr">{fmt(owner)}</span>
        </div>

        <div className="section-title" style={{ marginTop: 8 }}>Check Any Balance</div>
        <div className="field">
          <input
            className="field-input"
            placeholder="0x address..."
            value={balAddr}
            onChange={(e) => setBalAddr(e.target.value)}
          />
        </div>
        <button className="btn btn-cyan btn-full" onClick={handleBalCheck} disabled={!balAddr}>
          ◈ Fetch Balance
        </button>

        <div className="section-title" style={{ marginTop: 8 }}>Check Role</div>
        <div className="field">
          <select
            className="field-input"
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
            style={{ cursor: "pointer" }}
          >
            <option value="MINTER_ROLE">MINTER_ROLE</option>
            <option value="DEFAULT_ADMIN_ROLE">DEFAULT_ADMIN_ROLE</option>
          </select>
        </div>
        <div className="field">
          <input
            className="field-input"
            placeholder="0x address..."
            value={roleAddr}
            onChange={(e) => { setRoleAddr(e.target.value); setCheckedRole(false); }}
          />
        </div>
        <button
          className="btn btn-blue btn-full"
          onClick={handleRoleCheck}
          disabled={!roleAddr || hasRoleLoading}
        >
          {hasRoleLoading ? <><span className="spinner" /> Checking…</> : <>◉ Check Role</>}
        </button>
        {checkedRole && hasRole !== null && (
          <div className={`role-result ${hasRole ? "has" : "nope"}`}>
            {hasRole ? `✓ Has ${selectedRole}` : `✕ Does not have ${selectedRole}`}
          </div>
        )}
      </div>
    </div>
  );
};
