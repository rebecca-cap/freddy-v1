import { Route, Routes } from "react-router-dom";
import AppShell from "./components/AppShell";
import DesignPatternsPage from "./pages/DesignPatternsPage";
import DesignSystemPage from "./pages/DesignSystemPage";
import HomePage from "./pages/HomePage";
import ProjectPage from "./pages/ProjectPage";
import WireframeSystemPage from "./pages/WireframeSystemPage";

export default function App() {
  return (
    <Routes>
      <Route element={<AppShell />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/p/:slug" element={<ProjectPage />} />
        <Route path="/design-system/:slug?" element={<DesignSystemPage />} />
        <Route path="/wireframe-system/:slug?" element={<WireframeSystemPage />} />
        <Route path="/design-patterns/:slug?" element={<DesignPatternsPage />} />
      </Route>
    </Routes>
  );
}
