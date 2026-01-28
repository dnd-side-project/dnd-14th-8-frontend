import { useState } from "react";
import viteLogo from "/vite.svg";
import reactLogo from "./assets/react.svg";
import "./App.css";
import { cn } from "./utils";

function App() {
  const [count, setCount] = useState(0);

  const isHighlight = count > 0 && count % 5 === 0;

  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank" rel="noopener">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank" rel="noopener">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1 className="text-3xl underline">Vite + React</h1>
      <div className="card">
        <button type="button" onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
      </div>

      <p
        className={cn(
          "mt-4 text-sm",
          isHighlight ? "text-orange-600 font-bold" : "text-gray-500",
        )}
      >
        {isHighlight
          ? "🎉 5의 배수 달성! 스타일이 변경되었습니다."
          : "5의 배수가 되면 버튼이 변해요!"}
      </p>
    </>
  );
}

export default App;
