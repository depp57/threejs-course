import { useEffect, useRef, useState } from "react";

export default function Clicker({
  increment,
  keyName,
  color = "darkOrchid",
}: {
  increment: () => void;
  keyName: string;
  color?: string;
}) {
  const [count, setCount] = useState(
    parseInt(localStorage.getItem(keyName) ?? "0")
  );
  const button = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (button.current) {
      button.current.style.backgroundColor = "papayawhip";
    }

    return () => localStorage.removeItem(keyName);
  }, []);

  useEffect(() => localStorage.setItem(keyName, count.toString()), [count]);

  const onButtonClick = () => {
    setCount((value) => value + 1);
    increment();
  };

  return (
    <>
      <h1 style={{ color }}>Counter : {count}</h1>
      <button ref={button} onClick={onButtonClick}>
        Increments the counter
      </button>
    </>
  );
}
