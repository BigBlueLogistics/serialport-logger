import { useState, useEffect, useRef } from "react";

function useIdle(timeoutMs: number) {
  const [countdown, setCountdown] = useState(1);
  const [status, setStatus] = useState<"running" | "idle">("idle");

  let intervalTime = useRef<NodeJS.Timer>();
  let delayTime = useRef<NodeJS.Timer>();

  const delay = (cb: () => void, ms: number) => {
    clearTimeout(delayTime.current);
    if (!delayTime.current) {
      setTimeout(cb, ms);
    }
  };

  const interval = (cb: () => void, ms: number) => {
    if (!intervalTime.current) {
      intervalTime.current = setInterval(cb, ms);
    }
  };

  const stopInterval = () => {
    clearInterval(intervalTime.current);
    delay(() => {
      intervalTime.current = undefined;
    }, 100);
  };

  const resetTimer = () => {
    if (countdown > 1) {
      setCountdown(1);
      return;
    }
  };

  const startIdle = () => {
    setStatus("running");
    resetTimer();
    interval(() => {
      setCountdown((prevCount) => prevCount + 1);
    }, 1000);
  };

  const stopTimer = () => {
    stopInterval();
    delay(() => {
      setCountdown(1);
      setStatus("idle");
    }, 200);
  };

  const isIdle = status === "idle";

  // When specified timeout reached
  // its set the status to "Idle"
  useEffect(() => {
    const countdownMs = countdown * 1000;
    if (status === "running" && countdownMs >= timeoutMs) {
      stopTimer();
    }
  }, [countdown, status, timeoutMs]);

  return { startIdle, isIdle, countdown };
}

export default useIdle;
