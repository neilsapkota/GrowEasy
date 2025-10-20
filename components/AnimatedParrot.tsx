import React, { useState, useEffect, useRef } from 'react';

interface AnimatedParrotProps {
  onHoverTarget?: boolean;
}

const AnimatedParrot: React.FC<AnimatedParrotProps> = ({ onHoverTarget = false }) => {
  const [position, setPosition] = useState({ x: -100, y: 20 });
  const [isFlying, setIsFlying] = useState(false);
  const [wingRotation, setWingRotation] = useState(0);
  const [feathers, setFeathers] = useState<Array<{ id: number; x: number; y: number; opacity: number }>>([]);
  const parrotRef = useRef<HTMLDivElement>(null);
  const featherIdRef = useRef(0);

  useEffect(() => {
    const enterAnimation = setTimeout(() => {
      setIsFlying(true);
      setPosition({ x: 10, y: 20 });

      setTimeout(() => {
        setIsFlying(false);
      }, 2000);
    }, 500);

    return () => clearTimeout(enterAnimation);
  }, []);

  useEffect(() => {
    const wingInterval = setInterval(() => {
      setWingRotation(prev => (prev + 15) % 360);
    }, 100);

    return () => clearInterval(wingInterval);
  }, []);

  useEffect(() => {
    if (isFlying) {
      const featherInterval = setInterval(() => {
        const newFeather = {
          id: featherIdRef.current++,
          x: position.x + Math.random() * 30 - 15,
          y: position.y + Math.random() * 30 - 15,
          opacity: 0.8
        };
        setFeathers(prev => [...prev, newFeather]);

        setTimeout(() => {
          setFeathers(prev => prev.filter(f => f.id !== newFeather.id));
        }, 2000);
      }, 200);

      return () => clearInterval(featherInterval);
    }
  }, [isFlying, position]);

  useEffect(() => {
    if (onHoverTarget) {
      setIsFlying(true);
      setPosition({ x: 60, y: 50 });

      const resetTimer = setTimeout(() => {
        setIsFlying(false);
      }, 1000);

      return () => clearTimeout(resetTimer);
    }
  }, [onHoverTarget]);

  useEffect(() => {
    const randomMovement = setInterval(() => {
      if (!isFlying && !onHoverTarget) {
        const movements = [
          { x: 10, y: 20 },
          { x: 15, y: 25 },
          { x: 5, y: 15 },
          { x: 20, y: 30 }
        ];
        const randomMove = movements[Math.floor(Math.random() * movements.length)];
        setPosition(randomMove);
      }
    }, 5000);

    return () => clearInterval(randomMovement);
  }, [isFlying, onHoverTarget]);

  const wingFlap = isFlying ? Math.sin(wingRotation * Math.PI / 180) * 20 : 0;

  return (
    <>
      {feathers.map(feather => (
        <div
          key={feather.id}
          className="absolute pointer-events-none"
          style={{
            left: `${feather.x}%`,
            top: `${feather.y}%`,
            opacity: feather.opacity,
            animation: 'featherFall 2s ease-out forwards'
          }}
        >
          <svg width="20" height="20" viewBox="0 0 20 20">
            <path
              d="M10 2 Q 15 10, 10 18 Q 5 10, 10 2 Z"
              fill="#38bdf8"
              opacity="0.6"
            />
          </svg>
        </div>
      ))}

      <div
        ref={parrotRef}
        className="absolute z-20 pointer-events-none"
        style={{
          left: `${position.x}%`,
          top: `${position.y}%`,
          transition: isFlying ? 'all 2s cubic-bezier(0.4, 0, 0.2, 1)' : 'all 0.5s ease-in-out',
          transform: `translate(-50%, -50%) ${isFlying ? 'rotate(-5deg)' : 'rotate(0deg)'}`
        }}
      >
        <svg
          width="120"
          height="120"
          viewBox="0 0 200 200"
          xmlns="http://www.w3.org/2000/svg"
          style={{
            filter: 'drop-shadow(2px 4px 6px rgba(0, 0, 0, 0.3))'
          }}
        >
          <defs>
            <linearGradient id="parrot-body-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#38bdf8" />
              <stop offset="100%" stopColor="#34d399" />
            </linearGradient>
          </defs>

          <g>
            <ellipse cx="100" cy="110" rx="45" ry="60" fill="url(#parrot-body-gradient)" />

            <circle cx="100" cy="60" r="35" fill="#6366f1" />

            <path d="M 75 60 C 50 60, 60 85, 75 75 Z" fill="#facc15" />

            <circle cx="110" cy="55" r="10" fill="white" />
            <circle cx="112" cy="55" r="5" fill="black">
              <animate
                attributeName="cy"
                values="55;57;55"
                dur="3s"
                repeatCount="indefinite"
              />
            </circle>

            <path d="M 95 25 Q 100 10, 105 25" stroke="#f472b6" strokeWidth="6" fill="none" strokeLinecap="round" />
            <path d="M 100 25 Q 105 10, 110 25" stroke="#ec4899" strokeWidth="6" fill="none" strokeLinecap="round" />

            <g transform={`rotate(${wingFlap}, 110, 100)`}>
              <path d="M 110 100 A 40 40 0 0 1 140 140 L 120 130 Z" fill="#10b981" />
            </g>

            <path d="M 80 165 L 60 195 L 70 190 Z" fill="#ef4444" />
            <path d="M 90 168 L 80 198 L 90 195 Z" fill="#f97316" />
          </g>
        </svg>
      </div>

      <style>{`
        @keyframes featherFall {
          0% {
            transform: translateY(0) rotate(0deg);
            opacity: 0.8;
          }
          100% {
            transform: translateY(100px) rotate(360deg);
            opacity: 0;
          }
        }
      `}</style>
    </>
  );
};

export default AnimatedParrot;
