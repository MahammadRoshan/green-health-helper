import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import SubscribeDialog from "./SubscribeDialog";

const Header = () => {
  const { user, profile, signOut } = useAuth();
  const [subOpen, setSubOpen] = useState(false);

  const showSubscribe = !!profile && profile.login_count > 2 && !profile.is_subscribed;

  return (
    <header className="sticky top-0 z-50 bg-background/85 backdrop-blur-xl border-b border-foreground/10">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link to="/" className="font-serif text-2xl tracking-tight uppercase">
          CropGuard
        </Link>

        <nav className="hidden md:flex items-center gap-10">
          <a href="#detect" className="eyebrow opacity-60 hover:opacity-100 transition-opacity">Intelligence</a>
          <a href="#database" className="eyebrow opacity-60 hover:opacity-100 transition-opacity">Database</a>
          <a href="#how-it-works" className="eyebrow opacity-60 hover:opacity-100 transition-opacity">Methodology</a>
        </nav>

        <div className="flex items-center gap-3">
          {showSubscribe && (
            <button
              onClick={() => setSubOpen(true)}
              className="hidden sm:inline-flex items-center gap-2 bg-accent text-accent-foreground px-4 py-2 eyebrow hover:bg-accent/90 transition-colors"
            >
              Subscribe · Pro
            </button>
          )}

          {profile?.is_subscribed && (
            <span className="hidden sm:inline-flex items-center gap-2 border border-accent text-accent px-3 py-1.5 eyebrow">
              <span className="w-1.5 h-1.5 bg-accent rounded-full" /> Pro
            </span>
          )}

          {user ? (
            <div className="flex items-center gap-3">
              <span className="hidden md:inline text-[11px] font-medium text-muted-foreground max-w-[160px] truncate">
                {profile?.full_name || user.email}
              </span>
              <button
                onClick={signOut}
                className="eyebrow px-4 py-2 border border-foreground/20 hover:bg-foreground hover:text-background transition-colors"
              >
                Sign out
              </button>
            </div>
          ) : (
            <>
              <Link
                to="/auth"
                className="eyebrow px-3 py-2 opacity-70 hover:opacity-100 transition-opacity"
              >
                Log in
              </Link>
              <Link
                to="/auth"
                className="eyebrow px-4 py-2 bg-foreground text-background hover:bg-primary transition-colors"
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
