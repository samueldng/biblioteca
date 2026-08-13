"use client";

import { useEffect, useState } from "react";

function formatDuration(totalSeconds: number) {
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = Math.floor(totalSeconds % 60);

  if (days > 0) return `${days}d ${hours}h ${minutes}m`;
  if (hours > 0) return `${hours}h ${minutes}m ${seconds}s`;
  return `${minutes}m ${seconds}s`;
}

export function CountdownTimer({ dueDate }: { dueDate: string | Date }) {
  const target = new Date(dueDate).getTime();
  const [secondsLeft, setSecondsLeft] = useState(() =>
    Math.max(0, Math.floor((target - Date.now()) / 1000))
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setSecondsLeft(Math.max(0, Math.floor((target - Date.now()) / 1000)));
    }, 1000);

    return () => clearInterval(interval);
  }, [target]);

  if (secondsLeft <= 0) {
    return <span className="font-mono text-red-600 dark:text-red-400">Atrasado</span>;
  }

  return <span className="font-mono">{formatDuration(secondsLeft)}</span>;
}
