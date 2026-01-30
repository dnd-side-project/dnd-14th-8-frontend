import { useState } from "react";
import { cn } from "./utils";

function App() {
  const [count, setCount] = useState(0);

  const isHighlight = count > 0 && count % 5 === 0;

  return (
    <>
      <h1 className="head1-sb-28 text-primary-main">Vite + React</h1>
      <button
        className="text-sb-500"
        type="button"
        onClick={() => setCount((count) => count + 1)}
      >
        count is {count}
      </button>

      <p
        className={cn(
          "bg-amber-200",
          isHighlight ? "head2-sb-24 text-sb-700" : "body4-m-14 text-p-500",
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
