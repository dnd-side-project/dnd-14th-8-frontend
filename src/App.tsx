import { Route, Routes } from "react-router";
import { IndexPage } from "@/shared/pages/index";

function App() {
  return (
    <Routes>
      <Route path="/" element={<IndexPage />} />
    </Routes>
  );
}

export default App;
