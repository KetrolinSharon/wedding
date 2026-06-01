/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { X, Sparkles, Check, Send, Users, MessageSquare } from 'lucide-react';
import { RSVP } from '../types';

interface RSVPModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccessSubmit?: (newRSVP: RSVP) => void;
}

export default function RSVPModal({ isOpen, onClose, onSuccessSubmit }: RSVPModalProps) {
  const [name, setName] = useState('');
  const [attendance, setAttendance] = useState<'yes' | 'no' | 'maybe'>('yes');
  const [guests, setGuests] = useState(1);
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setIsSubmitting(true);

    // Simulate an elegant submit latency
    setTimeout(() => {
      const newRSVP: RSVP = {
        id: crypto.randomUUID(),
        name: name.trim(),
        attendance,
        guests: attendance === 'yes' ? guests : 0,
        message: message.trim(),
        createdAt: new Date().toISOString(),
      };

      // Retrieve existing RSVPs and push
      const rawRSVPs = localStorage.getItem('ketrolin_joyal_rsvps_v3');
      const currentRSVPs: RSVP[] = rawRSVPs ? JSON.parse(rawRSVPs) : [];
      currentRSVPs.unshift(newRSVP); // Prepend new blessings
      localStorage.setItem('ketrolin_joyal_rsvps_v3', JSON.stringify(currentRSVPs));

      setIsSubmitting(false);
      setIsSuccess(true);
      onSuccessSubmit?.(newRSVP);

      // Auto-close success message after 2.5 seconds
      setTimeout(() => {
        setIsSuccess(false);
        // Clear fields
        setName('');
        setAttendance('yes');
        setGuests(1);
        setMessage('');
        onClose();
      }, 2500);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-charcoal/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Modal Box */}
      <div className="relative w-full max-w-md bg-pearl border border-gold-light rounded-3xl overflow-hidden shadow-2xl z-20 animate-scale-up">
        {/* Soft elegant top color bar */}
        <div className="h-2 bg-gradient-to-r from-primary via-gold-light to-primary" />

        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full bg-charcoal/5 hover:bg-charcoal/10 text-charcoal/60 hover:text-charcoal transition cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {isSuccess ? (
          /* Thank You / Success View */
          <div className="p-8 flex flex-col items-center text-center space-y-4 animate-fade-in">
            <div className="w-14 h-14 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
              <Check className="w-7 h-7" />
            </div>
            
            <div className="space-y-1">
              <h3 className="font-serif text-2xl font-bold text-charcoal">
                RSVP Registered!
              </h3>
              <p className="text-xs font-sans text-charcoal/60 px-4">
                Thank you so much. Your response has been saved successfully. Ketrolin & Joyal look forward to celebrating with you!
              </p>
            </div>

            <span className="font-script text-2xl text-primary animate-pulse block">
              Sharing Happiness
            </span>
          </div>
        ) : (
          /* Interactive RSVP / Wishes Form */
          <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-5">
            <div className="text-center space-y-1">
              <span className="font-script text-2xl text-primary block">Will You Join Us?</span>
              <h3 className="font-serif text-2xl font-bold text-charcoal">
                R. S. V. P. Details
              </h3>
              <p className="text-[11px] font-sans text-charcoal/50 uppercase tracking-widest">
                Kindly respond by June 20, 2026
              </p>
            </div>

            <div className="space-y-4">
              {/* Name Field */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-sans font-bold uppercase tracking-widest text-[#B76E79]">
                  Your Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Samuel Kingsly"
                  className="w-full text-sm font-sans px-4 py-2.5 bg-[#FDFBF7] border border-beige/80 rounded-xl focus:ring-1 focus:ring-primary focus:border-primary outline-none transition"
                />
              </div>

              {/* Attendance Options */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-sans font-bold uppercase tracking-widest text-[#B76E79]">
                  Attendance Status
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { val: 'yes', label: 'Attending' },
                    { val: 'no', label: 'Declined' },
                    { val: 'maybe', label: 'Tentative' },
                  ].map((item) => (
                    <button
                      key={item.val}
                      type="button"
                      onClick={() => setAttendance(item.val as any)}
                      className={`py-2 text-[11px] font-sans font-semibold tracking-wider rounded-xl border transition-all cursor-pointer ${
                        attendance === item.val
                          ? 'bg-primary border-primary text-white shadow-sm'
                          : 'bg-[#FDFBF7] border-beige/60 text-charcoal/70 hover:bg-beige/10'
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Guests Count (shown only if attending) */}
              {attendance === 'yes' && (
                <div className="space-y-1.5 animate-slide-up">
                  <div className="flex items-center justify-between">
                    <label className="text-[10px] font-sans font-bold uppercase tracking-widest text-[#B76E79] flex items-center gap-1">
                      <Users className="w-3 h-3" />
                      <span>Number of Guests Attending</span>
                    </label>
                    <span className="text-xs font-sans font-bold text-primary">
                      {guests} {guests === 1 ? 'Person' : 'People'}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="6"
                    value={guests}
                    onChange={(e) => setGuests(parseInt(e.target.value))}
                    className="w-full h-1 bg-beige/60 rounded-lg appearance-none cursor-pointer accent-primary"
                  />
                  <div className="flex justify-between text-[9px] font-sans text-charcoal/40">
                    <span>1 Guest</span>
                    <span>2</span>
                    <span>3</span>
                    <span>4</span>
                    <span>5</span>
                    <span>6 Guests Max</span>
                  </div>
                </div>
              )}

              {/* Message / Blessings Field */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-sans font-bold uppercase tracking-widest text-[#B76E79] flex items-center gap-1">
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>Blessing / Wishes for Couple</span>
                </label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Leave your warm love & blessings here..."
                  rows={3}
                  className="w-full text-sm font-sans px-4 py-2 bg-[#FDFBF7] border border-beige/80 rounded-xl focus:ring-1 focus:ring-primary focus:border-primary outline-none transition resize-none"
                />
              </div>
            </div>

            {/* Send Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 h-12 bg-primary hover:bg-[#9d5661] text-[#FFF9F4] font-sans font-bold tracking-widest uppercase text-xs rounded-xl transition-all duration-300 shadow-md hover:shadow-lg flex items-center justify-center gap-2 disabled:bg-primary/50 cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-[#FFF9F4] border-t-transparent rounded-full animate-spin" />
                  <span>Recording Response...</span>
                </>
              ) : (
                <>
                  <Send className="w-3.5 h-3.5" />
                  <span>Submit RSVP</span>
                  <Sparkles className="w-3 h-3 text-gold-light" />
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
