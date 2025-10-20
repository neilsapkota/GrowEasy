import React from 'react';

const AuroraBackground: React.FC = () => {
  return (
    <>
      <div className="aurora-background"></div>
      <style>{`
        .aurora-background {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: -1; /* Places it behind all other content */
          background: linear-gradient(
            45deg,
            #6a9db7,
            #a186d0,
            #6d7f78,
            #d089b7,
            #4c80b2,
            #7f3b6f,
            #506d58,
            #ab78cc
          );
          background-size: 400% 400%;
          animation: auroraFlow 16s ease-in-out infinite;
        }

        @keyframes auroraFlow {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .aurora-background {
            animation: none;
          }
        }
      `}</style>
    </>
  );
};

export default AuroraBackground;
