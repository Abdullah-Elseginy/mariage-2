import React from 'react';
import { FiHeart } from 'react-icons/fi';

const Rain = ({ rainParticles }) => {
  return (
    <div className="eid-rain">
      {rainParticles.map((particle) => {
        const style = {
          left: `${particle.left}%`,
          width: particle.type === 'star' ? Math.max(2, particle.size / 6) : particle.size,
          height: particle.type === 'heart' ? 'auto' : particle.type === 'star' ? Math.max(2, particle.size / 6) : particle.size,
          animationDuration: `${particle.duration}s`,
          animationDelay: `${particle.delay}s`,
          transform: `rotate(${particle.rotation}deg)`,
        };
        if (particle.type === 'rose') return <span key={particle.id} className="eid-petal" style={style} />;
        if (particle.type === 'star') return <span key={particle.id} className="eid-star" style={{ ...style, top: `${particle.left * 1.2}%` }} />;
        return <FiHeart key={particle.id} className="eid-heart-fall" style={{ ...style, fontSize: particle.size - 4 }} />;
      })}
    </div>
  );
};

export default Rain;
