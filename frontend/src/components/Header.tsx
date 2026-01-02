import { Link } from "@tanstack/react-router";
import { Briefcase, Bell, User, Menu } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="relative">
              <div className="absolute inset-0 bg-primary/20 rounded-lg blur-md group-hover:bg-primary/30 transition-colors" />
              <div className="relative bg-primary/10 p-2 rounded-lg border border-primary/20 group-hover:border-primary/40 transition-colors">
                <Briefcase className="h-5 w-5 text-primary" />
              </div>
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
              JobSearch
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            <NavLink to="/" label="Home" />
            <NavLink to="/jobs" label="Browse Jobs" />
            <NavLink to="/companies" label="Companies" />
            <NavLink to="/resources" label="Resources" />
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              className="relative text-muted-foreground hover:text-foreground"
            >
              <Bell className="h-5 w-5" />
              <span className="absolute top-1.5 right-1.5 h-2 w-2 bg-primary rounded-full" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="text-muted-foreground hover:text-foreground"
            >
              <User className="h-5 w-5" />
            </Button>
            <Button variant="default" className="ml-2">
              Post a Job
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <Menu className="h-6 w-6" />
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-border/40 bg-background/95 backdrop-blur-xl">
          <nav className="flex flex-col p-4 gap-1">
            <MobileNavLink
              to="/"
              label="Home"
              onClick={() => setMobileMenuOpen(false)}
            />
            <MobileNavLink
              to="/jobs"
              label="Browse Jobs"
              onClick={() => setMobileMenuOpen(false)}
            />
            <MobileNavLink
              to="/companies"
              label="Companies"
              onClick={() => setMobileMenuOpen(false)}
            />
            <MobileNavLink
              to="/resources"
              label="Resources"
              onClick={() => setMobileMenuOpen(false)}
            />
            <div className="pt-4 mt-2 border-t border-border/40 flex flex-col gap-2">
              <Button variant="outline" className="w-full justify-start">
                <User className="h-4 w-4 mr-2" />
                Sign In
              </Button>
              <Button variant="default" className="w-full">
                Post a Job
              </Button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}

function NavLink({ to, label }: { to: string; label: string }) {
  return (
    <Link
      to={to}
      className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent/50 rounded-lg transition-colors"
      activeProps={{
        className:
          "px-4 py-2 text-sm font-medium text-primary bg-primary/10 rounded-lg",
      }}
    >
      {label}
    </Link>
  );
}

function MobileNavLink({
  to,
  label,
  onClick,
}: {
  to: string;
  label: string;
  onClick: () => void;
}) {
  return (
    <Link
      to={to}
      onClick={onClick}
      className="px-4 py-3 text-base font-medium text-muted-foreground hover:text-foreground hover:bg-accent/50 rounded-lg transition-colors"
      activeProps={{
        className:
          "px-4 py-3 text-base font-medium text-primary bg-primary/10 rounded-lg",
      }}
    >
      {label}
    </Link>
  );
}
