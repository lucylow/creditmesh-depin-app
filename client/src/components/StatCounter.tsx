import { useEffect, useState } from "react";

interface StatCounterProps {
  value: number;
  label: string;
  suffix?: string;
  duration?: number;
}

export function StatCounter({ value, label, suffix = "", duration = 2000 }: StatCounterProps) {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    let startTime: number;
    let animationId: number;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const current = Math.floor(progress * value);
      setDisplayValue(current);

      if (progress < 1) {
        animationId = requestAnimationFrame(animate);
      }
    };

    animationId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationId);
  }, [value, duration]);

  const formatNumber = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + "M";
    if (num >= 1000) return (num / 1000).toFixed(1) + "K";
    return num.toLocaleString();
  };

  return (
    <div className="text-center">
      <div className="text-4xl md:text-5xl font-black text-slate-900 mb-2">
        {formatNumber(displayValue)}{suffix}
      </div>
      <p className="text-sm text-slate-600 font-mono uppercase tracking-widest">{label}</p>
    </div>
  );
}
