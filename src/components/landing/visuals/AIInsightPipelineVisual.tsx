import { motion } from "framer-motion";

// AI Intelligence: 4-layer processing pipeline showing actual product features
export const AIInsightPipelineVisual = () => {
  const inputNodes = [
    { y: 10, label: "Metrics", icon: "📊" },
    { y: 28, label: "Links", icon: "🔗" },
    { y: 46, label: "Users", icon: "👥" },
  ];

  const processingLayers = [
    { x: 45, label: "Predict", color: "#8B5CF6" },
    { x: 70, label: "Attribute", color: "#EC4899" },
  ];

  return (
    <svg viewBox="0 0 120 60" className="w-full h-full">
      <defs>
        <linearGradient id="aiFlowGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.6" />
          <stop offset="50%" stopColor="#8B5CF6" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#EC4899" stopOpacity="0.3" />
        </linearGradient>
        <linearGradient id="insightGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#10B981" />
          <stop offset="100%" stopColor="#06B6D4" />
        </linearGradient>
        <filter id="aiGlow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="1.5" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Input layer */}
      {inputNodes.map((node, i) => (
        <motion.g key={i}>
          <motion.rect
            x="6"
            y={node.y}
            width="20"
            height="10"
            rx="2"
            fill="#3B82F6"
            fillOpacity="0.15"
            stroke="#3B82F6"
            strokeWidth="0.5"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.4, delay: i * 0.1 }}
          />
          <motion.text
            x="11"
            y={node.y + 7}
            fontSize="5"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 + i * 0.1 }}
          >
            {node.icon}
          </motion.text>
          <motion.text
            x="20"
            y={node.y + 6.5}
            fill="white"
            fontSize="2.5"
            fontFamily="ui-sans-serif"
            fillOpacity="0.6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 + i * 0.1 }}
          >
            {node.label}
          </motion.text>
        </motion.g>
      ))}

      {/* Flow paths: Inputs → First processing layer */}
      {inputNodes.map((node, i) => (
        <motion.path
          key={`flow1-${i}`}
          d={`M 26 ${node.y + 5} Q 35 ${node.y + 5}, 42 30`}
          fill="none"
          stroke="url(#aiFlowGradient)"
          strokeWidth="1"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 0.7 }}
          transition={{ duration: 0.5, delay: 0.3 + i * 0.1 }}
        />
      ))}

      {/* Processing layers */}
      {processingLayers.map((layer, i) => (
        <motion.g key={i}>
          <motion.rect
            x={layer.x}
            y="20"
            width="18"
            height="20"
            rx="3"
            fill={layer.color}
            fillOpacity="0.2"
            stroke={layer.color}
            strokeWidth="0.8"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.5 + i * 0.15 }}
          />
          
          {/* Processing animation inside */}
          <motion.circle
            cx={layer.x + 9}
            cy="30"
            r="4"
            fill={layer.color}
            fillOpacity="0.4"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.4, 0.7, 0.4],
            }}
            transition={{
              duration: 1.5,
              delay: 0.7 + i * 0.2,
              repeat: Infinity,
            }}
          />
          
          <motion.text
            x={layer.x + 9}
            y="43"
            fill="white"
            fontSize="2.5"
            textAnchor="middle"
            fontFamily="ui-sans-serif"
            fillOpacity="0.8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 + i * 0.15 }}
          >
            {layer.label}
          </motion.text>
        </motion.g>
      ))}

      {/* Flow between processing layers */}
      <motion.path
        d="M 63 30 L 70 30"
        fill="none"
        stroke="#8B5CF6"
        strokeWidth="1.5"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.3, delay: 0.7 }}
      />

      {/* Flow to output */}
      <motion.path
        d="M 88 30 Q 95 30, 100 30"
        fill="none"
        stroke="url(#insightGradient)"
        strokeWidth="2"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.4, delay: 0.9 }}
      />

      {/* Output: Insight/Recommendation */}
      <motion.g
        initial={{ opacity: 0, x: 5 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 1 }}
      >
        <rect x="100" y="18" width="16" height="24" rx="2" fill="url(#insightGradient)" fillOpacity="0.2" stroke="#10B981" strokeWidth="0.8" />
        
        {/* Lightbulb icon */}
        <motion.text
          x="108"
          y="28"
          fontSize="8"
          textAnchor="middle"
          animate={{ 
            opacity: [0.6, 1, 0.6],
          }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          💡
        </motion.text>
        
        <text x="108" y="38" fill="white" fontSize="2.5" textAnchor="middle" fontFamily="ui-sans-serif" fillOpacity="0.8">Insight</text>
      </motion.g>

      {/* Animated data pulses flowing through pipeline */}
      {[0, 1, 2].map((i) => (
        <motion.circle
          key={`pulse-${i}`}
          r="1.5"
          fill="#8B5CF6"
          filter="url(#aiGlow)"
          initial={{ offsetDistance: "0%", opacity: 0 }}
          animate={{
            offsetDistance: ["0%", "100%"],
            opacity: [0, 1, 1, 0],
          }}
          transition={{
            duration: 2,
            delay: 0.5 + i * 0.7,
            repeat: Infinity,
            repeatDelay: 1,
            ease: "linear",
          }}
          style={{
            offsetPath: `path("M 26 ${inputNodes[i].y + 5} Q 35 ${inputNodes[i].y + 5}, 42 30 L 63 30 L 70 30 L 88 30 L 100 30")`,
          }}
        />
      ))}

      {/* Labels */}
      <motion.g
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
      >
        <text x="16" y="4" fill="white" fontSize="2.5" fontFamily="ui-monospace" fillOpacity="0.4">input</text>
        <text x="60" y="4" fill="#8B5CF6" fontSize="2.5" fontFamily="ui-monospace" fillOpacity="0.6">processing</text>
        <text x="104" y="4" fill="#10B981" fontSize="2.5" fontFamily="ui-monospace" fillOpacity="0.6">output</text>
      </motion.g>

      {/* Stats */}
      <motion.text
        x="60"
        y="56"
        fill="white"
        fontSize="3"
        textAnchor="middle"
        fontFamily="ui-monospace"
        fillOpacity="0.5"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.3 }}
      >
        Clean Track Intelligence™
      </motion.text>
    </svg>
  );
};
