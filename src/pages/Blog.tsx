import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, BookOpen } from "lucide-react";
import { MainLayout } from "@/components/layout/MainLayout";
import { SEO } from "@/components/seo/SEO";

const Blog = () => {
  return (
    <MainLayout>
      <SEO 
        title="Blog - utm.one"
        description="Insights, updates, and best practices for link management and campaign tracking"
        canonical="https://utm.one/blog"
      />
      
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="max-w-2xl mx-auto px-6 text-center space-y-6">
          <div className="inline-flex p-4 rounded-2xl bg-white/10">
            <BookOpen className="h-12 w-12 text-white/80" />
          </div>
          
          <h1 className="text-4xl md:text-5xl font-display font-bold hero-gradient">
            blog coming soon
          </h1>
          
          <p className="text-lg max-w-xl mx-auto text-white/60">
            we're working on bringing you insights, tutorials, and best practices for link management and campaign tracking.
          </p>
          
          <div className="flex items-center justify-center gap-4 pt-4">
            <Link to="/resources">
              <Button variant="marketing">
                explore resources
              </Button>
            </Link>
            <Link to="/">
              <Button variant="outline">
                <ArrowLeft className="h-4 w-4 mr-2" />
                back home
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Blog;
