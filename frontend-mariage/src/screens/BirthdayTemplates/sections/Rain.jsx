import React from 'react';

const Rain = ({ rainParticles }) => {
  return (
    <>
      {/* Falling particles */}
      <div className="pointer-events-none fixed inset-0 z-10 overflow-hidden select-none">
        {rainParticles.map((pt) => {
          if (pt.type === 'rose') {
            return (
              <div
                key={pt.id}
                className="petal absolute"
                style={{
                  left: `${pt.left}%`,
                  top: `-40px`,
                  width: `${pt.size}px`,
                  height: `${pt.size}px`,
                  animation: `float-petal ease-in-out infinite`,
                  animationDuration: `${pt.duration}s`,
                  animationDelay: `${pt.delay}s`,
                  opacity: 0.8,
                  transform: `rotate(${pt.rotation}deg)`
                }}
              />
            );
          } else if (pt.type === 'star') {
            return (
              <div
                key={pt.id}
                className="star-shimmer absolute"
                style={{
                  left: `${pt.left}%`,
                  top: `${pt.left * 1.3 + Math.sin(pt.delay) * 20}%`,
                  width: `${Math.max(2, pt.size / 6)}px`,
                  height: `${Math.max(2, pt.size / 6)}px`,
                  animation: `shimmer infinite alternate`,
                  animationDuration: `${pt.duration / 3}s`,
                  animationDelay: `${pt.delay}s`,
                  opacity: Math.random() * 0.7 + 0.3
                }}
              />
            );
          } else {
            return (
              <div
                key={pt.id}
                className="absolute text-rose-500/25 select-none"
                style={{
                  left: `${pt.left}%`,
                  top: `-20px`,
                  fontSize: `${pt.size - 4}px`,
                  animation: `float-petal ease-in-out infinite`,
                  animationDuration: `${pt.duration + 2}s`,
                  animationDelay: `${pt.delay}s`,
                  opacity: 0.45
                }}
              >
                ❤️
              </div>
            );
          }
        })}
      </div>

      {/* Embedded dynamic float-petal custom keyframe overrides for CSS engine */}
      <style>{`
        @keyframes float-petal {
          0% {
            transform: translateY(-5vh) rotate(0deg) translateX(0);
            opacity: 0;
          }
          10% {
            opacity: 0.8;
          }
          90% {
            opacity: 0.5;
          }
          100% {
            transform: translateY(105vh) rotate(320deg) translateX(30px);
            opacity: 0;
          }
        }
      `}</style>
    </>
  );
};

export default Rain;
