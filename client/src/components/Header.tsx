import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/menu", label: "Menu" },
  { href: "/pick-go", label: "Pick & Go" },
  { href: "/bookings", label: "Bookings" },
  { href: "/reviews", label: "Reviews" },
  { href: "/blog", label: "Blog" },
  { href: "/contact", label: "Contact" },
];

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [location] = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className={`fixed w-full bg-white z-50 transition-all duration-300 ${isScrolled ? 'shadow-md' : ''}`}>
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center">
            <Link href="/">
              <a className="text-[#5C4033] text-2xl font-bold" style={{ fontFamily: "var(--font-heading)" }}>
                Brew <span className="text-[#8B4513]">&</span> Bite
              </a>
            </Link>
          </div>
          
          <nav className="hidden md:block">
            <ul className="flex space-x-8">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href}>
                    <a 
                      className={`text-[#333333] hover:text-[#8B4513] font-medium transition-colors ${
                        location === link.href ? "text-[#8B4513]" : ""
                      }`}
                      style={{ fontFamily: "var(--font-accent)" }}
                    >
                      {link.label}
                    </a>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          
          <div className="hidden md:flex items-center space-x-2">
            <Link href="/order-online">
              <Button className="bg-[#5C4033] hover:bg-[#8B4513] text-white font-medium" style={{ fontFamily: "var(--font-accent)" }}>
                Order Online
              </Button>
            </Link>
          </div>
          
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" className="md:hidden p-2">
                <Menu className="h-6 w-6 text-[#333333] hover:text-[#8B4513]" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[250px] sm:w-[300px]">
              <div className="py-4">
                <div className="text-[#5C4033] text-xl font-bold mb-6" style={{ fontFamily: "var(--font-heading)" }}>
                  Brew <span className="text-[#8B4513]">&</span> Bite
                </div>
                <ul className="space-y-4">
                  {navLinks.map((link) => (
                    <li key={link.href}>
                      <Link href={link.href}>
                        <a 
                          className={`block text-[#333333] hover:text-[#8B4513] font-medium ${
                            location === link.href ? "text-[#8B4513]" : ""
                          }`}
                          style={{ fontFamily: "var(--font-accent)" }}
                        >
                          {link.label}
                        </a>
                      </Link>
                    </li>
                  ))}
                  <li className="pt-2">
                    <Link href="/order-online">
                      <Button className="w-full bg-[#5C4033] hover:bg-[#8B4513] text-white font-medium" style={{ fontFamily: "var(--font-accent)" }}>
                        Order Online
                      </Button>
                    </Link>
                  </li>
                </ul>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};

export default Header;
