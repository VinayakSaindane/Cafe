import { Link } from "wouter";
import { Button } from "@/components/ui/button";

const Footer = () => {
  return (
    <footer className="bg-[#5C4033] text-white pt-12 pb-6">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="text-xl font-bold mb-4" style={{ fontFamily: "var(--font-heading)" }}>Brew & Bite</h3>
            <p className="mb-4 text-white/80">A modern café experience with artisanal coffee and delicious food in a welcoming atmosphere.</p>
            <div className="flex space-x-4">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-white hover:text-[#F5F5DC] transition-colors">
                <i className="fab fa-facebook-f"></i>
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-white hover:text-[#F5F5DC] transition-colors">
                <i className="fab fa-instagram"></i>
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-white hover:text-[#F5F5DC] transition-colors">
                <i className="fab fa-twitter"></i>
              </a>
              <a href="https://yelp.com" target="_blank" rel="noopener noreferrer" className="text-white hover:text-[#F5F5DC] transition-colors">
                <i className="fab fa-yelp"></i>
              </a>
            </div>
          </div>
          <div>
            <h3 className="text-xl font-bold mb-4" style={{ fontFamily: "var(--font-heading)" }}>Quick Links</h3>
            <ul className="space-y-2">
              <li><Link href="/menu"><a className="text-white/80 hover:text-white transition-colors">Our Menu</a></Link></li>
              <li><Link href="/pick-go"><a className="text-white/80 hover:text-white transition-colors">Pick & Go</a></Link></li>
              <li><Link href="/bookings"><a className="text-white/80 hover:text-white transition-colors">Reserve a Table</a></Link></li>
              <li><Link href="/about"><a className="text-white/80 hover:text-white transition-colors">About Us</a></Link></li>
              <li><Link href="/blog"><a className="text-white/80 hover:text-white transition-colors">Blog</a></Link></li>
              <li><Link href="/contact"><a className="text-white/80 hover:text-white transition-colors">Contact</a></Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-xl font-bold mb-4" style={{ fontFamily: "var(--font-heading)" }}>Contact Info</h3>
            <ul className="space-y-2">
              <li className="flex items-start">
                <i className="fas fa-map-marker-alt mt-1 mr-3 text-[#F5F5DC]"></i>
                <span className="text-white/80">123 Brew Street, Downtown<br />New York, NY 10001</span>
              </li>
              <li className="flex items-center">
                <i className="fas fa-phone-alt mr-3 text-[#F5F5DC]"></i>
                <span className="text-white/80">(555) 123-4567</span>
              </li>
              <li className="flex items-center">
                <i className="fas fa-envelope mr-3 text-[#F5F5DC]"></i>
                <span className="text-white/80">info@brewandbite.com</span>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-xl font-bold mb-4" style={{ fontFamily: "var(--font-heading)" }}>Opening Hours</h3>
            <ul className="space-y-2">
              <li className="flex justify-between">
                <span className="text-white/80">Monday - Friday</span>
                <span className="text-[#F5F5DC]">7AM - 9PM</span>
              </li>
              <li className="flex justify-between">
                <span className="text-white/80">Saturday</span>
                <span className="text-[#F5F5DC]">8AM - 10PM</span>
              </li>
              <li className="flex justify-between">
                <span className="text-white/80">Sunday</span>
                <span className="text-[#F5F5DC]">8AM - 10PM</span>
              </li>
            </ul>
            <div className="mt-4">
              <Link href="/order-online">
                <Button className="bg-white text-[#5C4033] hover:bg-[#F5F5DC] transition-colors font-medium mt-2" style={{ fontFamily: "var(--font-accent)" }}>
                  Order Online
                </Button>
              </Link>
            </div>
          </div>
        </div>
        <div className="border-t border-white/20 pt-6 text-center text-white/60">
          <p>&copy; {new Date().getFullYear()} Brew & Bite Café. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
