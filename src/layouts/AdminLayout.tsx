import { Outlet } from "react-router-dom";

export default function AdminLayout() {
  return (
    <div className="flex min-h-screen bg-muted/40">
      <div className="w-64 flex-col bg-background border-r hidden md:flex">
        <div className="flex h-14 items-center border-b px-4">
          <a className="flex items-center space-x-2" href="/admin">
            <span className="font-bold">Content Manager</span>
          </a>
        </div>
        <div className="flex-1 overflow-auto py-2">
          <nav className="grid items-start px-2 text-sm font-medium">
            <a className="flex items-center gap-3 rounded-lg px-3 py-2 bg-muted text-primary transition-all hover:text-primary" href="/admin">
              Dashboard
            </a>
            <a className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary" href="/">
              Back to Store
            </a>
          </nav>
        </div>
      </div>
      <div className="flex flex-1 flex-col sm:gap-4 sm:py-4 sm:pl-14 md:pl-0">
        <main className="flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
