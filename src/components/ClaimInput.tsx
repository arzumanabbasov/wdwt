
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";

interface ClaimInputProps {
  onSubmit: (claim: string) => void;
  isLoading: boolean;
}

const ClaimInput = ({ onSubmit, isLoading }: ClaimInputProps) => {
  const [claim, setClaim] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (claim.trim()) {
      onSubmit(claim.trim());
    }
  };

  const exampleClaims = [
    "Climate change is primarily caused by human activities",
    "Artificial intelligence will eliminate more jobs than it creates",
    "Vaccines are essential for public health",
    "Social media has a negative impact on mental health",
    "Democracy is the best form of government"
  ];

  return (
    <Card className="p-6 bg-white shadow-md">
      <h2 className="text-2xl font-heading font-bold mb-4">What does the world think about...</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <Input
            className="flex-grow text-lg px-4 py-6"
            placeholder="Enter a claim or statement..."
            value={claim}
            onChange={(e) => setClaim(e.target.value)}
            disabled={isLoading}
          />
          <Button 
            type="submit" 
            className="bg-highlight hover:bg-highlight/90 text-white px-8 py-6"
            disabled={isLoading || !claim.trim()}
          >
            {isLoading ? "Analyzing..." : "Analyze"}
          </Button>
        </div>
      </form>
      
      <div className="mt-6">
        <p className="text-sm text-muted-foreground mb-2">Try one of these examples:</p>
        <div className="flex flex-wrap gap-2">
          {exampleClaims.map((example, index) => (
            <button
              key={index}
              className="text-sm bg-secondary px-3 py-1 rounded-full hover:bg-secondary/80 transition-colors"
              onClick={() => setClaim(example)}
              disabled={isLoading}
            >
              {example}
            </button>
          ))}
        </div>
      </div>
    </Card>
  );
};

export default ClaimInput;
