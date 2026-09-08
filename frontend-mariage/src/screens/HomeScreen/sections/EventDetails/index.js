import React from 'react';
import { motion } from 'framer-motion';
import { FaLocationArrow, FaMapMarkerAlt, FaTrain } from 'react-icons/fa';
import { BsCalendarHeart, BsClockHistory, BsGeoAlt } from 'react-icons/bs';

const EventDetails = ({ invitation }) => {
  const copy = invitation?.event || {};
  const value = (key) => copy[key] || '';

  if (copy.is_enabled === false) return null;
  if (!copy.title || !copy.date || !copy.venue) return null;

  return (
    <div id="event-details" className="py-20 bg-blush/20 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_15%,rgba(214,177,92,0.12),transparent_28rem),radial-gradient(circle_at_85%_78%,rgba(247,235,210,0.06),transparent_24rem)] pointer-events-none" />
      <div className="container mx-auto px-6 max-w-6xl">
        <div className="text-center mb-10">
          <span className="text-gold/80 uppercase tracking-[0.24em] text-sm font-bold">{value('kicker')}</span>
          <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-4xl md:text-5xl font-serif text-dark mt-3 mb-3">{value('title')}</motion.h2>
          <motion.div initial={{ width: 0 }} whileInView={{ width: '4rem' }} viewport={{ once: true }} transition={{ duration: 0.8, delay: 0.2 }} className="h-1 bg-gold mx-auto rounded-full" />
        </div>

        <div className="grid lg:grid-cols-[0.82fr_1fr] gap-6 items-stretch max-w-5xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }} className="bg-white p-6 md:p-7 rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-champagne/70 flex flex-col relative overflow-hidden group">
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold/70 to-transparent" />
            <div className="flex-1 flex flex-col justify-between gap-6">
              <div>
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-12 h-12 bg-cream rounded-full flex shrink-0 items-center justify-center shadow-sm border border-gold/30"><BsCalendarHeart className="text-2xl text-gold" /></div>
                  <div><span className="text-gold/80 uppercase tracking-[0.2em] text-xs font-bold">{value('day_label')}</span><h3 className="text-3xl md:text-4xl font-serif text-dark mt-3 leading-tight">{value('date')}</h3></div>
                </div>
                {copy.description ? <p className="text-dark/70 leading-relaxed text-sm md:text-base">{value('description')}</p> : null}
              </div>
              {copy.time ? <div className="flex items-center gap-3 text-dark/80 font-medium bg-cream/50 px-4 py-3 rounded-lg border border-champagne/70 text-base"><BsClockHistory className="text-rose text-xl" /><span>{value('time')}</span></div> : null}
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8, delay: 0.2 }} className="bg-white rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-champagne/70 overflow-hidden group">
            <div className="p-6 md:p-7">
              <div className="flex items-start gap-4 min-w-0 mb-5">
                <div className="w-12 h-12 bg-cream rounded-full flex shrink-0 items-center justify-center shadow-sm border border-gold/30"><FaMapMarkerAlt className="text-2xl text-gold" /></div>
                <div className="min-w-0"><span className="text-gold/80 uppercase tracking-[0.2em] text-xs font-bold">{value('venue_label')}</span><h3 className="text-3xl md:text-4xl font-serif text-dark mt-3 mb-2">{value('venue')}</h3>{copy.location ? <p className="text-dark/70 leading-relaxed text-sm md:text-base">{value('location')}</p> : null}</div>
              </div>
              <div className="grid sm:grid-cols-2 gap-3">
                {copy.location ? <div className="flex items-start gap-3 border border-champagne/70 bg-cream/30 rounded-lg p-3"><BsGeoAlt className="text-gold text-lg mt-1 shrink-0" /><div><p className="text-dark font-semibold text-sm">{value('address')}</p><p className="text-dark/65 text-sm leading-relaxed">{value('location')}</p></div></div> : null}
                {copy.landmark_value ? <div className="flex items-start gap-3 border border-champagne/70 bg-cream/30 rounded-lg p-3"><FaTrain className="text-gold text-lg mt-1 shrink-0" /><div><p className="text-dark font-semibold text-sm">{value('landmark')}</p><p className="text-dark/65 text-sm leading-relaxed">{value('landmark_value')}</p></div></div> : null}
              </div>
            </div>
            {copy.map_url ? <div className="p-6 md:p-7 border-t border-dark/5"><a href={copy.map_url} target="_blank" rel="noopener noreferrer" className="w-full inline-flex min-h-12 items-center justify-center px-6 py-3 bg-gold text-cream rounded-lg hover:bg-[#F7EBD2] hover:text-[#0B0A10] hover:shadow-lg hover:shadow-gold/20 transition-all duration-300 font-semibold text-sm uppercase tracking-[0.12em] button-group"><FaLocationArrow className="mr-3 transition-transform duration-300" />{value('open_location')}</a></div> : null}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default EventDetails;
