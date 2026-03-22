import { Countdown, useCountdownDone } from "./Countdown";

interface Props {
  lastClaimed: number;
  faucetAmount: string;
  symbol: string;
  onRequest: () => Promise<boolean>;
  isPending: boolean;
}

export const FaucetPanel = ({ lastClaimed, faucetAmount, symbol, onRequest, isPending }: Props) => {
  const canRequest = useCountdownDone(lastClaimed);

  return (
    <div className="panel">
      <div className="panel-header">
        <span className="panel-icon">◇</span>
        <span className="panel-title">Faucet</span>
        <span className="panel-badge faucet">FREE TOKENS</span>
      </div>
      <div className="panel-body">
        <div className="info-row">
          <span className="info-key">Per Claim</span>
          <span className="info-val hl">{parseFloat(faucetAmount).toFixed(2)} {symbol}</span>
        </div>
        <div className="info-row">
          <span className="info-key">Cooldown</span>
          <span className="info-val">24 Hours</span>
        </div>

        {!canRequest && lastClaimed > 0 && (
          <Countdown lastClaimed={lastClaimed} />
        )}

        <button
          className="btn btn-green btn-full"
          onClick={onRequest}
          disabled={!canRequest || isPending}
        >
          {isPending ? (
            <><span className="spinner" /> Processing…</>
          ) : !canRequest && lastClaimed > 0 ? (
            <>⏳ On Cooldown</>
          ) : (
            <>◇ Request Tokens</>
          )}
        </button>
      </div>
    </div>
  );
};
