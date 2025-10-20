import React, { useState, useEffect, useRef } from 'react';

interface AnimatedParrotProps {
  onHoverTarget?: boolean;
}

interface Position {
  x: number;
  y: number;
  rotation: number;
}

const AnimatedParrot: React.FC<AnimatedParrotProps> = ({ onHoverTarget = false }) => {
  const [position, setPosition] = useState<Position>({ x: -15, y: 50, rotation: 0 });
  const [isFlying, setIsFlying] = useState(false);
  const [wingPhase, setWingPhase] = useState(0);
  const [feathers, setFeathers] = useState<Array<{ id: number; x: number; y: number; opacity: number }>>([]);
  const parrotRef = useRef<HTMLDivElement>(null);
  const featherIdRef = useRef(0);
  const flightTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const enterAnimation = setTimeout(() => {
      setIsFlying(true);
      setPosition({ x: 15, y: 25, rotation: -5 });

      setTimeout(() => {
        setIsFlying(false);
        setPosition(prev => ({ ...prev, rotation: 0 }));
      }, 2500);
    }, 800);

    return () => clearTimeout(enterAnimation);
  }, []);

  useEffect(() => {
    const wingInterval = setInterval(() => {
      setWingPhase(prev => (prev + 1) % 360);
    }, 50);

    return () => clearInterval(wingInterval);
  }, []);

  useEffect(() => {
    if (isFlying) {
      const featherInterval = setInterval(() => {
        const newFeather = {
          id: featherIdRef.current++,
          x: position.x + Math.random() * 8 - 4,
          y: position.y + Math.random() * 8 - 4,
          opacity: 0.7
        };
        setFeathers(prev => [...prev, newFeather]);

        setTimeout(() => {
          setFeathers(prev => prev.filter(f => f.id !== newFeather.id));
        }, 2500);
      }, 300);

      return () => clearInterval(featherInterval);
    }
  }, [isFlying, position]);

  useEffect(() => {
    if (onHoverTarget && !isFlying) {
      setIsFlying(true);
      setPosition({ x: 35, y: 55, rotation: 5 });

      const resetTimer = setTimeout(() => {
        setIsFlying(false);
        setPosition(prev => ({ ...prev, rotation: 0 }));
      }, 1500);

      return () => clearTimeout(resetTimer);
    }
  }, [onHoverTarget]);

  useEffect(() => {
    const scheduleRandomFlight = () => {
      const delay = 7000 + Math.random() * 8000;

      flightTimeoutRef.current = setTimeout(() => {
        if (!isFlying && !onHoverTarget) {
          setIsFlying(true);

          const flightPaths: Position[] = [
            { x: 80, y: 20, rotation: -8 },
            { x: 70, y: 40, rotation: 5 },
            { x: 25, y: 35, rotation: -3 },
            { x: 60, y: 60, rotation: 7 },
            { x: 15, y: 25, rotation: -5 }
          ];

          const randomPath = flightPaths[Math.floor(Math.random() * flightPaths.length)];
          setPosition(randomPath);

          setTimeout(() => {
            setIsFlying(false);
            setPosition(prev => ({ ...prev, rotation: 0 }));
            scheduleRandomFlight();
          }, 3000);
        } else {
          scheduleRandomFlight();
        }
      }, delay);
    };

    scheduleRandomFlight();

    return () => {
      if (flightTimeoutRef.current) {
        clearTimeout(flightTimeoutRef.current);
      }
    };
  }, [isFlying, onHoverTarget]);

  const wingFlap = isFlying
    ? Math.sin(wingPhase * Math.PI / 180) * 25
    : Math.sin(wingPhase * Math.PI / 180) * 8;

  return (
    <>
      {feathers.map(feather => (
        <div
          key={feather.id}
          className="absolute pointer-events-none z-10"
          style={{
            left: `${feather.x}%`,
            top: `${feather.y}%`,
            opacity: feather.opacity,
            animation: 'featherDrift 2.5s ease-out forwards'
          }}
        >
          <svg width="16" height="16" viewBox="0 0 20 20">
            <path
              d="M10 2 Q 14 10, 10 18 Q 6 10, 10 2 Z"
              fill="#6366f1"
              opacity="0.5"
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
          transition: isFlying
            ? 'all 3s cubic-bezier(0.34, 1.56, 0.64, 1)'
            : 'all 0.8s ease-out',
          transform: `translate(-50%, -50%) rotate(${position.rotation}deg)`
        }}
      >
        <svg
          width="100"
          height="100"
          viewBox="0 0 200 200"
          xmlns="http://www.w3.org/2000/svg"
          style={{
            filter: 'drop-shadow(3px 5px 8px rgba(0, 0, 0, 0.4))'
          }}
        >
          <defs>
            <linearGradient id="parrot-body-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#38bdf8" />
              <stop offset="50%" stopColor="#6366f1" />
              <stop offset="100%" stopColor="#34d399" />
            </linearGradient>
            <linearGradient id="parrot-head-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#8b5cf6" />
              <stop offset="100%" stopColor="#6366f1" />
            </linearGradient>
          </defs>

          <g>
            <ellipse cx="100" cy="110" rx="45" ry="60" fill="url(#parrot-body-gradient)" />

            <circle cx="100" cy="60" r="35" fill="url(#parrot-head-gradient)" />

            <path d="M 75 60 C 50 60, 60 85, 75 75 Z" fill="#facc15" />

            <circle cx="110" cy="55" r="10" fill="white" />
            <circle cx="112" cy="55" r="5" fill="black">
              <animate
                attributeName="cy"
                values="55;57;55"
                dur="4s"
                repeatCount="indefinite"
              />
            </circle>

            <path d="M 95 25 Q 100 10, 105 25" stroke="#f472b6" strokeWidth="6" fill="none" strokeLinecap="round" />
            <path d="M 100 25 Q 105 10, 110 25" stroke="#ec4899" strokeWidth="6" fill="none" strokeLinecap="round" />

            <g
              transform={`rotate(${wingFlap}, 110, 100)`}
              style={{
                transition: 'transform 0.05s ease-out'
              }}
            >
              <path d="M 110 100 A 40 40 0 0 1 140 140 L 120 130 Z" fill="#10b981" opacity="0.9" />
              <path d="M 112 105 A 35 35 0 0 1 135 135 L 118 128 Z" fill="#34d399" opacity="0.7" />
            </g>

            <path d="M 80 165 L 60 195 L 70 190 Z" fill="#ef4444" />
            <path d="M 90 168 L 80 198 L 90 195 Z" fill="#f97316" />
            <path d="M 85 166 L 70 196 L 80 193 Z" fill="#fb923c" />
          </g>
        </svg>
      </div>

      <style>{`
        @keyframes featherDrift {
          0% {
            transform: translateY(0) translateX(0) rotate(0deg) scale(1);
            opacity: 0.7;
          }
          50% {
            transform: translateY(50px) translateX(20px) rotate(180deg) scale(0.8);
            opacity: 0.4;
          }
          100% {
            transform: translateY(120px) translateX(-10px) rotate(360deg) scale(0.5);
            opacity: 0;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          @keyframes featherDrift {
            0%, 100% {
              opacity: 0;
            }
          }
        }
      `}</style>
    </>
  );
};

export default AnimatedParrot;
