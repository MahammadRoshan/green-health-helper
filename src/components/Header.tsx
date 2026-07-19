import { useState } from "react";
import { Link } from "react-router-dom";
import { Leaf, Sparkles, LogOut, User as UserIcon } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import SubscribeDialog from "./SubscribeDialog";

const Header = () => {
  const { user, profile, signOut } = useAuth();
  const [subOpen, setSubOpen] = useState(false);

  const showSubscribe = !!profile && profile.login_count > 2 && !profile.is_subscribed;

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/70 backdrop-blur-xl border-b border-border/50">
      <div className="container mx-auto px-6 flex items-center justify-between h-16">
        <Link to="/" className="flex items-center gap-2 font-serif text-xl">
          <Leaf className="w-6 h-6 text-primary" />
          CropGuard
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          <a href="#detect" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            Detect
          </a>
          <a href="#database" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            Database
          </a>
          <a href="#how-it-works" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            How It Works
          </a>
        </nav>

        <div className="flex items-center gap-2">
          {showSubscribe && (
            <button
              onClick={() => setSubOpen(true)}
              className="hidden sm:inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-primary to-accent px-4 py-2 text-sm font-semibold text-primary-foreground shadow-md hover:shadow-lg transition-all hover:scale-105"
            >
              <Sparkles className="w-4 h-4" />
              Subscribe
            </button>
          )}

          {profile?.is_subscribed && (
            <span className="hidden sm:inline-flex items-center gap-1.5 rounded-full bg-success/15 text-success px-3 py-1 text-xs font-semibold">
              <Sparkles className="w-3 h-3" />
              PRO
            </span>
          )}

          {user ? (
            <div className="flex items-center gap-2">
              <div className="hidden sm:flex items-center gap-2 rounded-full bg-secondary px-3 py-1.5">
                <UserIcon className="w-4 h-4 text-muted-foreground" />
                <span className="text-xs font-medium max-w-[120px] truncate">
                  {profile?.full_name || user.email}
                </span>
              </div>
              <button
                onClick={signOut}
                className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-secondary transition-all"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Sign out</span>
              </button>
            </div>
          ) : (
            <>
              <Link
                to="/auth"
                className="inline-flex items-center rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                Log in
              </Link>
              <Link
                to="/auth"
                className="inline-flex items-center rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-sm hover:opacity-90 transition-all"
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
