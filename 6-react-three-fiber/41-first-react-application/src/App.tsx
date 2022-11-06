import Clicker from "./Clicker";
import { ReactElement, useMemo, useState } from "react";
import People from "./People";

export default function App({
  children,
  clickersCount,
}: {
  children: ReactElement;
  clickersCount: number;
}) {
  const [hasClicker, setHasClicker] = useState(true);
  const [count, setCount] = useState(0);

  const toggleClicker = () => setHasClicker((hasClicker) => !hasClicker);

  const increment = () => setCount((count) => count + 1);

  const colors = useMemo(
    () =>
      [...Array(clickersCount)].map(
        () => `hsl(${Math.random() * 360}deg, 100%, 30%)`
      ),
    [clickersCount]
  );

  return (
    <>
      {children}

      <People />

      <div>Total count: {count}</div>

      <button onClick={toggleClicker}>
        {hasClicker ? "Hide" : "Show"} clicker
      </button>

      {hasClicker && (
        <>
          {[...Array(clickersCount)].map((v, i) => (
            <Clicker
              key={i}
              increment={increment}
              keyName={`count${i}`}
              color={colors[i]}
            />
          ))}
        </>
      )}
    </>
  );
}
