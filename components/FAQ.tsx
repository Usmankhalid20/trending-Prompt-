'use client';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

export default function FAQ() {
  const faqs = [
    {
      id: 'faq-1',
      question: 'What is AI Prompt Hub?',
      answer:
        'AI Prompt Hub is a curated platform where users can submit, test, and discover high-quality AI prompts for models like ChatGPT, Claude, Midjourney, and Stable Diffusion.',
    },
    {
      id: 'faq-2',
      question: 'Is AI Prompt Hub free to use?',
      answer:
        'Yes! Creating an account, discovering published prompts, and submitting your own prompts is completely free for all community members.',
    },
    {
      id: 'faq-3',
      question: 'How does the prompt approval process work?',
      answer:
        'When you submit a prompt, it enters our admin moderation queue. Our moderators review the prompt for safety, clarity, completeness, and utility before it is published to the public library.',
    },
    {
      id: 'faq-4',
      question: 'What types of prompts can I submit?',
      answer:
        'You can submit text prompts for LLMs (ChatGPT, Claude, Llama), image generation prompts (Midjourney, DALL-E 3), code generation prompts, marketing copy templates, and system prompts.',
    },
    {
      id: 'faq-5',
      question: 'Can I manage or update my submitted prompts?',
      answer:
        'Yes. Once logged into your account portal, you can view your submission status, track approvals, and manage your published prompt portfolio.',
    },
  ];

  return (
    <section id="faq" className="py-20 bg-muted/20 border-b border-border/40">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-xs font-bold uppercase tracking-wider text-primary">
            Frequently Asked Questions
          </h2>
          <p className="text-3xl font-extrabold text-foreground tracking-tight sm:text-4xl">
            Everything You Need to Know
          </p>
          <p className="text-base text-muted-foreground">
            Have questions about AI Prompt Hub? Here are answers to the most common queries.
          </p>
        </div>

        {/* Accordion List */}
        <div className="rounded-2xl border border-border/60 bg-card p-6 sm:p-8 shadow-xs">
          <Accordion type="single" collapsible className="w-full space-y-2">
            {faqs.map((faq) => (
              <AccordionItem key={faq.id} value={faq.id} className="border-border/60">
                <AccordionTrigger className="text-base font-semibold text-foreground hover:no-underline hover:text-primary py-4">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed text-sm">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>

      </div>
    </section>
  );
}
