import React from 'react';

const AuroraBackground: React.FC = () => {
  return (
    <>
      <div className="aurora-container">
        <div className="aurora-gradient"></div>
        <div className="aurora-overlay"></div>
      </div>

      <style>{`
        .aurora-container {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          overflow: hidden;
          z-index: 0;
        }

        .aurora-gradient {
          position: absolute;
          top: -50%;
          left: -50%;
          width: 200%;
          height: 200%;
          background: linear-gradient(
            45deg,
            #1e3a8a 0%,
            #6366f1 15%,
            #8b5cf6 30%,
            #ec4899 45%,
            #10b981 60%,
            #3b82f6 75%,
            #1e3a8a 100%
          );
          background-size: 400% 400%;
          animation: auroraFlow 20s ease-in-out infinite;
          opacity: 0.6;
          filter: blur(60px);
        }

        .aurora-overlay {
          position: absolute;
          top: -50%;
          left: -50%;
          width: 200%;
          height: 200%;
          background: radial-gradient(
            circle at 30% 50%,
            rgba(99, 102, 241, 0.3) 0%,
            transparent 50%
          ),
          radial-gradient(
            circle at 70% 50%,
            rgba(139, 92, 246, 0.3) 0%,
            transparent 50%
          ),
          radial-gradient(
            circle at 50% 70%,
            rgba(16, 185, 129, 0.2) 0%,
            transparent 50%
          );
          animation: auroraFlow 15s ease-in-out infinite reverse;
          opacity: 0.8;
          filter: blur(40px);
        }

        @keyframes auroraFlow {
          0% {
            transform: translate(0, 0) rotate(0deg);
          }
          33% {
            transform: translate(-10%, 10%) rotate(5deg);
          }
          66% {
            transform: translate(10%, -5%) rotate(-5deg);
          }
          100% {
            transform: translate(0, 0) rotate(0deg);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .aurora-gradient,
          .aurora-overlay {
            animation: none;
          }
        }
      `}</style>
    </>
  );
};

export default AuroraBackground;
