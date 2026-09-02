import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import TrustStrip from '@/components/TrustStrip';
import ExploreSection from '@/components/ExploreSection';
import ComparisonSection from '@/components/ComparisonSection';
import Features from '@/components/Features';
import HowItWorks from '@/components/HowItWorks';
import SocialProof from '@/components/SocialProof';
import CTASection from '@/components/CTASection';
import Footer from '@/components/Footer';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'AI Prompt Hub | Find Image Prompts That Actually Work',
  description:
    'Tested prompts for Midjourney, DALL·E, Stable Diffusion, and more — copy exact syntax with aspect ratios and model parameters included.',
};

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans transition-colors duration-200 selection:bg-primary/30 selection:text-primary">
      <Navbar />
      <main className="flex-1">
        {/* 1. Hero with outcome headline and enlarged fanned showcase */}
        <Hero />

        {/* 2. Above-the-fold trust and value strip */}
        <TrustStrip />

        {/* 3. Explore & Discovery: Editor's Picks + Multi-Dimensional Filters + Browse All */}
        <ExploreSection />

        {/* 4. Differentiator: Why creators use AI Prompt Hub vs random sources */}
        <ComparisonSection />

        {/* 5. Benefits: Visitor-focused precision engineering */}
        <Features />

        {/* 6. How it works: Active visual 3-step workflow */}
        <HowItWorks />

        {/* 7. Social proof: Creator testimonials and capability stats */}
        <SocialProof />

        {/* 8. Final CTA: Stop searching. Start creating. */}
        <CTASection />
      </main>
      <Footer />
    </div>
  );
}
