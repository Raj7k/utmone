import { motion } from "framer-motion";

// Mini attribution flow animation
export const AttributionFlowMini = () => (
  <div className="relative h-16 w-full overflow-hidden">
    <svg viewBox="0 0 200 60" className="w-full h-full">
      {/* Source nodes */}
      {[
        { x: 20, label: "LI", delay: 0 },
        { x: 50, label: "G", delay: 0.2 },
        { x: 80, label: "EM", delay: 0.4 },
      ].map((node, i) => (
        <g key={i}>
          <motion.circle
            cx={node.x}
            cy={15}
            r={8}
            fill="none"
            stroke="rgba(255,255,255,0.3)"
            strokeWidth={1}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: node.delay, duration: 0.3 }}
          />
          <motion.text
            x={node.x}
            y={18}
            textAnchor="middle"
            fill="rgba(255,255,255,0.5)"
            fontSize={6}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: node.delay + 0.2 }}
          >
            {node.label}
          </motion.text>
          {/* Flow line */}
          <motion.path
            d={`M${node.x},23 Q${node.x + 40},35 ${160},45`}
            fill="none"
            stroke="rgba(255,255,255,0.1)"
            strokeWidth={1}
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ delay: node.delay + 0.3, duration: 0.8 }}
          />
          {/* Animated particle */}
          <motion.circle
            r={2}
            fill="white"
            initial={{ opacity: 0 }}
            animate={{
              opacity: [0, 1, 1, 0],
              offsetDistance: ["0%", "100%"],
            }}
            transition={{
              duration: 2,
              delay: node.delay + 0.5,
              repeat: Infinity,
              repeatDelay: 1,
            }}
            style={{ offsetPath: `path('M${node.x},23 Q${node.x + 40},35 160,45')` }}
          />
        </g>
      ))}
      {/* Revenue node */}
      <motion.circle
        cx={170}
        cy={45}
        r={12}
        fill="none"
        stroke="rgba(255,255,255,0.4)"
        strokeWidth={1.5}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 1, duration: 0.3 }}
      />
      <motion.text
        x={170}
        y={48}
        textAnchor="middle"
        fill="white"
        fontSize={7}
        fontWeight="bold"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
      >
        $
      </motion.text>
    </svg>
  </div>
);

// Mini identity stitching animation
export const IdentityStitchMini = () => (
  <div className="relative h-16 w-full overflow-hidden">
    <svg viewBox="0 0 200 60" className="w-full h-full">
      {/* Anonymous nodes */}
      {[
        { x: 30, icon: "📱", delay: 0 },
        { x: 60, icon: "💻", delay: 0.2 },
        { x: 90, icon: "📧", delay: 0.4 },
      ].map((node, i) => (
        <g key={i}>
          <motion.circle
            cx={node.x}
            cy={30}
            r={12}
            fill="rgba(255,255,255,0.05)"
            stroke="rgba(255,255,255,0.2)"
            strokeWidth={1}
            strokeDasharray="3 2"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: node.delay, duration: 0.3 }}
          />
          <motion.text
            x={node.x}
            y={34}
            textAnchor="middle"
            fontSize={10}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: node.delay + 0.2 }}
          >
            {node.icon}
          </motion.text>
          {/* Stitching line */}
          <motion.line
            x1={node.x + 12}
            y1={30}
            x2={150}
            y2={30}
            stroke="rgba(255,255,255,0.15)"
            strokeWidth={1}
            strokeDasharray="4 4"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ delay: 0.8 + i * 0.1, duration: 0.5 }}
          />
        </g>
      ))}
      {/* Unified identity */}
      <motion.circle
        cx={165}
        cy={30}
        r={15}
        fill="rgba(255,255,255,0.1)"
        stroke="white"
        strokeWidth={2}
        initial={{ scale: 0 }}
        animate={{ scale: [0, 1.2, 1] }}
        transition={{ delay: 1.3, duration: 0.4 }}
      />
      <motion.text
        x={165}
        y={34}
        textAnchor="middle"
        fontSize={12}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
      >
        👤
      </motion.text>
      {/* <100ms badge */}
      <motion.g
        initial={{ opacity: 0, y: 5 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.7 }}
      >
        <rect x={140} y={48} width={50} height={12} rx={6} fill="rgba(34,197,94,0.2)" />
        <text x={165} y={57} textAnchor="middle" fill="rgb(34,197,94)" fontSize={7}>
          &lt;100ms
        </text>
      </motion.g>
    </svg>
  </div>
);

