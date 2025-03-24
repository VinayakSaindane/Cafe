import { Link } from "wouter";
import { Button } from "@/components/ui/button";

const HeroSection = () => {
  return (
    <section
      className="relative h-screen bg-cover bg-center pt-16"
      style={{
        backgroundImage:
          "linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url('https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80')",
      }}
    >
      <div className="absolute inset-0 flex items-center justify-center px-4">
        <div className="text-center">
          <h1
            className="text-4xl md:text-6xl lg:text-7xl text-white font-bold leading-tight mb-4"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Where Every Cup Tells a Story
          </h1>
          <p className="text-lg md:text-xl text-white mb-8 max-w-2xl mx-auto">
            Artisanal coffee, delicious food, and a warm atmosphere to make your day better.
          </p>
          <div className="flex flex-col md:flex-row justify-center gap-4">
            <Link href="/order-online">
              <Button
                size="lg"
                className="bg-[#5C4033] text-white hover:bg-[#8B4513] transition-colors font-medium text-lg"
                style={{ fontFamily: "var(--font-accent)" }}
              >
                Order Online
              </Button>
            </Link>
            <Link href="/bookings">
              <Button
                size="lg"
                variant="outline" 
                className="bg-white text-[#5C4033] hover:bg-[#F5F5DC] transition-colors font-medium text-lg"
                style={{ fontFamily: "var(--font-accent)" }}
              >
                Book a Table
              </Button>
            </Link>
          </div>
        </div>
      </div>
      <div className="absolute bottom-8 left-0 right-0 flex justify-center">
        <div className="bg-white/80 backdrop-blur-sm rounded-lg px-6 py-3 flex items-center space-x-6">
          <div className="text-center">
            <p className="text-[#5C4033] font-medium">Mon-Fri</p>
            <p className="text-[#333333]">7AM - 9PM</p>
          </div>
          <div className="h-8 w-px bg-[#333333]/20"></div>
          <div className="text-center">
            <p className="text-[#5C4033] font-medium">Sat-Sun</p>
            <p className="text-[#333333]">8AM - 10PM</p>
          </div>
          <div className="h-8 w-px bg-[#333333]/20"></div>
          <div className="text-center">
            <p className="text-[#5C4033] font-medium">Location</p>
            <p className="text-[#333333]">123 Brew St.</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
