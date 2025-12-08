import { motion } from "framer-motion";
import { Sparkles, Send } from "lucide-react";

export const AICommandCenterPreview = () => {
  const messages = [
    {
      type: "user",
      text: "Which campaign had the best ROI last quarter?",
    },
    {
      type: "ai",
      text: "Your Q3 LinkedIn Webinar Series generated $89K revenue from $12K spend — a 7.4x ROI. This outperformed Google Ads (3.2x) and Email (4.1x).",
      insights: [
        { label: "LinkedIn Webinar", value: "7.4x ROI", highlight: true },
        { label: "Email Nurture", value: "4.1x ROI" },
        { label: "Google Ads", value: "3.2x ROI" },
      ],
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="rounded-2xl p-6 shadow-xl bg-zinc-900/40 border-2 border-white/10"
    >
      {/* Header */}
      <div className="flex items-center gap-3 mb-6 pb-4 border-b border-white/10">
        <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
          <Sparkles className="w-5 h-5 text-white/80" />
        </div>
        <div>
          <h3 className="text-lg font-display font-bold text-foreground lowercase">
            ai command center
          </h3>
          <p className="text-xs text-white/50">ask anything about your data</p>
        </div>
        <div className="ml-auto flex items-center gap-2 px-2 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/30">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-[10px] font-medium text-emerald-400">online</span>
        </div>
      </div>

      {/* Chat Messages */}
      <div className="space-y-4 mb-6">
        {/* User Message */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="flex justify-end"
        >
          <div className="max-w-[85%] px-4 py-3 rounded-2xl rounded-br-md bg-white/10 border border-white/15">
            <p className="text-sm text-white/90">{messages[0].text}</p>
          </div>
        </motion.div>

        {/* AI Response */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6 }}
          className="flex justify-start"
        >
          <div className="max-w-[90%]">
            <div className="px-4 py-3 rounded-2xl rounded-bl-md bg-white/5 border border-white/10 mb-3">
              <p className="text-sm text-white/80 leading-relaxed">{messages[1].text}</p>
            </div>
            
            {/* Insight Cards */}
            <div className="flex gap-2 flex-wrap">
              {messages[1].insights?.map((insight, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.8 + i * 0.1 }}
                  className={`px-3 py-2 rounded-lg border ${
                    insight.highlight
                      ? "bg-white/15 border-white/30"
                      : "bg-white/5 border-white/10"
                  }`}
                >
                  <div className="text-[10px] text-white/50 mb-0.5">{insight.label}</div>
                  <div className={`text-sm font-bold ${insight.highlight ? "text-white" : "text-white/70"}`}>
                    {insight.value}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Input Bar */}
      <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/10">
        <input
          type="text"
          placeholder="Ask about your campaigns..."
          className="flex-1 bg-transparent text-sm text-white/80 placeholder:text-white/30 outline-none"
          disabled
        />
        <button className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors">
          <Send className="w-4 h-4 text-white/60" />
        </button>
      </div>

      {/* Suggested Questions */}
      <div className="mt-4 flex flex-wrap gap-2">
        {["Why did conversions drop?", "Best performing channel?", "Forecast next week"].map((q, i) => (
          <motion.span
            key={i}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 1.2 + i * 0.1 }}
            className="px-3 py-1.5 text-[11px] rounded-full bg-white/5 border border-white/10 text-white/50 cursor-pointer hover:bg-white/10 hover:text-white/70 transition-colors"
          >
            {q}
          </motion.span>
        ))}
      </div>
    </motion.div>
  );
};
