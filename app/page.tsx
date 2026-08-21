import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import Features from '@/components/Features';
import HowItWorks from '@/components/HowItWorks';
import CTASection from '@/components/CTASection';
import Footer from '@/components/Footer';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'AI Prompt Hub | Discover & Copy AI Image Prompts',
  description:
    'A curated library of tested AI image prompts for Midjourney, DALL·E 3, and Stable Diffusion — browse, copy the exact syntax, and generate stunning artwork.',
};

export default function Home() {
  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#14121A',
        color: '#EDE9F7',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Navbar />
      <main style={{ flex: 1 }}>
        <Hero />
        <Features />
        <HowItWorks />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
}
