import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface Section {
  id: string;
  title: string;
  number: string;
}

const sections: Section[] = [
  { id: "executive-summary", title: "Executive Summary", number: "01" },
  { id: "mega-trends", title: "Mega-Trends", number: "02" },
  { id: "marketing-section", title: "Marketing Salaries", number: "03" },
  { id: "sales-section", title: "Sales Salaries", number: "04" },
  { id: "revops-section", title: "RevOps & MarkOps", number: "05" },
  { id: "regional-section", title: "Regional Deep Dives", number: "06" },
  { id: "skill-section", title: "Skill Demand", number: "07" },
  { id: "calculator-section", title: "Salary Calculator", number: "08" },
];

interface ReportTableOfContentsProps {
  onScrollToSection: (sectionId: string) => void;
}

export const ReportTableOfContents = ({ onScrollToSection }: ReportTableOfContentsProps) => {
  const [activeSection, setActiveSection] = useState<string>("");

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 200;

      for (let i = sections.length - 1; i >= 0; i--) {
        const section = document.getElementById(sections[i].id);
        if (section && section.offsetTop <= scrollPosition) {
          setActiveSection(sections[i].id);
          break;
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Initial check
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="hidden xl:block fixed right-4 top-36 w-64 bg-white border-2 border-deepSea/10 rounded-2xl p-6 shadow-lg z-20">
      <h3 className="text-sm font-bold text-mirage mb-4 uppercase tracking-wide">
        Table of Contents
      </h3>
      <nav className="space-y-3">
        {sections.map((section) => (
          <button
            key={section.id}
            onClick={() => onScrollToSection(section.id)}
            className={cn(
              "flex items-start gap-3 w-full text-left text-sm transition-all group",
              activeSection === section.id
                ? "text-blazeOrange font-semibold"
                : "text-secondary-label hover:text-deepSea"
            )}
          >
            <span
              className={cn(
                "text-xs font-bold mt-0.5 transition-colors",
                activeSection === section.id ? "text-blazeOrange" : "text-deepSea/40 group-hover:text-deepSea"
              )}
            >
              {section.number}
            </span>
            <span className="flex-1">{section.title}</span>
          </button>
        ))}
      </nav>

      <div className="mt-6 pt-6 border-t border-deepSea/10">
        <p className="text-xs text-secondary-label mb-2">Reading Progress</p>
        <div className="h-2 bg-wildSand rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-blazeOrange to-deepSea transition-all duration-300"
            style={{
              width: `${
                ((sections.findIndex((s) => s.id === activeSection) + 1) /
                  sections.length) *
                100
              }%`,
            }}
          />
        </div>
        <p className="text-xs text-secondary-label mt-2">
          {sections.findIndex((s) => s.id === activeSection) + 1} of {sections.length} sections
        </p>
      </div>
    </div>
  );
};
