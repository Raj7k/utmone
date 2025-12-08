import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { LucideIcon } from "lucide-react";
import { useState } from "react";

interface InteractiveWorkflowCardProps {
  icon: LucideIcon;
  label: string;
  stepNumber: string;
  delay?: number;
}

export const InteractiveWorkflowCard = ({ icon: Icon, label, stepNumber, delay = 0 }: InteractiveWorkflowCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 300, damping: 30 });
  const mouseYSpring = useSpring(y, { stiffness: 300, damping: 30 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["7.5deg", "-7.5deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-7.5deg", "7.5deg"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
    setIsHovered(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 40, scale: 0.9 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.7, delay, ease: [0.25, 0.1, 0.25, 1] }}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      className="relative group cursor-pointer"
    >
      {/* Glassmorphism Card */}
      <div className="relative p-6 sm:p-8 md:p-10 rounded-2xl md:rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10 overflow-hidden transition-all duration-500">
        {/* Glow Effect */}
        <motion.div
          className="absolute inset-0 opacity-0 transition-opacity duration-500"
          style={{ background: 'rgba(255,255,255,0.1)' }}
          animate={{ opacity: isHovered ? 1 : 0 }}
        />
        
        {/* Step Number Watermark */}
        <div className="absolute top-2 right-2 md:top-4 md:right-4 text-[60px] sm:text-[80px] md:text-[120px] font-display font-bold text-white/5 leading-none pointer-events-none select-none">
          {stepNumber}
        </div>

        {/* Content */}
        <div className="relative z-10 flex flex-col items-center text-center space-y-3 md:space-y-4">
          {/* Icon with animated background */}
          <motion.div
            className="w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-xl md:rounded-2xl bg-gradient-to-br from-blazeOrange/20 to-deepSea/20 flex items-center justify-center"
            animate={{
              scale: isHovered ? 1.1 : 1,
              rotate: isHovered ? 5 : 0,
            }}
            transition={{ duration: 0.3 }}
          >
            <Icon className="w-7 h-7 sm:w-8 sm:h-8 md:w-10 md:h-10 text-white" strokeWidth={2} />
          </motion.div>

          {/* Label */}
          <h3 className="text-lg sm:text-xl md:text-2xl font-display font-semibold text-white">
            {label}
          </h3>
        </div>

        {/* Grid Pattern Overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none" />
      </div>

      {/* Subtle shadow for depth */}
      <motion.div
        className="absolute inset-0 -z-10 rounded-2xl md:rounded-3xl bg-gradient-to-br from-blazeOrange/20 to-deepSea/20 blur-xl"
        animate={{
          opacity: isHovered ? 0.6 : 0,
          scale: isHovered ? 1.05 : 1,
        }}
        transition={{ duration: 0.3 }}
      />
    </motion.div>
  );
};