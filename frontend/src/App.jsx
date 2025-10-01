import { Route, Routes } from "react-router";
import HomePage from "./pages/HomePage";
import CreatePage from "./pages/CreatePage";
import ProjectDetailPage from "./pages/ProjectDetailPage";

const App = () => {
  return (
    <div className="min-h-screen w-full bg-[#000000] bg-[radial-gradient(#ffffff33_1px,#00091d_1px)] bg-[size:20px_20px] bg-repeat">
      <div className="relative w-full bg-slate-950/0"></div>
      <Routes>
        <Route path="/" element={<HomePage />}></Route>
        <Route path="/create" element={<CreatePage />}></Route>
        <Route path="/project/:id" element={<ProjectDetailPage />}></Route>
      </Routes>
    </div>
  );
};

export default App;
