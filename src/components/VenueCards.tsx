/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Church, Compass, Map, ExternalLink } from 'lucide-react';
import { Venue } from '../types';
import csiChurchImage from '../assets/images/csi_church_1780229072269.png';
import communityHallImage from '../assets/images/community_hall_building_1780231112918.png';

export default function VenueCards() {
  const venues: Venue[] = [
    {
      name: "St. Paul's C.S.I. Church",
      type: 'Ceremony',
      host: 'New Kulapuram',
      address: 'St. Paul’s C.S.I. Church, New Kulapuram, Tamil Nadu, India.',
      mapLink: 'https://maps.google.com/?q=St.+Paul’s+C.S.I.+Church,+New+Kulapuram',
      imageSeed: csiChurchImage,
    },
    {
      name: 'Christ The King Community Hall',
      type: 'Reception',
      host: 'Piracode',
      address: 'Christ The King Roman Catholic Church Hall, Piracode, Tamil Nadu, India.',
      mapLink: 'https://maps.google.com/?q=Christ+The+King+Community+Hall,+Piracode',
      imageSeed: communityHallImage,
    },
  ];

  return (
    <div className="w-full max-w-4xl mx-auto py-10 px-4">
      <div className="flex flex-col items-center text-center mb-10">
        <span className="font-script text-2xl text-primary block">Located For Your Convenience</span>
        <h2 className="font-serif text-3xl font-bold text-charcoal tracking-tight mt-1">
          Wedding Venues
        </h2>
        <div className="w-20 h-0.5 bg-gradient-to-r from-transparent via-[#B76E79] to-transparent mt-3" />
        <p className="text-xs font-sans text-charcoal/60 mt-2 max-w-md">
          Both venues are closely located to ensure a swift and delightful travel experience between the liturgy and celebrations.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {venues.map((venue, idx) => (
          <div 
            key={idx}
            className="group flex flex-col bg-[#FDFBF7] rounded-3xl border border-beige/60 overflow-hidden luxury-card-shadow transition-all duration-500 hover:-translate-y-1.5 hover:shadow-2xl"
          >
            {/* Ambient Graphic Header */}
            <div className="relative h-44 overflow-hidden bg-beige/30">
              <img 
                src={venue.imageSeed} 
                alt={venue.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover opacity-85 transition-transform duration-[2000ms] group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#FDFBF7] via-transparent to-transparent" />
              
              <span className="absolute top-4 left-4 inline-flex items-center gap-1 text-[10px] font-sans font-semibold text-primary uppercase tracking-widest bg-white/95 px-3 py-1 rounded-full shadow-xs">
                <Compass className="w-3 h-3 text-primary animate-spin" style={{ animationDuration: '8s' }} />
                {venue.type}
              </span>
            </div>

            {/* Venue Card Details */}
            <div className="flex-1 p-6 flex flex-col justify-between">
              <div>
                <h3 className="font-serif text-2xl font-bold text-charcoal mb-0.5 leading-tight group-hover:text-primary transition-colors">
                  {venue.name}
                </h3>
                <p className="text-xs font-sans text-primary font-medium tracking-wide mb-3">
                  {venue.host}
                </p>
                <p className="text-xs font-sans text-charcoal/65 leading-relaxed mb-6">
                  {venue.address}
                </p>
              </div>

              <div className="pt-4 border-t border-beige/40 flex items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-primary/10 rounded-full">
                    <Church className="w-4 h-4 text-primary" />
                  </div>
                  <span className="text-[11px] font-sans text-charcoal/60">
                    {venue.type === 'Ceremony' ? 'Liturgic Service' : 'Wedding Banquet'}
                  </span>
                </div>

                <a
                  href={venue.mapLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-sans font-semibold tracking-wider text-[#FFF9F4] bg-primary hover:bg-[#9d5661] rounded-full transition-all duration-300 shadow-md hover:shadow-lg origin-center active:scale-95 cursor-pointer"
                >
                  <Map className="w-3.5 h-3.5" />
                  <span>Get Directions</span>
                  <ExternalLink className="w-3 h-3 opacity-80" />
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
