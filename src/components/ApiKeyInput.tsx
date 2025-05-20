
import { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface ApiKeyInputProps {
  onSaveKey: (key: string) => void;
}

const ApiKeyInput = ({ onSaveKey }: ApiKeyInputProps) => {
  const [apiKey, setApiKey] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (apiKey.trim()) {
      onSaveKey(apiKey.trim());
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto animate-fade-in">
      <CardHeader>
        <CardTitle className="text-2xl font-heading">Welcome to World Think</CardTitle>
        <CardDescription>
          To analyze claims globally, you'll need a Perplexity API key
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="apikey" className="text-sm font-medium">
              Perplexity API Key
            </label>
            <Input
              id="apikey"
              type="password"
              placeholder="pk-..."
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="w-full"
            />
            <p className="text-xs text-muted-foreground">
              Your API key is stored locally in your browser and never sent to our servers.
              <br />
              <a 
                href="https://docs.perplexity.ai/docs/getting-started" 
                target="_blank" 
                rel="noopener noreferrer"
                className="underline text-highlight"
              >
                Get a key from Perplexity
              </a>
            </p>
          </div>
          <Button 
            type="submit" 
            className="w-full bg-highlight hover:bg-highlight/90"
            disabled={!apiKey.trim()}
          >
            Save API Key
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default ApiKeyInput;
