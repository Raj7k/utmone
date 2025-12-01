import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

interface ProductCTASectionProps {
  title: string;
  description: string;
}

export const ProductCTASection = ({ title, description }: ProductCTASectionProps) => {
  return (
    <section className="py-24 md:py-32 bg-background">
      <div className="container px-6 mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto space-y-6"
        >
          <h2 className="text-4xl md:text-5xl font-display font-bold brand-lowercase">
            {title}
          </h2>
          <p className="text-xl text-muted-foreground">
            {description}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Link to="/auth">
              <Button size="lg" variant="marketing">
                start free trial
              </Button>
            </Link>
            <Link to="/demo">
              <Button size="lg" variant="outline">
                book a demo
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
