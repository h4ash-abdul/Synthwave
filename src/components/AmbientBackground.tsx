import React from 'react';
import { useTheme } from '../contexts/ThemeContext';

export const AmbientBackground: React.FC = () => {
  const { theme } = useTheme();

  return (
    <div className="fixed inset-0 z-0 overflow-hidden bg-[#021812] pointer-events-none">
      <video
        autoPlay
        loop
        muted
        playsInline
        className="w-full h-full object-cover opacity-90"
        style={{ filter: 'contrast(1.15) saturate(1.2) brightness(0.95)', willChange: 'transform', transform: 'translateZ(0)' }}
      >
        <source src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260315_073750_51473149-4350-4920-ae24-c8214286f323.mp4" type="video/mp4" />
      </video>
      


      {/* Dynamic Color Atmosphere - Even Full Screen Tint */}
      <div 
        className="absolute inset-0 pointer-events-none mix-blend-color"
        style={{
          backgroundColor: theme?.primary || '#10b981',
          opacity: 0.35,
          transition: 'background-color 2s ease-in-out'
        }}
      />
      
      {/* Dynamic Color Atmosphere - Subtle Overlay Glow */}
      <div 
        className="absolute inset-0 pointer-events-none mix-blend-screen"
        style={{
          backgroundColor: theme?.secondary || '#047857',
          opacity: 0.15,
          transition: 'background-color 2s ease-in-out'
        }}
      />

      {/* Vignette Overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.6)_100%)] pointer-events-none" />
    </div>
  );
};
