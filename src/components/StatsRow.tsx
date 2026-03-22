interface StatCardProps {
  label: string;
  value: string;
  unit?: string;
  color?: "cyan" | "green" | "blue" | "orange";
  icon: string;
}

const StatCard = ({ label, value, unit, color = "cyan", icon }: StatCardProps) => (
  <div className="stat-card">
    <div className="stat-icon">{icon}</div>
    <div className="stat-label">{label}</div>
    <div className={`stat-value ${color}`}>{value}</div>
    {unit && <div className="stat-unit">{unit}</div>}
  </div>
);

interface Props {
  balance: string;
  totalSupply: string;
  maxSupply: string;
  faucetAmount: string;
  symbol: string;
}

export const StatsRow = ({ balance, totalSupply, maxSupply, faucetAmount, symbol }: Props) => {
  const fmt = (v: string) => {
    const n = parseFloat(v);
    if (isNaN(n)) return "0";
    if (n >= 1_000_000) return (n / 1_000_000).toFixed(2) + "M";
    if (n >= 1_000) return (n / 1_000).toFixed(2) + "K";
    return n.toFixed(4);
  };

  return (
    <div className="stats-row">
      <StatCard label="Your Balance" value={fmt(balance)} unit={symbol || "TOKEN"} color="cyan" icon="◈" />
      <StatCard label="Total Supply" value={fmt(totalSupply)} unit={symbol || "TOKEN"} color="green" icon="◉" />
      <StatCard label="Max Supply" value={fmt(maxSupply)} unit={symbol || "TOKEN"} color="blue" icon="◎" />
      <StatCard label="Faucet Amount" value={fmt(faucetAmount)} unit={symbol || "TOKEN"} color="orange" icon="◇" />
    </div>
  );
};
