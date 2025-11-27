import Link from "next/link";

export function AppHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-card">
      <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 sm:py-6 flex items-center justify-between">
        {/* Logo/Title */}
        <Link href="/feed" className="text-2xl font-bold text-primary hover:text-accent transition-colors">
          Quote Me Up
        </Link>

        {/* Login Button */}
        <button className="px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-accent transition-colors font-medium text-sm">
          Login
        </button>
      </div>
    </header>
  );
}
