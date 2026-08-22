import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import ExploreSection from '@/components/ExploreSection';
import Features from '@/components/Features';
import HowItWorks from '@/components/HowItWorks';
import CTASection from '@/components/CTASection';
import Footer from '@/components/Footer';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'AI Prompt Hub | Discover & Copy AI Image Prompts',
  description:
    'A curated library of battle-tested AI image prompts for Midjourney, DALL·E 3, and Stable Diffusion — copy exact syntax with aspect ratios and model parameters included.',
};

export default function Home() {
  return (
    <div className="min-h-screen bg-[#14121A] text-[#EDE9F7] flex flex-col font-sans">
      <Navbar />
      <main className="flex-1">
        <Hero />
        <ExploreSection />
        <Features />
        <HowItWorks />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
}
