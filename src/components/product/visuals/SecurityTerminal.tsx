import { motion } from "framer-motion";
import { useState, useEffect } from "react";

interface LogEntry {
  id: number;
  timestamp: string;
  type: "access" | "audit" | "security";
  message: string;
}

export const SecurityTerminal = () => {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [logId, setLogId] = useState(0);

  const logTemplates = [
    { type: "access" as const, message: "[ACCESS GRANTED] User: Admin via YubiKey 5..." },
    { type: "audit" as const, message: "[AUDIT] Link utm.one/q1 modified by sarah@..." },
    { type: "security" as const, message: "[SSO] Google Workspace login: dev@acme.co" },
    { type: "access" as const, message: "[ACCESS GRANTED] User: Marketing via SSO..." },
    { type: "audit" as const, message: "[AUDIT] UTM template created: q1-launch-..." },
    { type: "security" as const, message: "[MFA] Hardware key verified: YK5-NFC-..." },
    { type: "audit" as const, message: "[AUDIT] Workspace settings updated by admin..." },
    { type: "access" as const, message: "[ACCESS DENIED] Invalid key: attempt from 192..." },
    { type: "security" as const, message: "[SSO] SAML assertion validated for okta.com" },
    { type: "audit" as const, message: "[AUDIT] Bulk export: 50 links by analytics@..." },
  ];

  // Generate timestamp
  const getTimestamp = () => {
    const now = new Date();
    return now.toISOString().slice(11, 19);
  };

  // Add new logs periodically
  useEffect(() => {
    const interval = setInterval(() => {
      const template = logTemplates[Math.floor(Math.random() * logTemplates.length)];
      const newLog: LogEntry = {
        id: logId,
        timestamp: getTimestamp(),
        type: template.type,
        message: template.message,
      };
      
      setLogs(prev => {
        const updated = [newLog, ...prev];
        return updated.slice(0, 8); // Keep only last 8 logs
      });
      setLogId(prev => prev + 1);
    }, 2000);

    // Initial logs
    for (let i = 0; i < 5; i++) {
      const template = logTemplates[i];
      setLogs(prev => [...prev, {
        id: i,
        timestamp: getTimestamp(),
        type: template.type,
        message: template.message,
      }]);
    }

    return () => clearInterval(interval);
  }, []);

  const getLogColorClass = (type: LogEntry["type"]) => {
    switch (type) {
      case "access": return "text-green-400/80";
      case "audit": return "text-amber-400/80";
      case "security": return "text-blue-400/80";
    }
  };

  return (
    <div className="relative w-[380px] h-[200px]">
      {/* Terminal window */}
      <div className="w-full h-full rounded-xl overflow-hidden bg-black/60 border border-white/10 shadow-[inset_0_0_30px_rgba(0,0,0,0.5)]">
        {/* Header */}
        <div className="flex items-center gap-2 px-4 py-2 bg-white/[0.03] border-b border-white/5">
          <div className="w-2 h-2 rounded-full bg-red-500/60" />
          <div className="w-2 h-2 rounded-full bg-yellow-500/60" />
          <div className="w-2 h-2 rounded-full bg-green-500/60" />
          <span className="text-[10px] uppercase tracking-wider ml-2 text-white/30">
            audit log — live
          </span>
          <motion.div 
            className="w-1.5 h-1.5 rounded-full bg-green-500 ml-auto"
            animate={{ opacity: [1, 0.3, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
        </div>

        {/* Log entries */}
        <div className="p-3 space-y-1 overflow-hidden">
          {logs.map((log, index) => (
            <motion.div
              key={log.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1 - index * 0.1, x: 0 }}
              className="font-mono text-[11px] flex gap-2 whitespace-nowrap overflow-hidden"
            >
              <span className="text-white/30">
                {log.timestamp}
              </span>
              <span className={getLogColorClass(log.type)}>
                {log.message}
              </span>
            </motion.div>
          ))}
        </div>

        {/* Scanline effect */}
        <motion.div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'repeating-linear-gradient(0deg, transparent 0px, transparent 2px, rgba(255,255,255,0.01) 2px, rgba(255,255,255,0.01) 4px)',
          }}
        />
      </div>
    </div>
  );
};