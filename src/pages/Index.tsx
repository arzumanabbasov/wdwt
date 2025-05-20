
import { useState } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { usePerplexityApi } from '../hooks/usePerplexityApi';
import { ClaimResult, CountryAnalysis, ApiKeyState } from '../types';

import Hero from '../components/Hero';
import ApiKeyInput from '../components/ApiKeyInput';
import ClaimInput from '../components/ClaimInput';
import WorldMap from '../components/WorldMap';
import ResultSummary from '../components/ResultSummary';
import CountryResultCard from '../components/CountryResultCard';

const Index = () => {
  const [apiKeyState, setApiKeyState] = useLocalStorage<ApiKeyState>('perplexity-api-key', {
    hasKey: false,
    key: null
  });
  
  const [result, setResult] = useState<ClaimResult | null>(null);
  const [selectedCountry, setSelectedCountry] = useState<CountryAnalysis | null>(null);
  
  const { analyzeClaimWithPerplexity, isLoading, error } = usePerplexityApi();
  
  const handleSaveApiKey = (key: string) => {
    setApiKeyState({
      hasKey: true,
      key: key
    });
  };
  
  const handleAnalyzeClaim = async (claim: string) => {
    if (!apiKeyState.key) return;
    
    try {
      const result = await analyzeClaimWithPerplexity(claim, apiKeyState.key);
      if (result) {
        // Make sure countryAnalysis is always at least an empty array
        const resultWithSafeData = {
          ...result,
          countryAnalysis: result.countryAnalysis || []
        };
        setResult(resultWithSafeData);
        setSelectedCountry(null); // Reset selected country
      }
    } catch (err) {
      console.error("Error analyzing claim:", err);
    }
  };
  
  const handleCountryClick = (country: CountryAnalysis) => {
    setSelectedCountry(country);
  };
  
  // If user hasn't entered API key, show the API key input screen
  if (!apiKeyState.hasKey) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <ApiKeyInput onSaveKey={handleSaveApiKey} />
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-background">
      <Hero>
        <ClaimInput onSubmit={handleAnalyzeClaim} isLoading={isLoading} />
      </Hero>
      
      <div className="container mx-auto px-4 py-8 space-y-8">
        {isLoading && (
          <div className="flex flex-col items-center justify-center p-12">
            <div className="relative w-20 h-20">
              <svg className="animate-spin" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path 
                  className="opacity-75" 
                  fill="currentColor" 
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
            </div>
            <p className="mt-4 text-lg font-medium">Analyzing global perspectives...</p>
            <p className="text-sm text-muted-foreground">This may take a minute as we consult AI analysis</p>
          </div>
        )}
        
        {error && !isLoading && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-md">
            <h3 className="font-bold">Error</h3>
            <p>{error}</p>
          </div>
        )}
        
        {result && !isLoading && (
          <div className="space-y-12">
            <ResultSummary result={result} />
            
            <div>
              <h2 className="text-3xl font-heading font-bold mb-6">
                Global Perspective Map
              </h2>
              {result.countryAnalysis && result.countryAnalysis.length > 0 ? (
                <>
                  <WorldMap 
                    countries={result.countryAnalysis} 
                    onCountryClick={handleCountryClick}
                  />
                  <div className="flex justify-center gap-8 mt-4">
                    <div className="flex items-center gap-2">
                      <span className="w-4 h-4 inline-block bg-agree rounded-sm"></span>
                      <span>Agree</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-4 h-4 inline-block bg-mixed rounded-sm"></span>
                      <span>Mixed</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-4 h-4 inline-block bg-disagree rounded-sm"></span>
                      <span>Disagree</span>
                    </div>
                  </div>
                </>
              ) : (
                <div className="bg-muted p-4 rounded-md text-center">
                  <p>No country data available for this claim.</p>
                </div>
              )}
            </div>
            
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-heading font-bold">
                  {selectedCountry 
                    ? `${selectedCountry.countryName} Analysis` 
                    : "Country Breakdown"
                  }
                </h2>
              </div>
              
              {selectedCountry ? (
                <div className="max-w-2xl mx-auto">
                  <CountryResultCard country={selectedCountry} />
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {result.countryAnalysis && result.countryAnalysis.length > 0 ? (
                    result.countryAnalysis.map((country, index) => (
                      <CountryResultCard key={index} country={country} />
                    ))
                  ) : (
                    <div className="col-span-full text-center p-4">
                      <p>No country analysis data available.</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
        
        {!result && !isLoading && (
          <div className="text-center py-12">
            <h2 className="text-xl font-medium text-muted-foreground">
              Enter a claim above to see what the world thinks
            </h2>
          </div>
        )}
      </div>
      
      <footer className="bg-secondary mt-20 py-8">
        <div className="container mx-auto px-4 text-center">
          <p className="text-muted-foreground">
            What Does the World Think? — A globe-spanning truth explorer powered by AI
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            Using Perplexity AI for analysis. All claims are analyzed based on available data.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
