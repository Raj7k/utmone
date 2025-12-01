import { motion } from "framer-motion";
import { ProductFeature } from "@/config/productContent";
import { cn } from "@/lib/utils";

interface ProductFeatureGridProps {
  features: ProductFeature[];
}

export const ProductFeatureGrid = ({ features }: ProductFeatureGridProps) => {
  return (
    <section className="py-24 md:py-32 bg-muted/20">
      <div className="container px-6 mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold mb-6 brand-lowercase">
            the "unreal" tech
          </h2>
        </motion.div>
        
        <div className="grid md:grid-cols-12 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 60, scale: 0.95 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ 
                duration: 0.6, 
                delay: index * 0.1,
                ease: [0.25, 0.1, 0.25, 1]
              }}
              whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
              className={cn(
                "p-8 rounded-2xl bg-card border border-border hover:border-primary/50 hover:shadow-lg transition-all duration-300",
                feature.span || "md:col-span-6"
              )}
            >
              <div className="mb-4">{feature.icon}</div>
              <h3 className="text-2xl font-display font-bold mb-3 brand-lowercase">
                {feature.title}
              </h3>
              <p className="text-muted-foreground mb-4 text-lg italic">
                "{feature.tagline}"
              </p>
              <p className="text-foreground/70">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
