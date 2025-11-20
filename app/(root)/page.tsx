import Navigation from "@/components/layout/navigation";
import HeroSection from "@/components/section/hero-section";

import CTASection from "@/components/section/cta-section";
import Footer from "@/components/layout/footer";
import TestimonialsSection from "@/components/section/testimonial-section";
import FeaturesSection from "@/components/section/feature-section";

export default function Home() {
  return (
    <div className="min-h-screen bg-linear-to-br from-background via-blue-50/30 to-purple-50/20 dark:from-background dark:via-blue-950/10 dark:to-purple-950/10">
      <Navigation />
      <HeroSection />
      <FeaturesSection />
      <TestimonialsSection />
      <CTASection />
      <Footer />
    </div>
  );
}