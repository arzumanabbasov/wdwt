
import { useState } from 'react';
import { ClaimResult, PerplexityResponse } from '../types';
import { toast } from 'sonner';

export const usePerplexityApi = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const analyzeClaimWithPerplexity = async (
    claim: string,
    apiKey: string
  ): Promise<ClaimResult | null> => {
    setIsLoading(true);
    setError(null);

    try {
      const prompt = `
      Analyze this claim globally: "${claim}"
      
      I need a structured analysis of how different countries around the world would likely respond to this claim based on their media, cultural values, and political climate.

      Please analyze this claim for ALL United Nations member states (192 countries), with special attention to:
      
      North America: USA, Canada, Mexico
      South America: Brazil, Argentina, Colombia, Chile, Peru, Venezuela
      Europe: UK, France, Germany, Italy, Spain, Sweden, Poland, Netherlands, Belgium, Switzerland, Norway, Denmark, Finland, Greece, Portugal, Ireland, Austria
      Asia: China, Japan, India, South Korea, Indonesia, Singapore, Thailand, Vietnam, Philippines, Malaysia, Taiwan
      Middle East: Saudi Arabia, UAE, Israel, Turkey, Iran, Qatar, Egypt
      Africa: South Africa, Nigeria, Egypt, Kenya, Morocco, Ethiopia, Ghana, Tanzania, Uganda, Senegal
      Oceania: Australia, New Zealand, Papua New Guinea, Fiji

      For each country, determine:
      1. If the country would generally AGREE, DISAGREE, or have MIXED opinions about the claim
      2. A 1-2 sentence summary of the country's perspective
      3. Any relevant cultural context tags

      Also provide:
      - A global "truth index" score from 0-100 indicating how globally agreed-upon this claim is
      - A one-paragraph summary of the global consensus

      Format your response as structured JSON that I can parse programmatically.
      `;

      console.log("Sending prompt to Perplexity API:", prompt);

      const response = await fetch('https://api.perplexity.ai/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: 'llama-3.1-sonar-small-128k-online',
          messages: [
            {
              role: 'system',
              content: 'You are an expert at analyzing global perspectives on claims. Provide responses in clean JSON format only with this structure: { "globalTruthIndex": number, "globalConsensusSummary": string, "countries": [{ "countryName": string, "stance": "agree"|"disagree"|"mixed", "summary": string, "culturalContext": string[] }] }'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          temperature: 0.2,
          top_p: 0.9,
          max_tokens: 8000, // Increased token limit to accommodate all countries
          return_images: false,
          return_related_questions: false,
          search_domain_filter: [],
          search_recency_filter: 'month'
        })
      });

      if (!response.ok) {
        throw new Error(`API request failed with status: ${response.status}`);
      }

      const data = await response.json() as PerplexityResponse;
      console.log("Perplexity API response:", data);
      
      // Extract the JSON string from the response content
      const contentText = data.choices[0].message.content;
      
      // Try to find and parse the JSON portion
      let jsonMatch = contentText.match(/```json\s*([\s\S]*?)\s*```/);
      let parsedResult: any = null;
      
      if (jsonMatch) {
        try {
          parsedResult = JSON.parse(jsonMatch[1]);
          console.log("Successfully parsed JSON from code block", parsedResult);
        } catch (e) {
          console.error("Failed to parse JSON from code block:", jsonMatch[1]);
          throw new Error("Failed to parse JSON from Perplexity response");
        }
      } else {
        // If no JSON code block, try to parse the entire response
        try {
          parsedResult = JSON.parse(contentText);
          console.log("Successfully parsed JSON from entire content", parsedResult);
        } catch (e) {
          console.error("Failed to parse response as JSON:", contentText);
          throw new Error("Received malformed response from AI");
        }
      }
      
      // Transform the response data if needed to match our ClaimResult type
      const result: ClaimResult = {
        claim: claim,
        truthIndex: parsedResult.globalTruthIndex || parsedResult.global_truth_index || parsedResult.truthIndex || 50,
        globalConsensus: parsedResult.globalConsensusSummary || parsedResult.global_consensus_summary || parsedResult.globalConsensus || "",
        countryAnalysis: (parsedResult.countries || parsedResult.countryAnalysis || []).map((country: any) => ({
          countryCode: country.countryCode || country.country_code || "",
          countryName: country.countryName || country.country || "",
          stance: (country.stance || country.agreement || "mixed").toLowerCase(),
          confidence: country.confidence || 50,
          summary: country.summary || "",
          headlines: country.headlines ? country.headlines.map((headline: any) => {
            if (typeof headline === "string") {
              return {
                title: headline,
                source: "",
                url: "",
                stance: "unknown",
                date: new Date().toISOString()
              };
            }
            return {
              title: headline?.title || "",
              source: headline?.source || "",
              url: headline?.url || "",
              stance: headline?.stance || "unknown",
              date: headline?.date || new Date().toISOString()
            };
          }) : [],
          culturalContext: country.culturalContextTags || country.cultural_context_tags || country.culturalContext || []
        })),
        timestamp: new Date().toISOString()
      };
      
      console.log("Transformed result:", result);
      
      // Check if we actually have country data
      if (!result.countryAnalysis || result.countryAnalysis.length === 0) {
        console.warn("No country data received from API");
        toast.warning("Analysis completed but no country data was returned");
      } else {
        toast.success(`Analysis completed for ${result.countryAnalysis.length} countries`);
      }
      
      return result;
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
      setError(errorMessage);
      toast.error(`Error analyzing claim: ${errorMessage}`);
      console.error('Error analyzing claim:', err);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    analyzeClaimWithPerplexity,
    isLoading,
    error
  };
};
