import { useEffect, useRef, useState } from "react";
import { LucideIcon } from "lucide-react";

interface Role {
  name: string;
  icon: LucideIcon;
  color: "primary" | "accent" | "secondary" | "muted";
  opacity: number;
}

interface RoleHierarchyProps {
  roles: Role[];
}

export const RoleHierarchy = ({ roles }: RoleHierarchyProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.2 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  const colorMap = {
    primary: "border-primary/30",
    accent: "border-accent/30",
    secondary: "border-secondary/30",
    muted: "border-muted/30",
  };

  const getColorStyle = (color: "primary" | "accent" | "secondary" | "muted") => {
    const styles = {
      primary: { background: 'rgba(25,18,101,0.2)', color: '#191265' },
      accent: { background: 'rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.9)' },
      secondary: { background: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.8)' },
      muted: { background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.5)' },
    };
    return styles[color];
  };

  return (
    <div ref={ref} className="max-w-md mx-auto">
      <div className="relative space-y-4">
        {roles.map((role, index) => {
          const Icon = role.icon;
          return (
            <div
              key={role.name}
              className={`relative transition-all duration-700 hover:scale-105 hover:z-10 ${
                isVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-10"
              }`}
              style={{
                transitionDelay: `${index * 100}ms`,
                opacity: isVisible ? role.opacity / 100 : 0,
                zIndex: roles.length - index,
              }}
            >
            <div
              className={`backdrop-blur-xl border rounded-xl p-6 shadow-lg transition-all ${colorMap[role.color]}`}
              style={getColorStyle(role.color)}
            >
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-lg" style={{ background: 'rgba(5,5,5,0.2)' }}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-lg font-semibold lowercase">
                      {role.name}
                    </h4>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
