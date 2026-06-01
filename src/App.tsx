/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useState, useRef } from 'react';
import { 
  Heart, 
  MapPin, 
  Volume2, 
  VolumeX, 
  Sparkles, 
  ChevronDown, 
  Calendar, 
  Clock, 
  Mic, 
  Landmark, 
  Award,
  Music
} from 'lucide-react';
import ScratchCard from './components/ScratchCard';
import Envelope from './components/Envelope';
import Timeline from './components/Timeline';
import VenueCards from './components/VenueCards';
import RSVPModal from './components/RSVPModal';
import Guestbook from './components/Guestbook';
import { RSVP } from './types';
import weddingEmblemImage from './assets/images/wedding_emblem_1780229295700.png';
import csiChurchImage from './assets/images/csi_church_1780229072269.png';


// Handle image path dynamically to avoid build crashes when file is missing
const coupleIllustrationUrl = new URL('./assets/images/couple_illustration_1780231679870.png', import.meta.url).href;

const potentialImagePaths = [
  '/couplephoto.jpeg',
  '/couple_photo.JPG',
  '/couple_photo.jpeg',
  '/couple_photo.JPEG',
  '/couple_photo.png',
  '/couple_photo.PNG',
  
  '/couple%20photo.jpg',
  '/couple%20photo.JPG',
  '/couple%20photo.jpeg',
  '/couple%20photo.JPEG',
  '/couple%20photo.png',
  '/couple%20photo.PNG',

  '/couple photo.jpg',
  '/couple photo.JPG',
  '/couple photo.jpeg',
  '/couple photo.JPEG',
  '/couple photo.png',
  '/couple photo.PNG',

  '/couplephoto.jpg',
  '/couplephoto.JPG',
  '/couplephoto.jpeg',
  '/couplephoto.JPEG',
  '/couplephoto.png',
  '/couplephoto.PNG',

  '/Couple_Photo.jpg',
  '/Couple_Photo.JPG',
  '/Couple_Photo.jpeg',
  '/Couple_Photo.JPEG',
  '/Couple_Photo.png',
  '/Couple_Photo.PNG',

  '/COUPLE_PHOTO.jpg',
  '/COUPLE_PHOTO.JPG',
  '/COUPLE_PHOTO.jpeg',
  '/COUPLE_PHOTO.JPEG',
  '/COUPLE_PHOTO.png',
  '/COUPLE_PHOTO.PNG'
];

