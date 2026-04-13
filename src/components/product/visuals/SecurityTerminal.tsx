import { useState, useEffect, useRef } from "react";

interface LogEntry {
  id: number;
  timestamp: string;
  type: "access" | "audit" | "security";
  message: string;
}

/**
 * SecurityTerminal - Terminal-style security log visualization
 * Uses CSS animations for log entry transitions - no framer-motion
 * Keeps minimal JS for log content rotation (necessary for dynamic text)
 */
export const SecurityTerminal = () => {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const logIdRef = useRef(0);

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

  const getTimestamp = () => {
    const now = new Date();
    return now.toISOString().slice(11, 19);
  };

  // Initialize with logs and add new ones periodically
  useEffect(() => {
    // Initial logs
    const initialLogs: LogEntry[] = [];
    for (let i = 0; i < 5; i++) {
      initialLogs.push({
        id: logIdRef.current++,
        timestamp: getTimestamp(),
        type: logTemplates[i].type,
        message: logTemplates[i].message,
      });
    }
    setLogs(initialLogs);

    // Add new logs periodically
    const interval = setInterval(() => {
      const template = logTemplates[Math.floor(Math.random() * logTemplates.length)];
      const newLog: LogEntry = {
        id: logIdRef.current++,
        timestamp: getTimestamp(),
        type: template.type,
        message: template.message,
      };
      
      setLogs(prev => [newLog, ...prev].slice(0, 8));
    }, 2000);

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
      <div className="w-full h-full rounded-xl overflow-hidden bg-black/60 border border-white/10 shadow-[inset_0_0_30px_hsl(0_0%_0%_/_0.5)]">
        {/* Header */}
        <div className="flex items-center gap-2 px-4 py-2 bg-white/[0.03] border-b border-white/5">
          <div className="w-2 h-2 rounded-full bg-red-500/60" />
          <div className="w-2 h-2 rounded-full bg-yellow-500/60" />
          <div className="w-2 h-2 rounded-full bg-green-500/60" />
          <span className="text-[10px] uppercase tracking-wider ml-2 text-white/30">
            audit log — live
          </span>
          {/* Blinking indicator - pure CSS */}
          <div className="w-1.5 h-1.5 rounded-full bg-green-500 ml-auto animate-pulse" />
        </div>

        {/* Log entries */}
        <div className="p-3 space-y-1 overflow-hidden">
          {logs.map((log, index) => (
            <div
              key={log.id}
              className="font-mono text-[11px] flex gap-2 whitespace-nowrap overflow-hidden animate-slide-in-log"
              style={{ 
                opacity: 1 - index * 0.1,
                animationDelay: index === 0 ? '0s' : undefined,
              }}
            >
              <span className="text-white/30">
                {log.timestamp}
              </span>
              <span className={getLogColorClass(log.type)}>
                {log.message}
              </span>
            </div>
          ))}
        </div>

        {/* Scanline effect - pure CSS */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'repeating-linear-gradient(0deg, transparent 0px, transparent 2px, hsl(0 0% 100% / 0.01) 2px, hsl(0 0% 100% / 0.01) 4px)',
          }}
        />
      </div>

      {/* Component-specific animation */}
      <style>{`
        @keyframes slideInLog {
          from {
            opacity: 0;
            transform: translateX(-10px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        .animate-slide-in-log {
          animation: slideInLog 0.2s ease-out forwards;
        }
      `}</style>
    </div>
  );
};
