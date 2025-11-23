import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { motion } from "framer-motion";
import { PDFDownloadSection } from "./PDFDownloadSection";

export const PDFDownloadCTA = () => {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <motion.div 
        className="fixed bottom-8 right-8 z-30"
        initial={{ opacity: 0, scale: 0.8, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 1 }}
      >
        <Button
          size="lg"
          onClick={() => setShowModal(true)}
          className="bg-gradient-to-r from-blazeOrange to-deepSea text-white shadow-2xl hover:shadow-3xl hover:scale-105 transition-all duration-200"
        >
          <Download className="mr-2 h-5 w-5" />
          Download Full Report
        </Button>
      </motion.div>

      {showModal && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto"
          onClick={() => setShowModal(false)}
        >
          <div 
            className="relative max-w-4xl w-full my-8"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowModal(false)}
              className="absolute -top-12 right-0 text-white hover:text-white/80 text-lg font-medium"
            >
              Close ✕
            </button>
            <div className="bg-white rounded-2xl shadow-2xl">
              <PDFDownloadSection />
            </div>
          </div>
        </div>
      )}
    </>
  );
};