export default function App() {
  const [isRSVPModalOpen, setIsRSVPModalOpen] = useState(false);
  const [isEnvelopeOpen, setIsEnvelopeOpen] = useState(false);
  const [isPlayingMusic, setIsPlayingMusic] = useState(false);
  const [rsvpsUpdatedTrigger, setRsvpsUpdatedTrigger] = useState(0);
  const [imageSrc, setImageSrc] = useState(potentialImagePaths[0]);
  
  // Use a mutable ref to safely and synchronously track current index across fast-firing errors
  const imageIndexRef = useRef(0);

  const handleImageError = () => {
    if (imageIndexRef.current < potentialImagePaths.length - 1) {
      imageIndexRef.current += 1;
      const nextPath = potentialImagePaths[imageIndexRef.current];
      setImageSrc(nextPath);
    } else {
      // Fallback to wedding emblem to avoid broken images showing up
      setImageSrc(weddingEmblemImage);
    }
  };

  // Audio stream reference - royalty-free soft ambient wedding instrumental
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Target Countdown Date: Monday, June 29, 2026 at 10:00 AM
  const targetDate = new Date('2026-06-29T10:00:00').getTime();
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    completed: false
  });

  // Calculate Countdown
  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = Date.now();
      const difference = targetDate - now;

      if (difference <= 0) {
        setTimeLeft(prev => ({ ...prev, completed: true }));
        return;
      }

      setTimeLeft({
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
        completed: false
      });
    };

    calculateTimeLeft();
    const interval = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(interval);
  }, [targetDate]);

  // Audio setup
  useEffect(() => {
    const audioPaths = [
      '/wed.mp3',
      '/web.mp3',
      '/wed.MP3',
      '/web.MP3',
      '/wed.wav',
      '/web.wav'
    ];
    let currentAudioIndex = 0;
    let hasInteracted = false;

    const createAndSetupAudio = (index: number): HTMLAudioElement => {
      const audioObj = new Audio(audioPaths[index]);
      audioObj.loop = true;
      audioObj.volume = 0.35;
      audioObj.addEventListener('error', handleAudioLoadingError);
      return audioObj;
    };

    const handleAudioLoadingError = () => {
      console.log(`Audio path failed to load: ${audioPaths[currentAudioIndex]}`);
      if (currentAudioIndex < audioPaths.length - 1) {
        if (audioRef.current) {
          audioRef.current.pause();
          audioRef.current.removeEventListener('error', handleAudioLoadingError);
        }
        currentAudioIndex++;
        console.log(`Trying fallback audio path: ${audioPaths[currentAudioIndex]}`);
        
        const nextAudio = createAndSetupAudio(currentAudioIndex);
        audioRef.current = nextAudio;
        
        if (hasInteracted) {
          nextAudio.play().then(() => {
            setIsPlayingMusic(true);
          }).catch(err => {
            console.log('Failed fallback auto-play retry:', err);
          });
        }
      }
    };

    audioRef.current = createAndSetupAudio(currentAudioIndex);

    const handleFirstInteraction = () => {
      if (!hasInteracted && audioRef.current) {
        hasInteracted = true;
        audioRef.current.play().then(() => {
          setIsPlayingMusic(true);
        }).catch(err => {
          console.log('Autoplay play prevented initially', err);
        });

        // Remove event listeners immediately
        document.removeEventListener('click', handleFirstInteraction);
        document.removeEventListener('touchstart', handleFirstInteraction);
        document.removeEventListener('scroll', handleFirstInteraction);
      }
    };

    // Auto-engage music smoothly when they start reading the invitation
    document.addEventListener('click', handleFirstInteraction);
    document.addEventListener('touchstart', handleFirstInteraction);
    document.addEventListener('scroll', handleFirstInteraction);

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.removeEventListener('error', handleAudioLoadingError);
        audioRef.current = null;
      }
      document.removeEventListener('click', handleFirstInteraction);
      document.removeEventListener('touchstart', handleFirstInteraction);
      document.removeEventListener('scroll', handleFirstInteraction);
    };
  }, []);

  const toggleMusic = () => {
    if (!audioRef.current) return;
    if (isPlayingMusic) {
      audioRef.current.pause();
      setIsPlayingMusic(false);
    } else {
      audioRef.current.play().then(() => {
        setIsPlayingMusic(true);
      }).catch(err => {
        console.log('Music play prevented', err);
      });
    }
  };

  const handleRSVPSuccess = (newRSVP: RSVP) => {
    // Increment trigger to reload the guestbook lists
    setRsvpsUpdatedTrigger(prev => prev + 1);
  };

  return (
    <div className="min-h-screen bg-[#FFFDF9] flex justify-center items-start md:py-8 font-sans selection:bg-primary/20 select-none">
      
      {/* Centered Ornate Card column */}
      <div className="w-full max-w-[480px] bg-[#F7E7CE] md:border-4 md:border-double md:border-[#D4AF37]/60 md:shadow-2xl relative champagne-luxury-bg flex flex-col min-h-screen md:min-h-[850px] md:rounded-[32px] overflow-hidden" id="wedding-invite-frame">
        
        {/* Subtle Decorative Floral Background Frame Corner Elements */}
        <div className="absolute top-2 left-2 w-14 h-14 pointer-events-none opacity-40 border-t-2 border-l-2 border-primary/40 rounded-tl-lg" />
        <div className="absolute top-2 right-2 w-14 h-14 pointer-events-none opacity-40 border-t-2 border-r-2 border-primary/40 rounded-tr-lg" />
        <div className="absolute bottom-2 left-2 w-14 h-14 pointer-events-none opacity-40 border-b-2 border-l-2 border-primary/40 rounded-bl-lg" />
        <div className="absolute bottom-2 right-2 w-14 h-14 pointer-events-none opacity-40 border-b-2 border-r-2 border-primary/40 rounded-tr-lg" />

        {/* Decorative Top Rose Gold Shimmer overlay */}
        <div className="absolute top-0 inset-x-0 h-40 pointer-events-none opacity-25 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/35 via-transparent to-transparent" />
        
        {/* Elegant Sound Toggle Widget at the top */}
        <div className="absolute top-4 right-4 z-50 flex items-center gap-2">
          {!isPlayingMusic && (
            <span className="text-[10px] sm:text-xs font-serif italic text-primary/80 bg-[#FFF9F4]/90 border border-[#D4AF37]/35 rounded-full px-2.5 py-1 shadow-sm animate-pulse tracking-wide">
              🎵 Play Music
            </span>
          )}
          <button
            onClick={toggleMusic}
            className="w-11 h-11 rounded-full bg-[#FFF9F4]/95 backdrop-blur-xs border border-[#D4AF37] hover:border-primary flex items-center justify-center text-primary shadow-md hover:shadow-lg transition-all duration-300 group cursor-pointer"
            id="music-toggle-btn"
            title={isPlayingMusic ? "Mute Background Music" : "Play Background Music"}
          >
            {isPlayingMusic ? (
              <div className="flex items-center justify-center gap-0.5">
                <span className="w-0.5 h-3.5 bg-primary rounded-full animate-[pulse_0.8s_infinite]" />
                <span className="w-0.5 h-4.5 bg-primary rounded-full animate-[pulse_1s_infinite_150ms]" />
                <Volume2 className="w-4 h-4 text-primary" />
              </div>
            ) : (
              <div className="relative flex items-center justify-center w-full h-full">
                <span className="absolute inset-0 w-full h-full rounded-full bg-primary/20 animate-ping pointer-events-none" />
                <VolumeX className="w-4 h-4 text-primary animate-pulse" />
              </div>
            )}
          </button>
        </div>

        {/* Primary Layout Panel (Sized specifically for vertical visual harmony) */}
        <main className="w-full flex-1 px-4 sm:px-6 relative z-10 flex flex-col justify-start">
        
        {/* LANDING SECTION CARD */}
        <section className="min-h-screen flex flex-col justify-between py-12 relative">
          
          {/* Top Status Header */}
          <div className="flex flex-col items-center justify-center w-full space-y-4 pt-2">
            <div className="flex items-center gap-1.5 text-xs font-sans font-medium tracking-widest text-[#B76E79] text-center justify-center">
              <Sparkles className="w-3.5 h-3.5 text-gold-light animate-spin" style={{ animationDuration: '6s' }} />
              <span className="font-serif italic text-xs tracking-normal sm:tracking-wider normal-case">"He has made everything beautiful in its time -Ecclesiastes 3:11"</span>
              <Sparkles className="w-3.5 h-3.5 text-gold-light animate-spin" style={{ animationDuration: '6s' }} />
            </div>
            
            {/* Elegant Monogram Crest Banner - Centered below names */}
            <div className="w-20 h-20 border border-gold-light/60 rounded-full flex items-center justify-center bg-pearl shadow-md overflow-hidden p-0.5 hover:scale-105 transition-all duration-300">
              <img 
                src={weddingEmblemImage} 
                alt="JK Marriage Emblem" 
                className="w-full h-full object-cover rounded-full"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>

          {/* Central Typography and Announcement */}
          <div className="text-center space-y-6 my-auto pt-10">

            <div className="space-y-4">
              <span className="font-serif italic text-sm sm:text-base text-primary/70 tracking-widest block">
                Blessed Marriage of
              </span>

              {/* Couple Names */}
              <div className="space-y-2 py-4">
                <h1 className="font-serif text-4xl sm:text-5xl font-medium tracking-tight text-rose-gold leading-tight">
                  Ketrolin Shane
                </h1>
                <span className="font-script text-4xl text-primary block leading-none py-1">&</span>
                <h1 className="font-serif text-4xl sm:text-5xl font-medium tracking-tight text-rose-gold leading-tight">
                  Joyal Christo
                </h1>
              </div>

              {/* Quick Professional Description to honour bride & groom */}
              
            </div>

            {/* Date Hint / Interactive Scratch Cards Trigger */}
            <div className="pt-6 pb-2 space-y-4 flex flex-col items-center">
              <div className="text-center">
                <span className="font-serif text-xs text-primary tracking-widest uppercase block mb-1">
                  Discover Our Special Day
                </span>
                <p className="text-[10px] font-sans text-charcoal/40 uppercase tracking-wider">
                  Rub or scratch the panels below to reveal the wedding date
                </p>
              </div>

              {/* 3-panel scratch elements */}
              <div className="grid grid-cols-3 gap-3 pt-3">
                <ScratchCard 
                  label="DAY" 
                  revealValue="29" 
                  subText="Monday" 
                />
                <ScratchCard 
                  label="MONTH" 
                  revealValue="June" 
                  subText="The Month" 
                />
                <ScratchCard 
                  label="YEAR" 
                  revealValue="2026" 
                  subText="The Year" 
                />
              </div>
            </div>
          </div>

        
        </section>

        {/* SECTION 2: INTERACTIVE ENVELOPE */}
        <section className="py-16 border-t border-beige/40">
          <div className="flex flex-col items-center text-center mb-8">
            <h2 className="font-serif text-3xl font-bold text-charcoal tracking-tight mt-1">
              Unveil The Invitation
            </h2>
            <div className="w-20 h-0.5 bg-gradient-to-r from-transparent via-[#B76E79] to-transparent mt-3" />
          </div>

          <Envelope onOpenStateChange={(isOpen) => {
            setIsEnvelopeOpen(isOpen);
            if (isOpen && audioRef.current && !isPlayingMusic) {
              audioRef.current.play().then(() => {
                setIsPlayingMusic(true);
              }).catch((err) => {
                console.log('Audio autoplay prevented on envelope open', err);
              });
            }
          }} />
        </section>

        {/* SECTION 3: COUNTDOWN REVEAL & METRIC STATS */}
        <section className="py-12 bg-pearl border border-beige/60 rounded-3xl p-6 sm:p-10 my-8 shadow-inner relative overflow-hidden">
          {/* Subtle floral mesh backdrop */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent opacity-60" />

          <div className="relative text-center space-y-6">
            <div className="flex flex-col items-center">
              <Award className="w-6 h-6 text-[#B76E79] animate-pulse" />
              <span className="font-sans text-[10px] tracking-widest text-[#B76E79] uppercase font-bold mt-2">
                Countdown to the Great Day
              </span>
              <h3 className="font-serif text-2xl font-bold text-charcoal mt-1">
                Every Second brings us Closer
              </h3>
            </div>

            {/* Timers Panel UI */}
            {timeLeft.completed ? (
              <p className="font-serif text-xl text-primary font-bold animate-pulse">
                The Blessed Celebration has started!
              </p>
            ) : (
              <div className="grid grid-cols-4 gap-3 max-w-md mx-auto">
                {[
                  { value: timeLeft.days, label: 'Days' },
                  { value: timeLeft.hours, label: 'Hours' },
                  { value: timeLeft.minutes, label: 'Min' },
                  { value: timeLeft.seconds, label: 'Sec' }
                ].map((item, idx) => (
                  <div 
                    key={idx} 
                    className="bg-[#FDFBF7] border border-beige/50 rounded-2xl p-3 sm:p-4 luxury-card-shadow flex flex-col items-center"
                  >
                    <span className="text-2xl sm:text-3xl font-serif font-bold text-primary leading-tight">
                      {String(item.value).padStart(2, '0')}
                    </span>
                    <span className="text-[9px] sm:text-[10px] font-sans text-charcoal/50 uppercase tracking-widest mt-1">
                      {item.label}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {/* Quick RSVP Quick-Call */}
            <div className="pt-2">
              <button
                onClick={() => setIsRSVPModalOpen(true)}
                className="px-8 py-3.5 bg-primary hover:bg-[#9d5661] text-[#FFF9F4] hover:text-white font-sans font-bold tracking-widest uppercase text-xs rounded-full transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-103 active:scale-97 cursor-pointer"
              >
                RSVP to Share Happiness
              </button>
            </div>
          </div>
        </section>

        {/* SECTION 4: TIMELINE SCHEDULE OF EVENTS */}
        <section className="py-12">
          <Timeline />
        </section>

        {/* SECTION 5: VENUES CARDS DUAL LAYOUT */}
        <section className="py-12 border-t border-beige/35">
          <VenueCards />
        </section>

        {/* SECTION 6: BLESSINGS WALL / GUESTBOOK */}
        <section className="py-12 border-t border-beige/35">
          <Guestbook 
            rsvpsUpdatedTrigger={rsvpsUpdatedTrigger}
            onOpenRSVPRequest={() => setIsRSVPModalOpen(true)}
          />
        </section>

        {/* FOOTER & SIGNATURE NOTE */}
        <footer className="text-center pt-20 pb-10 space-y-6 border-t border-beige/35 relative">
          <div className="flex flex-col items-center space-y-3">
            {/* Custom leaf graphic spacer */}
            <div className="flex items-center gap-2">
              <div className="h-px w-10 bg-[#B76E79]/30" />
              <Heart className="w-4 h-4 text-primary fill-primary" />
              <div className="h-px w-10 bg-[#B76E79]/30" />
            </div>

            {/* Couple Real Photograph */}
            <div className="w-64 h-80 sm:w-72 sm:h-[380px] mx-auto my-3 border-2 border-[#D4AF37]/50 rounded-2xl bg-white p-2.5 shadow-lg overflow-hidden transform hover:scale-[1.02] transition-all duration-300">
              <img 
                src={imageSrc} 
                alt="Ketrolin Sharon & Joyal Christo" 
                className="w-full h-full object-cover rounded-xl shadow-inner"
                referrerPolicy="no-referrer"
                onError={handleImageError}
              />
            </div>

            <p className="font-script text-3xl text-primary">
              Sharing Happiness
            </p>
            <p className="font-sans text-xs tracking-wider text-charcoal/50 leading-relaxed max-w-xs">
              With Love & Blessings, <br />
              <span className="font-semibold text-charcoal/70">Ketrolin Sharon K.R.</span>
            </p>
          </div>

          <p className="text-[10px] font-sans text-charcoal/35 font-light tracking-wide pt-4">
            Designed with Love
          </p>
        </footer>

      </main>

      </div> {/* closes wedding-invite-frame */}

      {/* MODALS */}
      <RSVPModal 
        isOpen={isRSVPModalOpen}
        onClose={() => setIsRSVPModalOpen(false)}
        onSuccessSubmit={handleRSVPSuccess}
      />

    </div>
  );
}
