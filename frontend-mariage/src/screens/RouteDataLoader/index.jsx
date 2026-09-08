import React from 'react';
import Lottie from 'lottie-react';
import loveIsBlind from '../../assets/Lottie/Love is blind.json';

const RouteDataLoader = ({ error }) => (
  <main className="fixed inset-0 z-[120] grid place-items-center bg-[#08060b] px-5 text-center text-[#F7EBD2]">
    {error ? (
      <p className="max-w-xl text-base font-medium leading-7 text-[#F7EBD2] sm:text-lg">{error}</p>
    ) : (
      <Lottie animationData={loveIsBlind} loop className="h-64 w-64 sm:h-80 sm:w-80" />
    )}
  </main>
);

export default RouteDataLoader;
