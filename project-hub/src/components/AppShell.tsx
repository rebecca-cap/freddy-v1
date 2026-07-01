import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import ThemeSwitcher from "./ThemeSwitcher";

export default function AppShell() {
  return (
    <div className="flex min-h-screen bg-background text-foreground">
      <Sidebar />
      <main className="flex-1 overflow-auto">
        <div className="mx-auto w-full max-w-6xl px-6 py-10">
          <Outlet />
        </div>
      </main>
      <ThemeSwitcher />
    </div>
  );
}
