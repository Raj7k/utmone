import { motion } from "framer-motion";

interface VectorShapesProps {
  variant?: "curves" | "geometric" | "organic";
}

export const VectorShapes = ({ variant = "curves" }: VectorShapesProps) => {
  if (variant === "curves") {
    return (
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Curved shape 1 - Top right */}
        <motion.svg
          className="absolute -top-20 -right-20 w-[600px] h-[600px] opacity-[0.08]"
          viewBox="0 0 600 600"
          fill="none"
          animate={{
            rotate: [0, 5, 0],
            scale: [1, 1.05, 1],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <path
            d="M300 0C400 50 500 150 600 300C500 450 400 550 300 600C200 550 100 450 0 300C100 150 200 50 300 0Z"
            fill="white"
            opacity="0.6"
          />
        </motion.svg>

        {/* Curved shape 2 - Bottom left */}
        <motion.svg
          className="absolute -bottom-32 -left-32 w-[700px] h-[700px] opacity-[0.12]"
          viewBox="0 0 700 700"
          fill="none"
          animate={{
            rotate: [0, -8, 0],
            scale: [1, 1.08, 1],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2,
          }}
        >
          <path
            d="M350 100C500 120 600 200 650 350C600 500 500 580 350 600C200 580 100 500 50 350C100 200 200 120 350 100Z"
            fill="white"
            opacity="0.5"
          />
        </motion.svg>

        {/* Curved shape 3 - Center */}
        <motion.svg
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] opacity-[0.06]"
          viewBox="0 0 500 500"
          fill="none"
          animate={{
            rotate: [0, 10, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 5,
          }}
        >
          <ellipse cx="250" cy="250" rx="200" ry="180" fill="white" opacity="0.7" />
        </motion.svg>

        {/* Small accent curves */}
        <motion.svg
          className="absolute top-1/4 right-1/4 w-[300px] h-[300px] opacity-[0.1]"
          viewBox="0 0 300 300"
          fill="none"
          animate={{
            y: [0, -20, 0],
            rotate: [0, 15, 0],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <path
            d="M150 50C200 80 250 130 280 180C250 230 200 250 150 250C100 250 50 230 20 180C50 130 100 80 150 50Z"
            fill="white"
            opacity="0.8"
          />
        </motion.svg>
      </div>
    );
  }

  if (variant === "geometric") {
    return (
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Geometric shapes */}
        <motion.div
          className="absolute top-20 right-40 w-64 h-64 bg-white/10 rounded-3xl rotate-12"
          animate={{
            rotate: [12, 20, 12],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-32 left-32 w-80 h-80 bg-white/8 rounded-full"
          animate={{
            scale: [1, 1.15, 1],
            opacity: [0.08, 0.12, 0.08],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 3,
          }}
        />
      </div>
    );
  }

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Organic blob shapes */}
      <motion.svg
        className="absolute top-0 left-0 w-full h-full opacity-[0.08]"
        viewBox="0 0 1000 1000"
        fill="none"
        animate={{
          scale: [1, 1.05, 1],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <path
          d="M500 100C650 150 800 300 850 500C800 700 650 850 500 900C350 850 200 700 150 500C200 300 350 150 500 100Z"
          fill="white"
          opacity="0.6"
        />
      </motion.svg>
    </div>
  );
};
