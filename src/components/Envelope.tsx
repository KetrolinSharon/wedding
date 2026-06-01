/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { MailOpen, Heart, Landmark, Briefcase } from 'lucide-react';
import weddingEmblemImage from '../assets/images/wedding_emblem_1780229295700.png';

interface EnvelopeProps {
  onOpenStateChange?: (isOpen: boolean) => void;
}

export default function Envelope({ onOpenStateChange }: EnvelopeProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isBroken, setIsBroken] = useState(false);

  const handleOpen = () => {
    if (!isBroken) {
      setIsBroken(true);
      // Wait for seal breaking animation before raising the flap
      setTimeout(() => {
        setIsOpen(true);
        onOpenStateChange?.(true);
      }, 500);
    } else {
      setIsOpen(!isOpen);
      onOpenStateChange?.(!isOpen);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto py-8 px-4 flex flex-col items-center">
      <p className="text-xs font-sans tracking-widest text-primary/80 uppercase text-center mb-4 italic">
        — Tap the wax seal to open the invitation —
      </p>

      {/* 3D Envelope Container */}
      <div 
        className="relative w-full aspect-[4/3] bg-[#FFF9F4] rounded-xl border border-[#E8DDD4] luxury-card-shadow overflow-visible perspective-[1500px]"
        id="wedding-envelope-box"
      >
        {/* INVITATION CARD (Slides out of envelope) */}
        <div
          className={`absolute left-[5%] right-[5%] top-2 bg-[#FDFBF7] p-5 sm:p-6 text-charcoal rounded-lg border border-gold-light/60 shadow-xl transition-all duration-[1000ms] cubic-bezier(0.4, 0, 0.2, 1) ${
            isOpen 
              ? '-translate-y-[85%] scale-102 rotate-[0.5deg] shadow-2xl opacity-100 z-45' 
              : 'translate-y-2 scale-95 opacity-0 select-none pointer-events-none z-10'
          }`}
        >
          {/* Floral Corners */}
          <div className="absolute top-2 left-2 w-8 h-8 border-t border-l border-primary/40 rounded-tl-sm" />
          <div className="absolute top-2 right-2 w-8 h-8 border-t border-r border-primary/40 rounded-tr-sm" />
          <div className="absolute bottom-2 left-2 w-8 h-8 border-b border-l border-primary/40 rounded-bl-sm" />
          <div className="absolute bottom-2 right-2 w-8 h-8 border-b border-r border-primary/40 rounded-br-sm" />

          {/* Invitation Card Content */}
          <div className="flex flex-col items-center text-center space-y-3 font-serif">
            {/* Monogram inside card */}
            <div className="w-14 h-14 rounded-full border border-gold-light/60 flex items-center justify-center bg-pearl overflow-hidden p-0.5 shadow-md">
              <img 
                src={weddingEmblemImage} 
                alt="JK Marriage Emblem" 
                className="w-full h-full object-cover rounded-full"
                referrerPolicy="no-referrer"
              />
            </div>

            <p className="text-[10px] sm:text-xs font-sans tracking-wider text-charcoal/70 uppercase">
              The Marriage Invitation
            </p>

            <div className="space-y-1">
              <p className="text-xs sm:text-sm font-sans tracking-wide text-charcoal/80 font-medium">
                Mr. Kingsly S & Mrs. Raja Selvi D
              </p>
              <p className="text-[11px] font-sans text-charcoal/60">
                cordially welcome your esteemed presence with family on the auspicious occasion of the marriage of our daughter
              </p>
            </div>

            {/* Bride Details */}
            <div className="my-1">
              <h4 className="text-lg sm:text-xl font-bold text-primary font-serif">
                Ketrolin Shane K R
              </h4>
              <div className="flex items-center justify-center gap-1 text-[9px] sm:text-[10px] font-sans text-charcoal/60 mt-0.5">
              </div>
            </div>

            <div className="flex items-center gap-2 text-primary">
              <div className="h-px w-8 bg-primary/30" />
              <Heart className="w-4 h-4 fill-primary" />
              <div className="h-px w-8 bg-primary/30" />
            </div>

            {/* Groom Details */}
            <div className="my-1">
              <h4 className="text-lg sm:text-xl font-bold text-primary font-serif">
                Joyal Christo C V
              </h4>
              <div className="flex items-center justify-center gap-1 text-[9px] sm:text-[10px] font-sans text-charcoal/60 mt-0.5">
              </div>
            </div>

            <p className="text-[11px] font-sans text-charcoal/60 leading-tight">
              Son of <span className="font-medium text-charcoal/80">Mr. Christu Raj N & Mrs. Vijilet Mary J.</span>
            </p>

            <div className="pt-2 border-t border-gold-light w-4/5">
              <p className="text-[10px] font-sans tracking-wide text-primary/80 uppercase font-medium">
                Monday, June 29, 2026
              </p>
            </div>
          </div>
        </div>

        {/* ENVELOPE BACK & BODY (Holds structural color depth - non transparent) */}
        <div className="absolute inset-0 bg-[#E8DDD4] rounded-xl border border-beige overflow-hidden">
          {/* Opaque beautiful paper texture inside envelope */}
          <div className="absolute inset-0 bg-gradient-to-tr from-pearl to-ivory opacity-100" />
        </div>

        {/* ENVELOPE FRONT SIDE FLAPS (Visual pocket styling overlays) */}
        <div className="absolute inset-0 pointer-events-none z-20">
          {/* Inner pocket shadow border */}
          <div className="absolute bottom-0 left-0 right-0 h-4/5 bg-gradient-to-t from-[#E8DDD4]/40 to-transparent rounded-b-xl" />
          
          {/* Left flap polygon representation */}
          <div className="absolute bottom-0 left-0 w-1/2 h-4/5 bg-white border-r border-[#E8DDD4]/80 rounded-bl-xl origin-bottom-left skew-y-12 shadow-md opacity-100" />
          {/* Right flap polygon representation */}
          <div className="absolute bottom-0 right-0 w-1/2 h-4/5 bg-white border-l border-[#E8DDD4]/80 rounded-br-xl origin-bottom-right -skew-y-12 shadow-md opacity-100" />
          
          {/* Bottom flap triangle representation */}
          <div className="absolute bottom-0 left-0 right-0 h-3/5 bg-[#FFF9F4] rounded-b-xl border-t border-beige/60 flex items-end justify-center pb-2">
            {/* Elegant embossed label */}
          
          </div>
        </div>

        {/* ENVELOPE TOP FLAP (Rotates 3D upward on click - has dynamic z-index to resolve overlay issues) */}
        <div
          onClick={handleOpen}
          className={`absolute top-0 left-0 right-0 h-1/2 origin-top transition-transform duration-[800ms] ease-in-out cursor-pointer ${
            isOpen ? 'z-10' : 'z-35'
          }`}
          style={{ 
            transformStyle: 'preserve-3d',
            transform: isOpen ? 'rotateX(180deg)' : 'rotateX(0deg)'
          }}
        >
          {/* Front facing flap (showing when closed) */}
          <div className="absolute inset-0 bg-white border-b border-[#E8DDD4]/80 flex items-center justify-center rounded-t-xl" style={{ backfaceVisibility: 'hidden', clipPath: 'polygon(0% 0%, 100% 0%, 50% 100%)' }}>
            <div className="absolute inset-0 bg-gradient-to-b from-pearl to-white opacity-100" />
            <div className="absolute top-[25%] left-1/2 transform -translate-x-1/2 text-center select-none">
              <span className="font-script text-xl text-primary/45 block">With Love</span>
            </div>
          </div>

          {/* Reverse side of flap (golds/borders showing when fully open) */}
          <div className="absolute inset-0 bg-[#FFF9F4] border-t border-gold-light/40" style={{ backfaceVisibility: 'hidden', transform: 'rotateX(180deg)', clipPath: 'polygon(0% 0%, 100% 0%, 50% 100%)' }}>
            <div className="absolute inset-x-0 bottom-4 text-center">
              <span className="font-serif text-[10px] text-primary/65 tracking-widest uppercase">The Blessed Union</span>
            </div>
          </div>
        </div>

        {/* WAX SEAL (Centered button, secures the envelope) */}
        <div 
          onClick={handleOpen}
          className={`absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 z-40 transition-all duration-700 ease-in-out cursor-pointer ${
            isBroken 
              ? 'scale-110 opacity-0 pointer-events-none' 
              : 'hover:scale-105 active:scale-95'
          }`}
        >
          {/* Handmade embossed seal outer circle */}
          <div className="relative w-16 h-16 rounded-full bg-[#9E4A56] border-2 border-[#813C46] flex items-center justify-center shadow-xl hover:shadow-2xl transition duration-300">
            {/* Melting wax aesthetic ring */}
            <div className="absolute inset-1 rounded-full border border-dashed border-[#F7E7CE]/40" />
            {/* Inner Crest stamp */}
            <div className="w-11 h-11 rounded-full bg-pearl border border-[#813C46] flex items-center justify-center text-center overflow-hidden p-0.5 shadow-inner">
              <img 
                src={weddingEmblemImage} 
                alt="JK Seal" 
                className="w-full h-full object-cover rounded-full"
                referrerPolicy="no-referrer"
              />
            </div>

            {/* Wax dripping highlights */}
            <div className="absolute -bottom-1 left-2 w-5 h-2 bg-[#9E4A56] rounded-full filter blur-[1px] opacity-80" />
            <div className="absolute -top-1 right-2 w-4 h-2.5 bg-[#9E4A56] rounded-full filter blur-[1px] opacity-80" />
          </div>
        </div>
      </div>

      {/* Auxiliary Open / Re-Fold controls */}
      <div className="mt-6 flex gap-4">
        <button
          onClick={handleOpen}
          className="px-4 py-2 text-xs font-sans tracking-widest uppercase bg-transparent hover:bg-beige/25 border border-primary/40 rounded-full transition-all duration-300 text-primary flex items-center gap-2 cursor-pointer"
        >
          <MailOpen className="w-3.5 h-3.5" />
          <span>{isOpen ? 'Close Envelope' : 'Open Envelope'}</span>
        </button>
      </div>
    </div>
  );
}
