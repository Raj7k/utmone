import { Link } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";

export const Navigation = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const { scrollYProgress } = useScroll();
  
  // Transform scroll progress to width percentage
  const progressWidth = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <header 
      className={`border-b border-border/50 backdrop-blur-xl supports-[backdrop-filter]:bg-white/60 sticky top-0 z-50 transition-all duration-300 ${
        isScrolled ? "bg-white/95 shadow-sm" : "bg-white/80"
      }`}
    >
      {/* Scroll Progress Bar */}
      <motion.div
        className="absolute bottom-0 left-0 h-[2px] bg-gradient-to-r from-accent-teal via-accent-yellow-green to-accent-mint origin-left"
        style={{ width: progressWidth }}
      />

      <div className="max-w-[1280px] mx-auto px-8 py-4">
        <nav className="flex items-center justify-between">
          {/* Logo with hover effect */}
          <Link to="/" className="flex items-center gap-2 group">
            <motion.span 
              className="text-[17px] font-semibold tracking-tight text-foreground"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
            >
              utm.one
            </motion.span>
          </Link>

          {/* Center Navigation Links */}
          <div className="hidden md:flex items-center gap-6">
            <motion.button
              onClick={() => scrollToSection("features")}
              className="text-[14px] font-medium text-foreground/70 hover:text-foreground transition-colors relative group"
              whileHover={{ y: -2 }}
              transition={{ duration: 0.2 }}
            >
              features
              <motion.span
                className="absolute -bottom-1 left-0 h-[2px] bg-accent-teal"
                initial={{ width: 0 }}
                whileHover={{ width: "100%" }}
                transition={{ duration: 0.3 }}
              />
            </motion.button>

            <motion.button
              onClick={() => scrollToSection("governance")}
              className="text-[14px] font-medium text-foreground/70 hover:text-foreground transition-colors relative group"
              whileHover={{ y: -2 }}
              transition={{ duration: 0.2 }}
            >
              governance
              <motion.span
                className="absolute -bottom-1 left-0 h-[2px] bg-accent-yellow-green"
                initial={{ width: 0 }}
                whileHover={{ width: "100%" }}
                transition={{ duration: 0.3 }}
              />
            </motion.button>
          </div>

          {/* Right: Status + CTA */}
          <div className="flex items-center gap-4">
            <motion.div 
              className="hidden sm:flex items-center gap-2 text-[13px] text-muted-foreground"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <motion.span 
                className="w-2 h-2 bg-accent-yellow-green rounded-full"
                animate={{ 
                  scale: [1, 1.2, 1],
                  opacity: [1, 0.7, 1]
                }}
                transition={{ 
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
              <span>open for early access</span>
            </motion.div>
            <Link to="/early-access">
              <motion.div
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                transition={{ duration: 0.2 }}
              >
                <Button 
                  variant="glow-pink"
                  size="sm"
                  className="font-medium rounded-full"
                >
                  get early access
                </Button>
              </motion.div>
            </Link>
          </div>
        </nav>
      </div>
    </header>
  );
};
