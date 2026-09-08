import React, { useCallback, useMemo } from 'react';
import Particles from 'react-tsparticles';
import { loadSlim } from 'tsparticles-slim';

const GoldenParticles = () => {
  const particlesInit = useCallback(async (engine) => {
    await loadSlim(engine);
  }, []);

  const options = useMemo(
    () => ({
      fullScreen: { enable: false },
      background: { color: 'transparent' },
      detectRetina: true,
      fpsLimit: 45,
      interactivity: {
        events: {
          onHover: { enable: false },
          onClick: { enable: false },
          resize: true,
        },
      },
      particles: {
        number: {
          value: 38,
          density: {
            enable: true,
            area: 900,
          },
        },
        color: {
          value: ['#F7D774', '#D6B15C', '#FFF0B8'],
        },
        opacity: {
          value: { min: 0.18, max: 0.62 },
          animation: {
            enable: true,
            speed: 0.65,
            minimumValue: 0.12,
            sync: false,
          },
        },
        size: {
          value: { min: 1, max: 3 },
          animation: {
            enable: true,
            speed: 1.2,
            minimumValue: 0.6,
            sync: false,
          },
        },
        move: {
          enable: true,
          speed: 0.45,
          direction: 'top',
          random: true,
          straight: false,
          outModes: {
            default: 'out',
          },
        },
        links: {
          enable: false,
        },
        shape: {
          type: 'circle',
        },
      },
    }),
    []
  );

  return (
    <Particles
      id="golden-loading-particles"
      className="loading-particles"
      init={particlesInit}
      options={options}
    />
  );
};

export default GoldenParticles;
