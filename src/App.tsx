import { useState } from "react";
import { MobileLayout } from "@/shared/components/mobile-layout";
import { cn } from "@/shared/utils/cn";

function App() {
  const [count, setCount] = useState(0);

  const isHighlight = count > 0 && count % 5 === 0;

  return (
    <MobileLayout>
      <h1 className="text-h1 text-primary-main">Vite + React</h1>
      <button
        className="text-t2"
        type="button"
        onClick={() => setCount((count) => count + 1)}
      >
        count is {count}
      </button>

      <p
        className={cn(
          "bg-amber-200",
          isHighlight ? "text-b3 text-sb-700" : "text-b2 text-p-500",
        )}
      >
        {isHighlight
          ? "🎉 5의 배수 달성! 스타일이 변경되었습니다."
          : "5의 배수가 되면 버튼이 변해요!"}
      </p>
    </MobileLayout>
  );
}

export default App;
