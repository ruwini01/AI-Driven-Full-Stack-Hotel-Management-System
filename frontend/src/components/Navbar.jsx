import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Hotel, Menu, X, User, Search, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "./ThemeToggle";
import { SignedIn, SignedOut } from "@clerk/clerk-react";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const navLinks = [
    { name: "Hotels", path: "/hotels" },
    { name: "AI Search", path: "/ai-search", icon: Sparkles },
    { name: "About", path: "/about" },
    { name: "Contact", path: "/contact" },
  ];

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="fixed top-0 left-0 right-0 z-50 glass border-b border-white/20"
    > <div className="container mx-auto px-4 py-4"> <div className="flex items-center justify-between">
      {/* Logo */} <Link to="/" className="flex items-center gap-2 group"> <div className="bg-primary p-2 rounded-lg group-hover:bg-primary-light transition-colors"> <Hotel className="w-6 h-6 text-primary-foreground" /> </div> <span className="text-2xl font-display font-bold gradient-text hidden sm:block">
        LuxStay </span> </Link>

      
      {/* Desktop Navigation */}
      <div className="hidden md:flex items-center gap-6">
        {navLinks.map((link) => (
          <Link
            key={link.path}
            to={link.path}
            className="text-foreground/80 hover:text-primary transition-colors flex items-center gap-2 font-medium"
          >
            {link.icon && <link.icon className="w-4 h-4" />}
            {link.name}
          </Link>
        ))}
      </div>

      {/* Desktop Actions */}
      <div className="hidden md:flex items-center gap-3">
        <ThemeToggle />

        <SignedOut>
          <Link to="/sign-in">
            <Button variant="ghost" size="sm">Log In</Button>
          </Link>
          <Link to="/sign-up">
            <Button size="sm">Sign Up</Button>
          </Link>
        </SignedOut>

        <SignedIn>
          <Button
            size="sm"
            onClick={() => navigate("/my-account")}
            className="gap-2"
          >
            <User className="w-4 h-4" />
            My Account
          </Button>
        </SignedIn>

        <Button
          size="sm"
          onClick={() => navigate("/hotels")}
          className="bg-primary hover:bg-primary-light gap-2"
        >
          <Search className="w-4 h-4" />
          Book Now
        </Button>
      </div>

      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden p-2 rounded-lg hover:bg-muted transition-colors"
      >
        {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>
    </div>

        {/* Mobile Menu */}
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden pt-4 pb-2 space-y-3"
          >
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className="block py-2 px-4 rounded-lg hover:bg-muted transition-colors flex items-center gap-2"
              >
                {link.icon && <link.icon className="w-4 h-4" />}
                {link.name}
              </Link>
            ))}

            <div className="flex flex-col gap-2 pt-2">
              <div className="flex items-center justify-between px-4 pb-2">
                <span className="text-sm font-medium">Theme</span>
                <ThemeToggle />
              </div>

              <SignedOut>
                <Link to="/sign-in">
                  <Button variant="ghost">Log In</Button>
                </Link>
                <Link to="/sign-up">
                  <Button>Sign Up</Button>
                </Link>
              </SignedOut>

              <SignedIn>
                <Button
                  size="sm"
                  onClick={() => {
                    navigate("/my-account");
                    setIsOpen(false);
                  }}
                  className="w-full gap-2"
                >
                  <User className="w-4 h-4" />
                  My Account
                </Button>
              </SignedIn>

              <Button
                size="sm"
                onClick={() => {
                  navigate("/hotels");
                  setIsOpen(false);
                }}
                className="w-full bg-primary hover:bg-primary-light gap-2"
              >
                <Search className="w-4 h-4" />
                Book Now
              </Button>
            </div>
          </motion.div>
        )}
      </div>
    </motion.nav>


  );
};

export default Navbar;
