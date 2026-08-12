import React from 'react';

export const AmbientBackground: React.FC = () => {
  return (
    <div className="fixed inset-0 z-0 overflow-hidden bg-black pointer-events-none">
      <video
        autoPlay
        loop
        muted
        playsInline
        className="w-full h-full object-cover opacity-80"
        style={{ filter: 'grayscale(100%) contrast(1.1) brightness(0.9)' }}
      >
        <source src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260315_073750_51473149-4350-4920-ae24-c8214286f323.mp4" type="video/mp4" />
      </video>
    </div>
  );
};
