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
    primary: "border-white/20",
    accent: "border-accent/30",
    secondary: "border-secondary/30",
    muted: "border-muted/30",
  };

  const getColorClasses = (color: "primary" | "accent" | "secondary" | "muted") => {
    const classes = {
      primary: "bg-white/15 text-white-90",
      accent: "bg-white/10 text-white-90",
      secondary: "bg-white/8 text-white-80",
      muted: "bg-white/5 text-white-50",
    };
    return classes[color];
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
              className={`backdrop-blur-xl border rounded-xl p-6 shadow-lg transition-all ${colorMap[role.color]} ${getColorClasses(role.color)}`}
            >
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-lg bg-obsidian/20">
                    <Icon className="h-6 w-6" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-lg font-semibold">
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
