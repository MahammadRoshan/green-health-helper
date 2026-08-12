import { useState } from "react";
import { Link } from "react-router-dom";
import { Leaf, Zap } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import SubscribeDialog from "./SubscribeDialog";

const navItems = [
  { href: "#scanner", label: "Scanner" },
  { href: "#agents", label: "Agents" },
  { href: "#database", label: "Database" },
  { href: "#pricing", label: "Pricing" },
  { href: "#contact", label: "Contact" },
];

const Header = () => {
  const { user, profile, signOut } = useAuth();
  const [subOpen, setSubOpen] = useState(false);

  const lowCredits = !!profile && !profile.is_subscribed && profile.credits < 10;
  const showSubscribe = !!profile && !profile.is_subscribed && (profile.login_count > 2 || lowCredits);

  return (
    <header className="sticky top-0 z-50 px-3 pt-3">
      <div className="max-w-7xl mx-auto glass rounded-2xl px-4 md:px-6 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2.5">
          <span className="w-8 h-8 rounded-lg bg-primary/15 flex items-center justify-center">
            <Leaf className="w-4 h-4 text-primary" />
          </span>
          <span className="font-serif text-xl tracking-tight">Green Health</span>
        </Link>

        <nav className="hidden md:flex items-center gap-7">
          {navItems.map((n) => (
            <a
              key={n.href}
              href={n.href}
              className="text-xs font-medium text-foreground/60 hover:text-primary transition-colors"
            >
              {n.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2.5">
          {profile && !profile.is_subscribed && (
            <span
              className={`hidden sm:inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[11px] font-semibold ${
                lowCredits
                  ? "border-destructive/50 text-destructive"
                  : "border-foreground/15 text-foreground/70"
              }`}
              title="AI scan credits"
            >
              <Zap className="w-3 h-3" />
              {profile.credits}
            </span>
          )}

          {showSubscribe && (
            <button
              onClick={() => setSubOpen(true)}
              className="hidden sm:inline-flex items-center rounded-full bg-primary text-primary-foreground px-4 py-2 text-xs font-semibold glow-primary transition-transform hover:scale-[1.04]"
            >
              {lowCredits ? "Out of credits · Subscribe" : "Upgrade to Pro"}
            </button>
          )}

          {profile?.is_subscribed && (
            <span className="hidden sm:inline-flex items-center gap-2 rounded-full border border-accent/50 text-accent px-3 py-1.5 eyebrow">
              <span className="w-1.5 h-1.5 bg-accent rounded-full animate-pulse-soft" /> Pro
            </span>
          )}

          {user ? (
            <div className="flex items-center gap-2.5">
              <span className="hidden md:inline text-[11px] font-medium text-muted-foreground max-w-[140px] truncate">
                {profile?.full_name || user.email}
              </span>
              <button
                onClick={signOut}
                className="rounded-full px-4 py-2 text-xs font-semibold border border-foreground/15 hover:border-primary/50 hover:text-primary transition-colors"
              >
                Sign out
              </button>
            </div>
          ) : (
            <>
              <Link to="/auth" className="px-3 py-2 text-xs font-medium text-foreground/70 hover:text-foreground">
                Log in
              </Link>
              <Link
                to="/auth"
                className="rounded-full px-4 py-2 text-xs font-semibold bg-primary text-primary-foreground glow-primary transition-transform hover:scale-[1.04]"
              >
                Sign up
              </Link>
            </>
          )}
        </div>
      </div>

      <SubscribeDialog open={subOpen} onClose={() => setSubOpen(false)} />
    </header>
  );
};

export default Header;
