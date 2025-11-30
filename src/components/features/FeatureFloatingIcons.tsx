import { motion } from "framer-motion";
import { Link2, QrCode, BarChart3, Globe, Shield, Zap } from "lucide-react";

export const FeatureFloatingIcons = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Link icon - top left */}
      <motion.div
        className="absolute top-20 left-[8%] text-blazeOrange/8"
        animate={{ 
          y: [0, -15, 0],
          rotate: [0, 8, 0]
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        <Link2 className="w-12 h-12 md:w-16 md:h-16" />
      </motion.div>

      {/* QR Code icon - top right */}
      <motion.div
        className="absolute top-32 right-[12%] text-electricBlue/8"
        animate={{ 
          y: [0, -12, 0],
          rotate: [0, -6, 0]
        }}
        transition={{
          duration: 9,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1
        }}
      >
        <QrCode className="w-10 h-10 md:w-14 md:h-14" />
      </motion.div>

      {/* BarChart icon - middle left */}
      <motion.div
        className="absolute top-[45%] left-[5%] text-electricBlue/6"
        animate={{ 
          y: [0, -10, 0],
          x: [0, 8, 0]
        }}
        transition={{
          duration: 7,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 0.5
        }}
      >
        <BarChart3 className="w-8 h-8 md:w-12 md:h-12" />
      </motion.div>

      {/* Globe icon - middle right */}
      <motion.div
        className="absolute top-[38%] right-[8%] text-blazeOrange/7"
        animate={{ 
          y: [0, -18, 0],
          rotate: [0, 10, 0]
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2
        }}
      >
        <Globe className="w-11 h-11 md:w-15 md:h-15" />
      </motion.div>

      {/* Shield icon - bottom left */}
      <motion.div
        className="absolute bottom-[15%] left-[15%] text-electricBlue/7"
        animate={{ 
          y: [0, -14, 0],
          scale: [1, 1.05, 1]
        }}
        transition={{
          duration: 8.5,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1.5
        }}
      >
        <Shield className="w-9 h-9 md:w-13 md:h-13" />
      </motion.div>

      {/* Zap icon - bottom right */}
      <motion.div
        className="absolute bottom-[20%] right-[18%] text-blazeOrange/9"
        animate={{ 
          y: [0, -16, 0],
          rotate: [0, -8, 0]
        }}
        transition={{
          duration: 7.5,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 0.8
        }}
      >
        <Zap className="w-10 h-10 md:w-14 md:h-14" />
      </motion.div>
    </div>
  );
};
