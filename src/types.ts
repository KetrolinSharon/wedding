/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface RSVP {
  id: string;
  name: string;
  attendance: 'yes' | 'no' | 'maybe';
  guests: number;
  message: string;
  createdAt: string;
}

export interface TimelineEvent {
  time: string;
  title: string;
  location: string;
  details?: string;
  icon: string;
}

export interface Venue {
  name: string;
  type: 'Ceremony' | 'Reception';
  host: string;
  address: string;
  mapEmbedUrl?: string;
  mapLink: string;
  imageSeed: string;
}
