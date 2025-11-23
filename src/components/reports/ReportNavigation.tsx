import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Menu, X, ChevronDown } from "lucide-react";

interface ReportNavigationProps {
  onScrollToSection: (sectionId: string) => void;
  activeSection?: string;
}

export const ReportNavigation = ({ onScrollToSection, activeSection }: ReportNavigationProps) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { scrollYProgress } = useScroll();
  
  // Transform scroll progress to width percentage
  const progressWidth = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollTo = (sectionId: string) => {
    onScrollToSection(sectionId);
    setMobileMenuOpen(false);
  };

  return (
    <nav
      className={`sticky top-0 z-50 transition-apple ${
        isScrolled ? "bg-white/60 backdrop-blur-xl shadow-sm" : "bg-white/80"
      } supports-[backdrop-filter]:bg-white/60`}
    >
      {/* Scroll Progress Bar */}
      <motion.div
        className="absolute bottom-0 left-0 h-[2px] bg-gradient-to-r from-blazeOrange via-deepSea to-mirage origin-left"
        style={{ width: progressWidth }}
      />
      
      <div className="max-w-[1280px] mx-auto px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center transition-apple hover:opacity-70 hover:scale-105">
            <span className="text-xl font-bold text-blazeOrange">utm.one</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-6">
            {/* Insights Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center gap-1 text-sm font-medium hover:text-blazeOrange transition-apple">
                Insights <ChevronDown className="h-4 w-4" />
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-white/95 backdrop-blur-xl">
                <DropdownMenuItem onClick={() => scrollTo("marketing-section")}>
                  Global Salary Benchmarks
                </DropdownMenuItem>
                <DropdownMenuItem className="text-muted-foreground cursor-not-allowed">
                  Quarterly Talent Report (Coming Soon)
                </DropdownMenuItem>
                <DropdownMenuItem className="text-muted-foreground cursor-not-allowed">
                  GTM Hiring Index (Coming Soon)
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Roles Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center gap-1 text-sm font-medium hover:text-blazeOrange transition-apple">
                Roles <ChevronDown className="h-4 w-4" />
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-white/95 backdrop-blur-xl">
                <DropdownMenuItem onClick={() => scrollTo("marketing-section")}>
                  Marketing
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => scrollTo("sales-section")}>
                  Sales
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => scrollTo("revops-section")}>
                  RevOps
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => scrollTo("revops-section")}>
                  Marketing Ops
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Regions Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center gap-1 text-sm font-medium hover:text-blazeOrange transition-apple">
                Regions <ChevronDown className="h-4 w-4" />
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-white/95 backdrop-blur-xl">
                <DropdownMenuItem onClick={() => scrollTo("regional-section")}>
                  United States
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => scrollTo("regional-section")}>
                  India
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => scrollTo("regional-section")}>
                  Europe
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => scrollTo("regional-section")}>
                  APAC
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => scrollTo("regional-section")}>
                  MENA
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Data Library Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center gap-1 text-sm font-medium hover:text-blazeOrange transition-apple">
                Data Library <ChevronDown className="h-4 w-4" />
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-white/95 backdrop-blur-xl">
                <DropdownMenuItem onClick={() => scrollTo("marketing-section")}>
                  Salary Tables
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => scrollTo("skill-section")}>
                  Skill Taxonomy
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => scrollTo("calculator-section")}>
                  Multipliers
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => scrollTo("data-sources")}>
                  Industry Benchmarks
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <button
              onClick={() => scrollTo("data-sources")}
              className="text-sm font-medium hover:text-blazeOrange transition-apple"
            >
              Open-Source
            </button>
          </div>

          {/* CTA Button - Removed to reduce clutter */}

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden py-4 border-t">
            <div className="flex flex-col gap-4">
              <button
                onClick={() => scrollTo("marketing-section")}
                className="text-left text-sm font-medium hover:text-blazeOrange"
              >
                Global Salary Benchmarks
              </button>
              <button
                onClick={() => scrollTo("marketing-section")}
                className="text-left text-sm font-medium hover:text-blazeOrange"
              >
                Marketing Roles
              </button>
              <button
                onClick={() => scrollTo("sales-section")}
                className="text-left text-sm font-medium hover:text-blazeOrange"
              >
                Sales Roles
              </button>
              <button
                onClick={() => scrollTo("revops-section")}
                className="text-left text-sm font-medium hover:text-blazeOrange"
              >
                RevOps & Marketing Ops
              </button>
              <button
                onClick={() => scrollTo("regional-section")}
                className="text-left text-sm font-medium hover:text-blazeOrange"
              >
                Regional Deep Dives
              </button>
              <button
                onClick={() => scrollTo("skill-section")}
                className="text-left text-sm font-medium hover:text-blazeOrange"
              >
                Skills Analysis
              </button>
              <button
                onClick={() => scrollTo("calculator-section")}
                className="text-left text-sm font-medium hover:text-blazeOrange"
              >
                Salary Calculator
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};
