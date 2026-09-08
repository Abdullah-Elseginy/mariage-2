import React from 'react';

const petals = Array.from({ length: 14 }, (_, index) => ({
  id: index,
  left: `${6 + ((index * 11) % 88)}%`,
  delay: `${(index % 7) * 0.42}s`,
  duration: `${7.5 + (index % 5) * 0.9}s`,
  size: `${9 + (index % 4) * 3}px`,
  drift: `${index % 2 === 0 ? 28 : -28}px`,
}));

const FloatingPetals = () => {
  return (
    <div className="loading-petals" aria-hidden="true">
      {petals.map((petal) => (
        <span
          key={petal.id}
          className="loading-petal"
          style={{
            '--petal-left': petal.left,
            '--petal-delay': petal.delay,
            '--petal-duration': petal.duration,
            '--petal-size': petal.size,
            '--petal-drift': petal.drift,
          }}
        />
      ))}
    </div>
  );
};

export default FloatingPetals;
