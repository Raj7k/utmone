import { Map, Activity, FileText, Github } from "lucide-react";
import { Link } from "react-router-dom";

const links = [
  { icon: Map, label: "Public Roadmap", href: "/roadmap" },
  { icon: Activity, label: "Status Page", href: "/status" },
  { icon: FileText, label: "Changelog", href: "/changelog" },
  { icon: Github, label: "Open Source SDK", href: "https://github.com/utm-one", external: true },
];

export const TransparencyStrip = () => {
  return (
    <section className="w-full py-12 px-4">
      <div className="max-w-4xl mx-auto text-center">
        <p className="text-sm text-muted-foreground mb-6">
          see what we're building. no hidden agendas.
        </p>
        <div className="flex flex-wrap justify-center items-center gap-3 md:gap-6">
          {links.map((link, index) => {
            const content = (
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-card/40 backdrop-blur-xl border border-border/50 hover:border-border hover:bg-card/60 transition-all cursor-pointer">
                <link.icon className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  {link.label}
                </span>
              </div>
            );

            if (link.external) {
              return (
                <a
                  key={index}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {content}
                </a>
              );
            }

            return (
              <Link key={index} to={link.href}>
                {content}
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
};
