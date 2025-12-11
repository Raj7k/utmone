import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TrendingUp, GitBranch, AlertTriangle, MessageSquare } from "lucide-react";
import { PredictiveWaveform } from "./visuals/PredictiveWaveform";
import { AnomalyRadar } from "./visuals/AnomalyRadar";
import { AICommandCenterPreview } from "@/components/features/AICommandCenterPreview";
import { NeuralMesh } from "@/components/product/visuals/NeuralMesh";

interface Tab {
  id: string;
  label: string;
  icon: React.ReactNode;
  headline: string;
  subheadline: string;
  component: React.ReactNode;
}

const tabs: Tab[] = [
  {
    id: "predictive",
    label: "predictive",
    icon: <TrendingUp className="w-4 h-4" />,
    headline: "see tomorrow's results today.",
    subheadline: "AI forecasts campaign performance before you spend another dollar.",
    component: <PredictiveWaveform />,
  },
  {
    id: "attribution",
    label: "attribution",
    icon: <GitBranch className="w-4 h-4" />,
    headline: "every dollar traced to its source.",
    subheadline: "Multi-touch attribution that actually makes sense.",
    component: <NeuralMesh />,
  },
  {
    id: "anomaly",
    label: "anomaly",
    icon: <AlertTriangle className="w-4 h-4" />,
    headline: "catch issues before they cost you.",
    subheadline: "Real-time monitoring detects traffic spikes and drops instantly.",
    component: <AnomalyRadar />,
  },
  {
    id: "insights",
    label: "insights",
    icon: <MessageSquare className="w-4 h-4" />,
    headline: "ask questions. get answers.",
    subheadline: "Natural language queries for instant campaign intelligence.",
    component: <AICommandCenterPreview />,
  },
];

export const AIControlDeck = () => {
  const [activeTab, setActiveTab] = useState(tabs[0].id);
  const activeTabData = tabs.find(t => t.id === activeTab) || tabs[0];

  return (
    <div className="w-full max-w-6xl mx-auto">
      {/* Control Deck Container */}
      <motion.div
        className="relative rounded-[32px] border border-border bg-card/20 backdrop-blur-xl overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        style={{
          boxShadow: `
            inset 0 1px 0 0 rgba(255,255,255,0.05),
            0 0 80px rgba(255,255,255,0.03)
          `,
        }}
      >
        {/* Scanline overlay */}
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.02]"
          style={{
            backgroundImage: `repeating-linear-gradient(
              0deg,
              transparent,
              transparent 2px,
              rgba(255,255,255,0.03) 2px,
              rgba(255,255,255,0.03) 4px
            )`,
          }}
        />

        <div className="flex flex-col lg:flex-row min-h-[500px]">
          {/* Left Navigation Rail */}
          <div className="lg:w-48 p-4 lg:p-6 flex lg:flex-col gap-2 lg:border-r border-border overflow-x-auto lg:overflow-visible">
            <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-2 hidden lg:block">
              ai layers
            </div>
            {tabs.map((tab) => (
              <motion.button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium transition-all whitespace-nowrap ${
                  activeTab === tab.id
                    ? "bg-foreground text-background"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/20"
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                style={
                  activeTab === tab.id
                    ? {
                        boxShadow: "0 0 20px rgba(255,255,255,0.3)",
                      }
                    : {}
                }
              >
                {tab.icon}
                <span>{tab.label}</span>
              </motion.button>
            ))}
          </div>

          {/* Right Content Area */}
          <div className="flex-1 p-6 lg:p-10 flex flex-col">
            {/* Headlines */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="mb-8"
              >
                <h2 className="text-3xl lg:text-4xl font-display font-bold text-foreground mb-3">
                  {activeTabData.headline}
                </h2>
                <p className="text-lg text-muted-foreground max-w-xl">
                  {activeTabData.subheadline}
                </p>
              </motion.div>
            </AnimatePresence>

            {/* Visual Component */}
            <div className="flex-1 relative">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.4 }}
                  className="absolute inset-0"
                >
                  {activeTabData.component}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Bottom indicator dots */}
      <div className="flex justify-center gap-2 mt-6">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`w-2 h-2 rounded-full transition-all ${
              activeTab === tab.id
                ? "bg-foreground w-6"
                : "bg-muted-foreground/30 hover:bg-muted-foreground/50"
            }`}
          />
        ))}
      </div>
    </div>
  );
};
