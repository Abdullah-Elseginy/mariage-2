import React, { useCallback, useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";

const COUNTDOWN_UNITS = [
  ["days", 1000 * 60 * 60 * 24],
  ["hours", 1000 * 60 * 60],
  ["minutes", 1000 * 60],
  ["seconds", 1000],
];

const Countdown = ({ invitation }) => {
  const { t } = useTranslation();
  const copy = invitation?.countdown || {};
  const weddingDate = useMemo(() => new Date(copy.target_date), [copy.target_date]);

  const calculateTimeLeft = useCallback(() => {
    const difference = weddingDate.getTime() - Date.now();

    if (difference <= 0) {
      return {
        isFinished: true,
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
      };
    }

    return {
      isFinished: false,
      days: Math.floor(difference / COUNTDOWN_UNITS[0][1]),
      hours: Math.floor((difference / COUNTDOWN_UNITS[1][1]) % 24),
      minutes: Math.floor((difference / COUNTDOWN_UNITS[2][1]) % 60),
      seconds: Math.floor((difference / COUNTDOWN_UNITS[3][1]) % 60),
    };
  }, [weddingDate]);

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    setTimeLeft(calculateTimeLeft());
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);
    return () => clearInterval(timer);
  }, [calculateTimeLeft]);

  if (copy.is_enabled === false) return null;
  if (!copy.target_date || Number.isNaN(weddingDate.getTime())) return null;

  const timerComponents = COUNTDOWN_UNITS.map(([interval]) => (
    <div
      key={interval}
      className="flex flex-col items-center justify-center w-24 h-24 md:w-32 md:h-32 bg-white rounded-full shadow-lg border-2 border-champagne mx-2 md:mx-4"
    >
      <span className="text-3xl md:text-5xl font-serif text-gold mb-1 text-center min-w-[3rem]">
        {String(timeLeft[interval]).padStart(2, "0")}
      </span>
      <span className="text-xs md:text-sm text-dark uppercase tracking-wider">
        {t(`countdown.units.${interval}`)}
      </span>
    </div>
  ));

  return (
    <div className="py-24 bg-cream relative overflow-hidden flex flex-col items-center">
      <div className="text-center mb-12">
        <h2 className="text-4xl md:text-5xl font-serif text-dark mb-4">
          {copy.title}
        </h2>
        <div className="w-16 h-1 bg-gold mx-auto"></div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 1 }}
        className="flex flex-wrap justify-center items-center gap-y-6"
      >
        {timeLeft.isFinished ? (
          <span className="text-2xl md:text-3xl font-serif text-gold">
            {copy.finished}
          </span>
        ) : (
          timerComponents
        )}
      </motion.div>
    </div>
  );
};

export default Countdown;
