import { Link2, QrCode, BarChart3, Globe, Shield, Zap } from "lucide-react";

export const FeatureFloatingIcons = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Link icon - top left */}
      <div
        className="absolute top-20 left-[8%] text-blazeOrange/8 animate-float-icon-1"
      >
        <Link2 className="w-12 h-12 md:w-16 md:h-16" />
      </div>

      {/* QR Code icon - top right */}
      <div
        className="absolute top-32 right-[12%] text-electricBlue/8 animate-float-icon-2"
        style={{ animationDelay: '1s' }}
      >
        <QrCode className="w-10 h-10 md:w-14 md:h-14" />
      </div>

      {/* BarChart icon - middle left */}
      <div
        className="absolute top-[45%] left-[5%] text-electricBlue/6 animate-float-icon-3"
        style={{ animationDelay: '0.5s' }}
      >
        <BarChart3 className="w-8 h-8 md:w-12 md:h-12" />
      </div>

      {/* Globe icon - middle right */}
      <div
        className="absolute top-[38%] right-[8%] text-blazeOrange/7 animate-float-icon-4"
        style={{ animationDelay: '2s' }}
      >
        <Globe className="w-11 h-11 md:w-15 md:h-15" />
      </div>

      {/* Shield icon - bottom left */}
      <div
        className="absolute bottom-[15%] left-[15%] text-electricBlue/7 animate-float-icon-5"
        style={{ animationDelay: '1.5s' }}
      >
        <Shield className="w-9 h-9 md:w-13 md:h-13" />
      </div>

      {/* Zap icon - bottom right */}
      <div
        className="absolute bottom-[20%] right-[18%] text-blazeOrange/9 animate-float-icon-6"
        style={{ animationDelay: '0.8s' }}
      >
        <Zap className="w-10 h-10 md:w-14 md:h-14" />
      </div>
    </div>
  );
};
