import React from 'react';
import { motion } from 'framer-motion';

const LoveStory = ({ invitation }) => {
  const copy = invitation?.love_story || {};
  const timelineEvents = copy.events || [];

  if (copy.is_enabled === false) return null;
  if (!copy.title || !timelineEvents.length) return null;

  return (
    <section id="love-story" className="py-24 bg-[#100E16] relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_18%,rgba(214,177,92,0.12),transparent_28rem),radial-gradient(circle_at_82%_70%,rgba(154,119,184,0.13),transparent_24rem)]" />
      <div className="container mx-auto px-6 max-w-6xl relative">
        <div className="text-center mb-16">
          <span className="text-gold/80 uppercase tracking-[0.24em] text-sm font-bold">{copy.kicker}</span>
          <h2 className="text-4xl md:text-6xl font-serif text-dark mt-3 mb-5">{copy.title}</h2>
          <div className="w-20 h-px bg-gold/70 mx-auto"></div>
        </div>

        <div className="relative">
          <div className="hidden md:block absolute left-1/2 top-0 h-full w-px bg-gradient-to-b from-transparent via-gold/45 to-transparent" />

          {timelineEvents.map((event, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 34 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
              className={`relative mb-8 md:mb-10 flex ${index % 2 === 0 ? 'md:justify-start' : 'md:justify-end'}`}
            >
              <div className="absolute left-0 top-7 h-px w-6 bg-gold/40 md:left-1/2 md:-translate-x-1/2 md:w-12" />
              <div className="absolute left-6 top-4 grid h-8 w-8 place-items-center border border-gold/70 bg-[#17101A] text-gold shadow-[0_0_24px_rgba(214,177,92,0.18)] md:left-1/2 md:-translate-x-1/2">
                <span className="text-xs font-bold">{String(index + 1).padStart(2, '0')}</span>
              </div>

              <div className={`w-full pl-16 md:w-[43%] md:pl-0 ${index % 2 === 0 ? 'md:pr-16 md:text-right' : 'md:pl-16 md:text-left'}`}>
                <div className="group relative overflow-hidden border border-champagne/80 bg-[#17101A]/90 p-6 md:p-7 shadow-[0_24px_60px_rgba(0,0,0,0.28)] transition-transform duration-300 hover:-translate-y-1">
                  <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold/60 to-transparent" />
                  <span className="inline-flex border border-gold/40 bg-gold/10 px-3 py-1 text-sm font-bold tracking-wider text-gold">
                    {event.date}
                  </span>
                  <h3 className="mt-4 text-2xl md:text-3xl font-serif text-dark">{event.title}</h3>
                  <p className="mt-3 text-dark/70 leading-relaxed">{event.desc}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default LoveStory;
