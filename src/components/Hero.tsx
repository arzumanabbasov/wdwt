
import { ReactNode } from 'react';
import { Card } from "@/components/ui/card";

interface HeroProps {
  children?: ReactNode;
}

const Hero = ({ children }: HeroProps) => {
  return (
    <div className="relative">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-highlight/10 to-background pointer-events-none -z-10"></div>
      
      {/* Animated globe in background */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-10 pointer-events-none -z-10">
        <svg width="500" height="500" viewBox="0 0 500 500" fill="none" xmlns="http://www.w3.org/2000/svg" className="animate-globe-rotate">
          <circle cx="250" cy="250" r="200" stroke="#6366f1" strokeWidth="2" fill="none"/>
          <ellipse cx="250" cy="250" rx="200" ry="80" stroke="#6366f1" strokeWidth="2" fill="none"/>
          <ellipse cx="250" cy="250" rx="150" ry="200" stroke="#6366f1" strokeWidth="1" fill="none" transform="rotate(45 250 250)"/>
          <ellipse cx="250" cy="250" rx="200" ry="120" stroke="#6366f1" strokeWidth="1" fill="none" transform="rotate(90 250 250)"/>
          <ellipse cx="250" cy="250" rx="180" ry="200" stroke="#6366f1" strokeWidth="1" fill="none" transform="rotate(135 250 250)"/>
        </svg>
      </div>
      
      <div className="container mx-auto px-4 py-16 md:py-24 relative z-10">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-heading mb-6 bg-gradient-to-r from-highlight to-ocean bg-clip-text text-transparent">
            What Does the World Think?
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto">
            A globe-spanning truth explorer powered by AI.<br/>
            See how the world reacts to the same claim.
          </p>
        </div>
        
        <Card className="max-w-4xl mx-auto bg-white/80 backdrop-blur-sm border border-highlight/20 shadow-lg">
          {children}
        </Card>
      </div>
    </div>
  );
};

export default Hero;