// Mini link creation animation
export const LinkCreateMini = () => (
  <div className="relative h-16 w-full overflow-hidden">
    <svg viewBox="0 0 200 60" className="w-full h-full">
      {/* Input URL */}
      <motion.g
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
      >
        <rect x={5} y={22} width={55} height={16} rx={3} fill="rgba(255,255,255,0.05)" stroke="rgba(255,255,255,0.2)" />
        <motion.text
          x={10}
          y={33}
          fill="rgba(255,255,255,0.4)"
          fontSize={6}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          long-url.com/page
        </motion.text>
      </motion.g>
      
      {/* Arrow */}
      <motion.path
        d="M65,30 L80,30 M75,25 L80,30 L75,35"
        fill="none"
        stroke="rgba(255,255,255,0.3)"
        strokeWidth={1.5}
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ delay: 0.5, duration: 0.3 }}
      />
      
      {/* Output trio */}
      {[
        { y: 10, label: "utm.one/abc", color: "rgba(255,255,255,0.6)", delay: 0.8 },
        { y: 28, label: "utm_source=...", color: "rgba(255,255,255,0.4)", delay: 1.0 },
        { y: 46, label: "📱 QR", color: "rgba(255,255,255,0.5)", delay: 1.2 },
      ].map((item, i) => (
        <motion.g
          key={i}
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: item.delay, duration: 0.3 }}
        >
          <rect x={90} y={item.y} width={60} height={14} rx={3} fill="rgba(255,255,255,0.05)" stroke="rgba(255,255,255,0.15)" />
          <text x={95} y={item.y + 10} fill={item.color} fontSize={6}>
            {item.label}
          </text>
        </motion.g>
      ))}
      
      {/* Checkmarks */}
      {[0, 1, 2].map((i) => (
        <motion.text
          key={i}
          x={155}
          y={18 + i * 18}
          fill="rgb(34,197,94)"
          fontSize={10}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1.4 + i * 0.15, type: "spring" }}
        >
          ✓
        </motion.text>
      ))}
      
      {/* Timer */}
      <motion.g
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.8 }}
      >
        <rect x={165} y={22} width={32} height={16} rx={8} fill="rgba(34,197,94,0.2)" />
        <text x={181} y={33} textAnchor="middle" fill="rgb(34,197,94)" fontSize={7} fontWeight="bold">
          &lt;5s
        </text>
      </motion.g>
    </svg>
  </div>
);

// Mini anomaly detection animation
export const AnomalyAlertMini = () => (
  <div className="relative h-16 w-full overflow-hidden">
    <svg viewBox="0 0 200 60" className="w-full h-full">
      {/* EKG line */}
      <motion.path
        d="M10,35 L40,35 L50,35 L60,15 L70,50 L80,35 L120,35 L130,35"
        fill="none"
        stroke="rgba(255,255,255,0.3)"
        strokeWidth={1.5}
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1.5 }}
      />
      
      {/* Anomaly spike highlight */}
      <motion.circle
        cx={65}
        cy={15}
        r={8}
        fill="none"
        stroke="rgb(239,68,68)"
        strokeWidth={1.5}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: [0, 1.5, 1], opacity: [0, 1, 1] }}
        transition={{ delay: 1.2, duration: 0.5 }}
      />
      <motion.circle
        cx={65}
        cy={15}
        r={12}
        fill="none"
        stroke="rgb(239,68,68)"
        strokeWidth={1}
        opacity={0.3}
        initial={{ scale: 0 }}
        animate={{ scale: [1, 1.5, 1] }}
        transition={{ delay: 1.4, duration: 1, repeat: Infinity }}
      />
      
      {/* Alert dispatch */}
      <motion.g
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 1.8 }}
      >
        <rect x={145} y={20} width={50} height={20} rx={4} fill="rgba(239,68,68,0.1)" stroke="rgba(239,68,68,0.3)" />
        <text x={170} y={33} textAnchor="middle" fill="rgb(239,68,68)" fontSize={8}>
          🔔 Alert
        </text>
      </motion.g>
    </svg>
  </div>
);

// Mini audit trail animation
export const AuditTrailMini = () => (
  <div className="relative h-16 w-full overflow-hidden">
    <svg viewBox="0 0 200 60" className="w-full h-full">
      {/* Log entries */}
      {[
        { y: 8, text: "user@team created link", delay: 0 },
        { y: 24, text: "admin approved link", delay: 0.3 },
        { y: 40, text: "link clicked 1,234×", delay: 0.6 },
      ].map((entry, i) => (
        <motion.g
          key={i}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: entry.delay, duration: 0.3 }}
        >
          <rect x={10} y={entry.y} width={140} height={14} rx={2} fill="rgba(255,255,255,0.03)" />
          <circle cx={20} cy={entry.y + 7} r={3} fill="rgba(34,197,94,0.5)" />
          <text x={28} y={entry.y + 10} fill="rgba(255,255,255,0.5)" fontSize={6} fontFamily="monospace">
            {entry.text}
          </text>
        </motion.g>
      ))}
      
      {/* Forever badge */}
      <motion.g
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1.2 }}
      >
        <rect x={160} y={22} width={35} height={16} rx={8} fill="rgba(255,255,255,0.1)" />
        <text x={177} y={33} textAnchor="middle" fill="rgba(255,255,255,0.6)" fontSize={7}>
          forever
        </text>
      </motion.g>
    </svg>
  </div>
);
