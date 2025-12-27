import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "@/stores/useAuthStore";
import { Button } from "@/components/ui/button";
import { LogOut, Plane, Compass, Library, Menu, X } from "lucide-react";

export default function Navbar() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setIsMenuOpen(false);
    navigate("/auth/login");
  };

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <nav className="bg-background/90 supports-backdrop-filter:bg-background/70 sticky top-0 z-50 w-full border-b backdrop-blur">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-8">
        <div className="flex items-center gap-6">
          <Link to="/" className="flex items-center gap-2">
            <span className="bg-primary text-primary-foreground inline-flex h-9 w-9 items-center justify-center rounded-lg">
              <Plane className="h-5 w-5" />
            </span>
            <div className="leading-tight">
              <div className="text-foreground text-sm font-semibold">
                TravelLog
              </div>
              <div className="text-muted-foreground hidden text-xs sm:block">
                Travel stories & destinations
              </div>
            </div>
          </Link>

          <div className="hidden md:flex md:items-center md:gap-6">
            <Link
              to="/"
              className="text-muted-foreground hover:text-foreground flex items-center gap-2 text-sm font-medium"
            >
              <Compass className="h-4 w-4" />
              Explore
            </Link>

            {user && (
              <Link
                to="/my-articles"
                className="text-muted-foreground hover:text-foreground flex items-center gap-2 text-sm font-medium"
              >
                <Library className="h-4 w-4" />
                My Articles
              </Link>
            )}
          </div>
        </div>

        <div className="hidden md:flex md:items-center md:gap-3">
          {user ? (
            <>
              <span className="text-muted-foreground text-sm">
                Hi,{" "}
                <span className="text-foreground ml-1 font-medium">
                  {user.username}
                </span>
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                className="gap-2"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </Button>
            </>
          ) : (
            <div className="flex gap-2">
              <Link to="/auth/login">
                <Button variant="ghost" size="sm">
                  Login
                </Button>
              </Link>
              <Link to="/auth/register">
                <Button size="sm">Register</Button>
              </Link>
            </div>
          )}
        </div>

        <div className="flex md:hidden">
          <Button variant="ghost" size="icon" onClick={toggleMenu}>
            {isMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="bg-background border-b md:hidden">
          <div className="container mx-auto flex flex-col gap-4 px-4 py-4">
            <Link
              to="/"
              className="text-muted-foreground hover:text-foreground flex items-center gap-2 text-sm font-medium"
              onClick={() => setIsMenuOpen(false)}
            >
              <Compass className="h-4 w-4" />
              Explore
            </Link>

            {user && (
              <Link
                to="/my-articles"
                className="text-muted-foreground hover:text-foreground flex items-center gap-2 text-sm font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                <Library className="h-4 w-4" />
                My Articles
              </Link>
            )}

            <div className="border-t pt-4">
              {user ? (
                <div className="flex flex-col gap-3">
                  <span className="text-muted-foreground text-sm">
                    Hi,{" "}
                    <span className="text-foreground ml-1 font-medium">
                      {user.username}
                    </span>
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleLogout}
                    className="justify-start gap-2 px-0"
                  >
                    <LogOut className="h-4 w-4" />
                    Logout
                  </Button>
                </div>
              ) : (
                <div className="flex flex-col gap-2">
                  <Link to="/auth/login" onClick={() => setIsMenuOpen(false)}>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full justify-start"
                    >
                      Login
                    </Button>
                  </Link>
                  <Link
                    to="/auth/register"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Button size="sm" className="w-full">
                      Register
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
