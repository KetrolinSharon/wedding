/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Calendar, Church, CupSoda, Clock, MapPin } from 'lucide-react';
import { TimelineEvent } from '../types';

export default function Timeline() {
  const events: TimelineEvent[] = [
    {
      time: '10:00 AM',
      title: 'Holy Matrimony Ceremony',
      location: "St. Paul's C.S.I. Church, New Kulapuram",
      details: 'Solemnized by Rev. S. Satheesh BA BD. Witness the holy marriage service of Ketrolin & Joyal as they declare their sacred vows.',
      icon: 'church',
    },
    {
      time: '12:30 PM',
      title: 'Subsequent Feast & Functions',
      location: 'Christ The King Community Hall, Piracode',
      details: 'Join us for a celebratory royal lunch reception with cutting of the cake, congratulatory speeches, music, and sharing happiness.',
      icon: 'feast',
    },
  ];

  const renderIcon = (type: string) => {
    switch (type) {
      case 'church':
        return <Church className="w-5 h-5 text-primary" />;
      case 'feast':
        return <CupSoda className="w-5 h-5 text-primary" />;
      default:
        return <Clock className="w-5 h-5 text-primary" />;
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto py-10 px-4">
      <div className="flex flex-col items-center text-center mb-10">
        <span className="font-script text-2xl text-primary block">The Blessed Marriage Schedule</span>
        <h2 className="font-serif text-3xl font-bold text-charcoal tracking-tight mt-1">
          Wedding Timeline
        </h2>
        <div className="w-20 h-0.5 bg-gradient-to-r from-transparent via-[#B76E79] to-transparent mt-3" />
        <p className="text-xs font-sans text-charcoal/60 mt-2 flex items-center gap-1">
          <Calendar className="w-3.5 h-3.5 text-primary" />
          <span>Monday, June 29, 2026</span>
        </p>
      </div>

      <div className="relative border-l border-primary/20 ml-4 md:ml-1/2 md:border-l-0">
        {events.map((event, idx) => {
          const isEven = idx % 2 === 0;
          return (
            <div 
              key={idx} 
              className={`relative mb-12 md:mb-16 md:flex md:w-full items-center justify-between ${
                isEven ? 'md:flex-row-reverse' : ''
              }`}
            >
              {/* Timeline Center Bullet for large screens */}
              <div 
                className="absolute -left-4 md:left-1/2 md:-translate-x-1/2 w-8 h-8 rounded-full bg-[#FFF9F4] border border-[#B76E79] flex items-center justify-center shadow-md z-10 transition-transform duration-300 hover:scale-110"
              >
                {renderIcon(event.icon)}
              </div>

              {/* Event Card Content */}
              <div 
                className={`w-full md:w-[45%] ml-8 md:ml-0 p-5 rounded-2xl bg-pearl border border-beige/60 luxury-card-shadow transition-transform duration-500 hover:-translate-y-1`}
              >
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="inline-flex items-center gap-1 text-[11px] font-sans font-semibold text-primary uppercase tracking-widest bg-primary/10 px-2.5 py-0.5 rounded-full">
                    <Clock className="w-3 h-3" />
                    {event.time}
                  </span>
                </div>

                <h3 className="font-serif text-xl font-bold text-charcoal mb-1 leading-tight">
                  {event.title}
                </h3>

                <p className="text-xs font-sans font-medium text-primary flex items-start gap-1 pb-2 border-b border-beige/40">
                  <MapPin className="w-3.5 h-3.5 flex-none mt-0.5" />
                  <span>{event.location}</span>
                </p>

                {event.details && (
                  <p className="text-xs font-sans text-charcoal/65 mt-2.5 leading-relaxed">
                    {event.details}
                  </p>
                )}
              </div>

              {/* Spacer on desktop */}
              <div className="hidden md:block w-[45%]" />
            </div>
          );
        })}
      </div>
    </div>
  );
}
