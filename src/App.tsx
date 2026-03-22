import { useEffect, useState, useCallback } from "react";
import { ethers } from "ethers";
import { useAppKit, useAppKitAccount } from "@reown/appkit/react";
import "./App.css";
import { useTodoContract } from "./hooks/useContract";
import { formatAddress } from "./utils";

/* ─── Toast ─────────────────────────────────────────────── */
type TType = "success" | "error" | "info";
interface TItem {
  id: number;
  msg: string;
  type: TType;
}
let _tid = 0;
const _listeners = new Set<(t: TItem) => void>();
const notify = (msg: string, type: TType = "info") => {
  const item = { id: ++_tid, msg, type };
  _listeners.forEach((fn) => fn(item));
};

function Toasts() {
  const [list, setList] = useState<TItem[]>([]);
  useEffect(() => {
    const h = (t: TItem) => {
      setList((p) => [...p, t]);
      setTimeout(() => setList((p) => p.filter((x) => x.id !== t.id)), 5000);
    };
    _listeners.add(h);
    return () => {
      _listeners.delete(h);
    };
  }, []);
  const icons = { success: "✓", error: "✕", info: "i" };
  return (
    <div className="toasts">
      {list.map((t) => (
        <div key={t.id} className={`toast toast-${t.type}`}>
          <span className="t-icon">{icons[t.type]}</span>
          <span className="t-msg">{t.msg}</span>
          <button
            onClick={() => setList((p) => p.filter((x) => x.id !== t.id))}
          >
            ×
          </button>
        </div>
      ))}
    </div>
  );
}

/* ─── Countdown ──────────────────────────────────────────── */
const COOLDOWN = 86400;
function Countdown({ lastClaimed }: { lastClaimed: number }) {
  const [left, setLeft] = useState(0);
  useEffect(() => {
    if (!lastClaimed) return;
    const tick = () => {
      const diff = lastClaimed + COOLDOWN - Math.floor(Date.now() / 1000);
      setLeft(diff > 0 ? diff : 0);
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [lastClaimed]);
  if (!left) return null;
  const h = Math.floor(left / 3600);
  const m = Math.floor((left % 3600) / 60);
  const s = left % 60;
  const p = (n: number) => String(n).padStart(2, "0");
  return (
    <div className="cooldown">
      <div className="cd-label">⏳ COOLDOWN ACTIVE</div>
      <div className="cd-timer">
        {p(h)}:{p(m)}:{p(s)}
      </div>
      <div className="cd-sub">
        Retry in {h > 0 ? `${h}h ` : ""}
        {m > 0 ? `${m}m ` : ""}
        {s}s
      </div>
    </div>
  );
}
function useCooldownDone(lastClaimed: number) {
  const [done, setDone] = useState(false);
  useEffect(() => {
    if (!lastClaimed) {
      setDone(true);
      return;
    }
    const check = () =>
      setDone(Math.floor(Date.now() / 1000) >= lastClaimed + COOLDOWN);
    check();
    const id = setInterval(check, 1000);
    return () => clearInterval(id);
  }, [lastClaimed]);
  return done;
}

/* ─── Stat Card ──────────────────────────────────────────── */
function StatCard({
  label,
  value,
  unit,
  color,
  icon,
}: {
  label: string;
  value: string;
  unit: string;
  color: string;
  icon: string;
}) {
  return (
    <div className="stat-card">
      <div className="stat-icon-bg">{icon}</div>
      <div className="stat-label">{label}</div>
      <div className={`stat-val ${color}`}>{value || "0"}</div>
      <div className="stat-unit">{unit}</div>
    </div>
  );
}

/* ─── Panel wrapper ──────────────────────────────────────── */
function Panel({
  title,
  icon,
  badge,
  badgeColor,
  children,
}: {
  title: string;
  icon: string;
  badge?: string;
  badgeColor?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="panel">
      <div className="panel-head">
        <span className="p-icon">{icon}</span>
        <span className="p-title">{title}</span>
        {badge && (
          <span className={`p-badge badge-${badgeColor || "blue"}`}>
            {badge}
          </span>
        )}
      </div>
      <div className="panel-body">{children}</div>
    </div>
  );
}

/* ─── Field ──────────────────────────────────────────────── */
function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="field">
      <div className="f-label">{label}</div>
      {children}
    </div>
  );
}

