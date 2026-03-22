import { useEffect, useState, useRef } from "react";

interface Props {
  lastClaimed: number; 
  cooldownSeconds?: number;
}

const COOLDOWN = 86400; // 24 hours

export const Countdown = ({ lastClaimed, cooldownSeconds = COOLDOWN }: Props) => {
  const [timeLeft, setTimeLeft] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!lastClaimed) return;

    const calc = () => {
      const now = Math.floor(Date.now() / 1000);
      const next = lastClaimed + cooldownSeconds;
      const diff = next - now;
      setTimeLeft(diff > 0 ? diff : 0);
    };

    calc();
    intervalRef.current = setInterval(calc, 1000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [lastClaimed, cooldownSeconds]);

  if (!lastClaimed || timeLeft <= 0) return null;

  const h = Math.floor(timeLeft / 3600);
  const m = Math.floor((timeLeft % 3600) / 60);
  const s = timeLeft % 60;

  const pad = (n: number) => String(n).padStart(2, "0");

  return (
    <div className="cooldown-box">
      <div className="cooldown-label">⏳ Cooldown Active</div>
      <div className="cooldown-timer">
        {pad(h)}:{pad(m)}:{pad(s)}
      </div>
      <div className="cooldown-sub">
        Retry in {h > 0 ? `${h}h ` : ""}{m > 0 ? `${m}m ` : ""}{s}s
      </div>
    </div>
  );
};

export const useCountdownDone = (lastClaimed: number, cooldownSeconds = COOLDOWN) => {
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (!lastClaimed) { setDone(true); return; }
    const check = () => {
      const now = Math.floor(Date.now() / 1000);
      setDone(now >= lastClaimed + cooldownSeconds);
    };
    check();
    const id = setInterval(check, 1000);
    return () => clearInterval(id);
  }, [lastClaimed, cooldownSeconds]);

  return done;
};
