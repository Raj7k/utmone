import { motion } from "framer-motion";

// Animated traffic forecasting with historical + prediction + confidence interval
export const ForecastMini = () => {
  const historicalPath = "M10,45 L25,40 L40,42 L55,35 L70,30";
  const predictionPath = "M70,30 L85,25 L100,18 L110,12";
  
  return (
    <svg viewBox="0 0 120 60" className="w-full h-full">
      <defs>
        <linearGradient id="forecastGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="rgba(255,255,255,0.5)" />
          <stop offset="100%" stopColor="rgba(255,255,255,0.8)" />
        </linearGradient>
        <linearGradient id="confidenceGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="rgba(255,255,255,0.15)" />
          <stop offset="50%" stopColor="rgba(255,255,255,0.05)" />
          <stop offset="100%" stopColor="rgba(255,255,255,0.15)" />
        </linearGradient>
      </defs>

      {/* Grid lines */}
      {[20, 35, 50].map((y) => (
        <line
          key={y}
          x1="10"
          y1={y}
          x2="110"
          y2={y}
          stroke="rgba(255,255,255,0.05)"
          strokeWidth="0.5"
        />
      ))}

      {/* Confidence interval band (prediction zone) */}
      <motion.path
        d="M70,35 Q85,33 100,28 L110,22 L110,5 L100,10 Q85,18 70,25 Z"
        fill="url(#confidenceGradient)"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.5 }}
      />

      {/* Historical data line (solid) */}
      <motion.path
        d={historicalPath}
        fill="none"
        stroke="url(#forecastGradient)"
        strokeWidth="2"
        strokeLinecap="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      />

      {/* Prediction line (dashed) */}
      <motion.path
        d={predictionPath}
        fill="none"
        stroke="rgba(255,255,255,0.6)"
        strokeWidth="2"
        strokeDasharray="4 3"
        strokeLinecap="round"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ delay: 0.8, duration: 0.6, ease: "easeOut" }}
      />

      {/* Transition point marker */}
      <motion.circle
        cx="70"
        cy="30"
        r="4"
        fill="white"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.7, type: "spring", stiffness: 300 }}
      />

      {/* Historical/Prediction label line */}
      <motion.line
        x1="70"
        y1="10"
        x2="70"
        y2="55"
        stroke="rgba(255,255,255,0.1)"
        strokeWidth="1"
        strokeDasharray="2 2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
      />

      {/* Labels */}
      <motion.text
        x="40"
        y="55"
        fill="rgba(255,255,255,0.3)"
        fontSize="5"
        textAnchor="middle"
        fontFamily="ui-monospace"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.9 }}
      >
        historical
      </motion.text>
      <motion.text
        x="90"
        y="55"
        fill="rgba(255,255,255,0.3)"
        fontSize="5"
        textAnchor="middle"
        fontFamily="ui-monospace"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.1 }}
      >
        forecast
      </motion.text>

      {/* Animated traveling dot on prediction */}
      <motion.circle
        r="2"
        fill="white"
        initial={{ offsetDistance: "0%", opacity: 0 }}
        animate={{ offsetDistance: "100%", opacity: [0, 1, 1, 0.5] }}
        transition={{
          duration: 2,
          delay: 1.3,
          repeat: Infinity,
          repeatDelay: 1.5,
          ease: "linear"
        }}
        style={{
          offsetPath: `path("${predictionPath}")`,
        }}
      />
    </svg>
  );
};
