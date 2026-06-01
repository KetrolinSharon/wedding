/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useState } from 'react';
import { Heart, Smile, Sparkles, MessageSquare, Plus, Trash2 } from 'lucide-react';
import { RSVP } from '../types';

interface GuestbookProps {
  rsvpsUpdatedTrigger?: number;
  onOpenRSVPRequest?: () => void;
}

export default function Guestbook({ rsvpsUpdatedTrigger, onOpenRSVPRequest }: GuestbookProps) {
  const [blessings, setBlessings] = useState<RSVP[]>([]);

  // Seed default beautiful blessings if empty
  const defaultBlessings: RSVP[] = [];

  const loadBlessings = () => {
    const rawRSVPs = localStorage.getItem('ketrolin_joyal_rsvps_v3');
    if (rawRSVPs) {
      const parsed = JSON.parse(rawRSVPs) as RSVP[];
      // Keep structural integrity of both default and custom ones
      setBlessings(parsed);
    } else {
      setBlessings(defaultBlessings);
      localStorage.setItem('ketrolin_joyal_rsvps_v3', JSON.stringify(defaultBlessings));
    }
  };

  useEffect(() => {
    loadBlessings();
  }, [rsvpsUpdatedTrigger]);

  const handleDeleteBlessing = (id: string) => {
    const filtered = blessings.filter(b => b.id !== id);
    setBlessings(filtered);
    localStorage.setItem('ketrolin_joyal_rsvps_v3', JSON.stringify(filtered));
  };

  return (
    <div className="w-full max-w-4xl mx-auto py-10 px-4">
      {/* Header */}
      <div className="flex flex-col items-center text-center mb-8">
        <span className="font-script text-2xl text-primary block">Wishes From Our Dear Ones</span>
        <h2 className="font-serif text-3xl font-bold text-charcoal tracking-tight mt-1">
          The Blessings Wall
        </h2>
        <div className="w-20 h-0.5 bg-gradient-to-r from-transparent via-[#B76E79] to-transparent mt-3" />
        <p className="text-xs font-sans text-charcoal/60 mt-2 max-w-md">
          Read the sweet greetings and well-wishes from family and guests who will be attending Ketrolin & Joyal’s wedding.
        </p>
      </div>

      {/* Masonry-like grid container */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Call to action "Add Your Blessing" Card */}
        <div 
          onClick={onOpenRSVPRequest}
          className="group flex flex-col items-center justify-center p-6 bg-[#FDFBF7] border-2 border-dashed border-primary/25 rounded-3xl cursor-pointer hover:border-primary/60 hover:bg-[#FFF9F4] transition-all duration-300 min-h-[170px]"
        >
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition duration-300 mb-3">
            <Plus className="w-6 h-6" />
          </div>
          <span className="font-serif text-lg font-bold text-charcoal tracking-tight">Add Your Wishes</span>
          <span className="text-[11px] font-sans text-charcoal/50 mt-1 max-w-[170px] text-center leading-snug">
            Kindly RSVP and leave your sweet message for the couple.
          </span>
        </div>

        {blessings.map((blessing) => (
          <div 
            key={blessing.id}
            className="relative p-5 bg-[#FFF9F4] rounded-3xl border border-beige/50 luxury-card-shadow flex flex-col justify-between group transition-all duration-500 hover:-translate-y-1 hover:shadow-xl"
          >
            {/* Custom decorative icon corner */}
            <Heart className="absolute top-4 right-4 w-4 h-4 text-primary/15 group-hover:text-primary/40 group-hover:scale-110 transition" />

            <div>
              {/* Author Details */}
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-full bg-primary/15 border border-primary/20 flex items-center justify-center text-primary text-xs font-bold font-serif shadow-xs">
                  {blessing.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h4 className="text-sm font-sans font-bold text-charcoal leading-tight">
                    {blessing.name}
                  </h4>
                  <div className="flex items-center gap-1 text-[10px] text-charcoal/50 mt-0.5">
                    <span className={`w-1.5 h-1.5 rounded-full ${
                      blessing.attendance === 'yes' ? 'bg-primary' : blessing.attendance === 'maybe' ? 'bg-gold' : 'bg-beige'
                    }`} />
                    <span>
                      {blessing.attendance === 'yes' 
                        ? `Attending • ${blessing.guests} guest${blessing.guests > 1 ? 's' : ''}` 
                        : blessing.attendance === 'maybe' 
                        ? 'Tentative' 
                        : 'Declined'
                      }
                    </span>
                  </div>
                </div>
              </div>

              {/* Message */}
              {blessing.message ? (
                <p className="text-xs font-sans text-charcoal/70 leading-relaxed italic pr-2">
                  " {blessing.message} "
                </p>
              ) : (
                <p className="text-xs font-sans text-charcoal/40 leading-relaxed italic">
                  Left warm wishes without a note.
                </p>
              )}
            </div>

            {/* Blessing Footer / Actions */}
            <div className="mt-4 pt-3 border-t border-beige/40 flex items-center justify-between text-[10px] text-charcoal/40">
              <span>
                {new Date(blessing.createdAt).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric'
                })}
              </span>

              {/* Permit deletion for newly/locally added or standard cards easily */}
              <button
                onClick={() => handleDeleteBlessing(blessing.id)}
                className="p-1 rounded text-neutral-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition cursor-pointer"
                title="Delete Message"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
