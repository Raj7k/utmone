import { motion } from "framer-motion";
import { RetroGradientMesh } from "./RetroGradientMesh";

export const BrandStatement3D = () => {
  return (
    <section className="relative w-full overflow-hidden">
      <RetroGradientMesh />
      
      <div className="relative z-10 container mx-auto px-6 py-32 md:py-48">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center"
        >
          <h2 
            className="font-display font-bold text-7xl md:text-8xl lg:text-[10rem] hero-gradient"
          >
            utm.one
          </h2>
        </motion.div>
      </div>
    </section>
  );
};