/* ─── Main App ───────────────────────────────────────────── */
export default function App() {
  const { open } = useAppKit();
  const { address, isConnected } = useAppKitAccount();

  const readContract = useTodoContract(false);
  const writeContract = useTodoContract(true);

  /* read state */
  const [balance, setBalance] = useState("0");
  const [supply, setSupply] = useState("0");
  const [maxSupply, setMaxSupply] = useState("0");
  const [faucetAmt, setFaucetAmt] = useState("0");
  const [owner, setOwner] = useState("");
  const [name, setName] = useState("");
  const [symbol, setSymbol] = useState("");
  const [decimals, setDecimals] = useState(18);
  const [lastClaimed, setLastClaimed] = useState(0);
  const [allowance, setAllowance] = useState("0");
  const [hasRole, setHasRole] = useState<boolean | null>(null);

  /* write / loading */
  const [reqPending, setReqPending] = useState(false);
  const [mintPending, setMintPending] = useState(false);
  const [xferPending, setXferPending] = useState(false);
  const [approvePend, setApprovePend] = useState(false);
  const [rolePending, setRolePending] = useState(false);

  /* form inputs */
  const [mintTo, setMintTo] = useState("");
  const [mintAmt, setMintAmt] = useState("");
  const [xferTo, setXferTo] = useState("");
  const [xferAmt, setXferAmt] = useState("");
  const [appSpender, setAppSpender] = useState("");
  const [appAmt, setAppAmt] = useState("");
  const [chkSpender, setChkSpender] = useState("");
  const [chkShown, setChkShown] = useState(false);
  const [balAddr, setBalAddr] = useState("");
  const [balResult, setBalResult] = useState<string | null>(null);
  const [roleAddr, setRoleAddr] = useState("");
  const [roleType, setRoleType] = useState("MINTER_ROLE");

  const canRequest = useCooldownDone(lastClaimed);
  const isOwner = !!(
    address &&
    owner &&
    address.toLowerCase() === owner.toLowerCase()
  );

  const fmt = (raw: string) => {
    const n = parseFloat(raw);
    if (isNaN(n)) return "0";
    if (n >= 1_000_000) return (n / 1_000_000).toFixed(2) + "M";
    if (n >= 1_000) return (n / 1_000).toFixed(2) + "K";
    return n.toFixed(4);
  };

  /* ── load all data ──────────────────────────────────────── */
  const loadData = useCallback(
    async (addr: string) => {
      if (!readContract || !addr) return;
      try {
        const [bal, tot, max, faucet, own, n, sym, dec, lc] = await Promise.all(
          [
            readContract.balanceOf(addr),
            readContract.totalSupply(),
            readContract.maxsupply(),
            readContract.faucetAmount(),
            readContract.owner(),
            readContract.name(),
            readContract.symbol(),
            readContract.decimals(),
            readContract.lastClaimed(addr),
          ],
        );
        setBalance(ethers.formatEther(bal));
        setSupply(ethers.formatEther(tot));
        setMaxSupply(ethers.formatEther(max));
        setFaucetAmt(ethers.formatEther(faucet));
        setOwner(own);
        setName(n);
        setSymbol(sym);
        setDecimals(Number(dec));
        setLastClaimed(Number(lc));
      } catch (e) {
        console.error("loadData error", e);
      }
    },
    [readContract],
  );

  useEffect(() => {
    if (isConnected && address && readContract) loadData(address);
  }, [isConnected, address, readContract]);

  /* ── error helper ───────────────────────────────────────── */
  const parseErr = (e: unknown): string => {
    const msg = e instanceof Error ? e.message : String(e);
    if (msg.includes("AlreadyClaimed")) {
      const m = msg.match(/AlreadyClaimed\((\d+)\)/);
      if (m) {
        const s = Number(m[1]);
        const h = Math.floor(s / 3600),
          mn = Math.floor((s % 3600) / 60),
          sc = s % 60;
        return `Already claimed. Retry in ${h}h ${mn}m ${sc}s`;
      }
      return "Already claimed. Wait 24 hours.";
    }
    if (msg.includes("MaxSupplyExceeded")) return "Max supply reached.";
    if (msg.includes("InvalidAmount")) return "Invalid amount.";
    if (msg.includes("InvalidAddress")) return "Invalid address.";
    if (msg.includes("user rejected")) return "Transaction rejected.";
    if (msg.includes("insufficient funds")) return "Insufficient gas funds.";
    return msg.slice(0, 80);
  };

  /* ── write functions ────────────────────────────────────── */
  const requestToken = async () => {
    if (!writeContract) return;
    setReqPending(true);
    try {
      const tx = await writeContract.requestToken();
      notify(`Tx submitted: ${tx.hash.slice(0, 18)}…`, "info");
      await tx.wait();
      notify("Tokens claimed!", "success");
      if (address) loadData(address);
    } catch (e) {
      notify(parseErr(e), "error");
    } finally {
      setReqPending(false);
    }
  };

  const mint = async () => {
    if (!writeContract || !mintTo || !mintAmt) return;
    setMintPending(true);
    try {
      const tx = await writeContract.mint(mintTo, ethers.parseEther(mintAmt));
      notify(`Tx submitted: ${tx.hash.slice(0, 18)}…`, "info");
      await tx.wait();
      notify("Tokens minted!", "success");
      setMintTo("");
      setMintAmt("");
      if (address) loadData(address);
    } catch (e) {
      notify(parseErr(e), "error");
    } finally {
      setMintPending(false);
    }
  };

  const transfer = async () => {
    if (!writeContract || !xferTo || !xferAmt) return;
    setXferPending(true);
    try {
      const tx = await writeContract.transfer(
        xferTo,
        ethers.parseEther(xferAmt),
      );
      notify(`Tx submitted: ${tx.hash.slice(0, 18)}…`, "info");
      await tx.wait();
      notify("Transfer complete!", "success");
      setXferTo("");
      setXferAmt("");
      if (address) loadData(address);
    } catch (e) {
      notify(parseErr(e), "error");
    } finally {
      setXferPending(false);
    }
  };

  const approve = async () => {
    if (!writeContract || !appSpender || !appAmt) return;
    setApprovePend(true);
    try {
      const tx = await writeContract.approve(
        appSpender,
        ethers.parseEther(appAmt),
      );
      notify(`Tx submitted: ${tx.hash.slice(0, 18)}…`, "info");
      await tx.wait();
      notify("Approval set!", "success");
      setAppSpender("");
      setAppAmt("");
    } catch (e) {
      notify(parseErr(e), "error");
    } finally {
      setApprovePend(false);
    }
  };

  /* ── read functions ─────────────────────────────────────── */
  const checkAllowance = async () => {
    if (!readContract || !address || !chkSpender) return;
    try {
      const al = await readContract.allowance(address, chkSpender);
      setAllowance(ethers.formatEther(al));
      setChkShown(true);
    } catch (e) {
      notify(parseErr(e), "error");
    }
  };

  const checkBalance = async () => {
    if (!readContract || !balAddr) return;
    try {
      const b = await readContract.balanceOf(balAddr);
      setBalResult(ethers.formatEther(b));
    } catch (e) {
      notify(parseErr(e), "error");
    }
  };

  const checkRole = async () => {
    if (!readContract || !roleAddr) return;
    setRolePending(true);
    try {
      const roleBytes =
        roleType === "DEFAULT_ADMIN_ROLE"
          ? await readContract.DEFAULT_ADMIN_ROLE()
          : await readContract.MINTER_ROLE();
      const result = await readContract.hasRole(roleBytes, roleAddr);
      setHasRole(result);
    } catch (e) {
      notify(parseErr(e), "error");
      setHasRole(null);
    } finally {
      setRolePending(false);
    }
  };

  /* ── render ─────────────────────────────────────────────── */
  return (
    <div className="app">
      {/* HEADER */}
      <header className="hdr">
        <div className="hdr-brand">
          <div className="hdr-logo">⬡</div>
          <div>
            <div className="hdr-title">{name || "ERC20"} TERMINAL</div>
            <div className="hdr-sub">Lisk Sepolia Testnet</div>
          </div>
        </div>
        <div className="hdr-right">
          {isConnected && (
            <div className="net-badge">
              <div className="net-dot" />
              Lisk Sepolia
            </div>
          )}
          <button className="pill-btn" onClick={() => open()}>
            {isConnected && address ? (
              <>
                <div className="pill-dot" />
                {formatAddress(address)}
              </>
            ) : (
              "Connect Wallet"
            )}
          </button>
        </div>
      </header>

      {/* CONNECT LANDING */}
      {!isConnected && (
        <div className="landing">
          <div className="land-icon">⬡</div>
          <h1 className="land-h1">
            {name ? name.toUpperCase() : "ERC20"}
            <br />
            <span>{symbol || "TOKEN"} TERMINAL</span>
          </h1>
          <p className="land-p">
            Connect your wallet to request free tokens, transfer, mint,
            <br />
            and explore contract data on Lisk Sepolia.
          </p>
          <button className="land-btn" onClick={() => open()}>
            ⬡ Connect Wallet
          </button>
        </div>
      )}

      {/* DASHBOARD */}
      {isConnected && (
        <main className="dash">
          {/* STATS */}
          <div className="stats">
            <StatCard
              label="Your Balance"
              value={fmt(balance)}
              unit={symbol || "TOKEN"}
              color="cyan"
              icon="◈"
            />
            <StatCard
              label="Total Supply"
              value={fmt(supply)}
              unit={symbol || "TOKEN"}
              color="green"
              icon="◉"
            />
            <StatCard
              label="Max Supply"
              value={fmt(maxSupply)}
              unit={symbol || "TOKEN"}
              color="blue"
              icon="◎"
            />
            <StatCard
              label="Faucet Amount"
              value={fmt(faucetAmt)}
              unit={symbol || "TOKEN"}
              color="orange"
              icon="◇"
            />
          </div>

          {/* WRITE PANELS ROW */}
          <div className="grid3">
            {/* FAUCET */}
            <Panel title="Faucet" icon="◇" badge="FREE" badgeColor="green">
              <div className="info-row">
                <span className="ik">Per Claim</span>
                <span className="iv green">
                  {parseFloat(faucetAmt).toFixed(2)} {symbol}
                </span>
              </div>
              <div className="info-row">
                <span className="ik">Cooldown</span>
                <span className="iv">24 hours</span>
              </div>
              {!canRequest && lastClaimed > 0 && (
                <Countdown lastClaimed={lastClaimed} />
              )}
              <button
                className={`btn ${canRequest ? "btn-green" : "btn-dim"} btn-full`}
                onClick={requestToken}
                disabled={!canRequest || reqPending}
              >
                {reqPending ? (
                  <>
                    <span className="spin" />
                    Processing…
                  </>
                ) : !canRequest ? (
                  <>⏳ On Cooldown</>
                ) : (
                  <>◇ Request Tokens</>
                )}
              </button>
            </Panel>

            {/* TRANSFER */}
            <Panel title="Transfer" icon="⇄">
              <Field label="Recipient Address">
                <input
                  className="finput"
                  placeholder="0x..."
                  value={xferTo}
                  onChange={(e) => setXferTo(e.target.value)}
                />
              </Field>
              <Field label={`Amount (${symbol || "TOKEN"})`}>
                <input
                  className="finput"
                  placeholder="0.00"
                  type="number"
                  min="0"
                  value={xferAmt}
                  onChange={(e) => setXferAmt(e.target.value)}
                />
              </Field>
              <button
                className="btn btn-cyan btn-full"
                onClick={transfer}
                disabled={xferPending || !xferTo || !xferAmt}
              >
                {xferPending ? (
                  <>
                    <span className="spin" />
                    Sending…
                  </>
                ) : (
                  <>⇄ Send Tokens</>
                )}
              </button>
            </Panel>

            {/* MINT */}
            <Panel
              title="Mint"
              icon="⬡"
              badge={isOwner ? "OWNER" : "LOCKED"}
              badgeColor={isOwner ? "blue" : "dim"}
            >
              {!isOwner ? (
                <div className="locked">
                  🔒 Only the contract owner
                  <br />
                  can mint tokens
                </div>
              ) : (
                <>
                  <Field label="Recipient Address">
                    <input
                      className="finput"
                      placeholder="0x..."
                      value={mintTo}
                      onChange={(e) => setMintTo(e.target.value)}
                    />
                  </Field>
                  <Field label={`Amount (${symbol || "TOKEN"})`}>
                    <input
                      className="finput"
                      placeholder="0.00"
                      type="number"
                      min="0"
                      value={mintAmt}
                      onChange={(e) => setMintAmt(e.target.value)}
                    />
                  </Field>
                  <button
                    className="btn btn-blue btn-full"
                    onClick={mint}
                    disabled={mintPending || !mintTo || !mintAmt}
                  >
                    {mintPending ? (
                      <>
                        <span className="spin" />
                        Minting…
                      </>
                    ) : (
                      <>⬡ Mint Tokens</>
                    )}
                  </button>
                </>
              )}
            </Panel>
          </div>

          {/* READ + APPROVE ROW */}
          <div className="grid2">
            {/* CONTRACT INFO + READ FUNCTIONS */}
            <Panel title="Contract Info &amp; Read" icon="◉">
              <div className="section-lbl">Token Details</div>
              <div className="info-row">
                <span className="ik">Name</span>
                <span className="iv">{name || "—"}</span>
              </div>
              <div className="info-row">
                <span className="ik">Symbol</span>
                <span className="iv green">{symbol || "—"}</span>
              </div>
              <div className="info-row">
                <span className="ik">Decimals</span>
                <span className="iv">{decimals}</span>
              </div>
              <div className="info-row">
                <span className="ik">Owner</span>
                <span className="iv cyan">
                  {owner ? `${owner.slice(0, 6)}…${owner.slice(-4)}` : "—"}
                </span>
              </div>

              <div className="section-lbl" style={{ marginTop: 12 }}>
                Check Any Balance
              </div>
              <Field label="Wallet Address">
                <input
                  className="finput"
                  placeholder="0x..."
                  value={balAddr}
                  onChange={(e) => {
                    setBalAddr(e.target.value);
                    setBalResult(null);
                  }}
                />
              </Field>
              <button
                className="btn btn-cyan btn-full"
                onClick={checkBalance}
                disabled={!balAddr}
              >
                ◈ Fetch Balance
              </button>
              {balResult !== null && (
                <div className="result-box">
                  {parseFloat(balResult).toFixed(4)} {symbol}
                </div>
              )}

              <div className="section-lbl" style={{ marginTop: 12 }}>
                Check Role
              </div>
              <Field label="Role">
                <select
                  className="finput fselect"
                  value={roleType}
                  onChange={(e) => {
                    setRoleType(e.target.value);
                    setHasRole(null);
                  }}
                >
                  <option value="MINTER_ROLE">MINTER_ROLE</option>
                  <option value="DEFAULT_ADMIN_ROLE">DEFAULT_ADMIN_ROLE</option>
                </select>
              </Field>
              <Field label="Address">
                <input
                  className="finput"
                  placeholder="0x..."
                  value={roleAddr}
                  onChange={(e) => {
                    setRoleAddr(e.target.value);
                    setHasRole(null);
                  }}
                />
              </Field>
              <button
                className="btn btn-blue btn-full"
                onClick={checkRole}
                disabled={!roleAddr || rolePending}
              >
                {rolePending ? (
                  <>
                    <span className="spin" />
                    Checking…
                  </>
                ) : (
                  <>◉ Check Role</>
                )}
              </button>
              {hasRole !== null && (
                <div className={`role-result ${hasRole ? "ryes" : "rno"}`}>
                  {hasRole
                    ? `✓ Has ${roleType}`
                    : `✕ Does not have ${roleType}`}
                </div>
              )}
            </Panel>

            {/* APPROVE + ALLOWANCE */}
            <Panel title="Approve &amp; Allowance" icon="✓">
              <div className="section-lbl">Set Approval</div>
              <Field label="Spender Address">
                <input
                  className="finput"
                  placeholder="0x..."
                  value={appSpender}
                  onChange={(e) => setAppSpender(e.target.value)}
                />
              </Field>
              <Field label={`Amount (${symbol || "TOKEN"})`}>
                <input
                  className="finput"
                  placeholder="0.00"
                  type="number"
                  min="0"
                  value={appAmt}
                  onChange={(e) => setAppAmt(e.target.value)}
                />
              </Field>
              <button
                className="btn btn-orange btn-full"
                onClick={approve}
                disabled={approvePend || !appSpender || !appAmt}
              >
                {approvePend ? (
                  <>
                    <span className="spin" />
                    Approving…
                  </>
                ) : (
                  <>✓ Approve Spender</>
                )}
              </button>

              <div className="section-lbl" style={{ marginTop: 12 }}>
                Check Allowance
              </div>
              <Field label="Spender to Check">
                <input
                  className="finput"
                  placeholder="0x..."
                  value={chkSpender}
                  onChange={(e) => {
                    setChkSpender(e.target.value);
                    setChkShown(false);
                  }}
                />
              </Field>
              <button
                className="btn btn-cyan btn-full"
                onClick={checkAllowance}
                disabled={!chkSpender || !address}
              >
                ◈ Check Allowance
              </button>
              {chkShown && (
                <div className="allowance-val">
                  {parseFloat(allowance).toFixed(4)} {symbol}
                </div>
              )}
            </Panel>
          </div>
        </main>
      )}

      <Toasts />
    </div>
  );
}
