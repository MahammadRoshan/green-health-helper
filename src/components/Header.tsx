import { Leaf } from "lucide-react";

const Header = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/50">
      <div className="container mx-auto px-6 flex items-center justify-between h-16">
        <a href="#" className="flex items-center gap-2 font-serif text-xl">
          <Leaf className="w-6 h-6 text-primary" />
          CropGuard
        </a>
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
      </div>
    </header>
  );
};

export default Header;
