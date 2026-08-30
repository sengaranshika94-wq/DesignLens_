import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Hero from '@/components/landing/Hero';
import HowItWorks from '@/components/landing/HowItWorks';
import Features from '@/components/landing/Features';
import ProductPreview from '@/components/landing/ProductPreview';
import Pricing from '@/components/landing/Pricing';
import CTASection from '@/components/landing/CTASection';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <Hero />
        <HowItWorks />
        <Features />
        <ProductPreview />
        <Pricing />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
}
