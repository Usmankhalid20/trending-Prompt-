import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#14121A] text-[#EDE9F7] flex flex-col items-center justify-center p-6 text-center">
      <div className="max-w-md w-full bg-[#1D1926] border border-[#37324A] rounded-2xl p-8 shadow-2xl space-y-6">
        
        {/* Frame Counter Badge */}
        <div className="inline-flex flex-col items-center justify-center w-20 h-20 rounded-full border border-[#37324A] bg-[#14121A] mx-auto shadow-inner">
          <span className="font-mono text-2xl font-bold text-[#FF6B4A]">404</span>
          <span className="font-mono text-[9px] font-semibold text-[#83E6C9] uppercase">MISSING</span>
        </div>

        <div className="space-y-2">
          <h1 className="font-display text-2xl font-bold text-[#EDE9F7]">
            Frame Not Found
          </h1>
          <p className="font-sans text-xs text-[#A79FC4] leading-relaxed">
            The prompt recipe or page frame you were looking for does not exist or has been relocated.
          </p>
        </div>

        {/* Action Button */}
        <Link href="/">
          <Button className="w-full bg-[#FF6B4A] hover:bg-[#e85a39] text-[#14121A] font-sans font-semibold gap-2 shadow-xs border-0">
            <ArrowLeft className="h-4 w-4" />
            Return to Light-Table Gallery
          </Button>
        </Link>
      </div>
    </div>
  );
}
