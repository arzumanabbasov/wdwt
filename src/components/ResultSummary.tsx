
import { ClaimResult } from "../types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface ResultSummaryProps {
  result: ClaimResult;
}

const ResultSummary = ({ result }: ResultSummaryProps) => {
  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getTruthLabel = (truthIndex: number) => {
    if (truthIndex >= 80) return "Highly Agreed Upon";
    if (truthIndex >= 60) return "Mostly Agreed Upon";
    if (truthIndex >= 40) return "Mixed Global Opinions";
    if (truthIndex >= 20) return "Mostly Contested";
    return "Highly Contested";
  };
  
  const getTruthColor = (truthIndex: number) => {
    if (truthIndex >= 80) return "text-agree";
    if (truthIndex >= 60) return "text-green-500";
    if (truthIndex >= 40) return "text-yellow-500";
    if (truthIndex >= 20) return "text-orange-500";
    return "text-disagree";
  };

  // Safe country counting with null checking
  const getCountByStance = (stance: string): number => {
    if (!result.countryAnalysis) return 0;
    return result.countryAnalysis.filter(c => c.stance === stance).length;
  };

  const totalCountries = result.countryAnalysis?.length || 0;
  const agreeCount = getCountByStance('agree');
  const mixedCount = getCountByStance('mixed');
  const disagreeCount = getCountByStance('disagree');
  
  // Calculate percentages for better visual representation
  const agreePercent = totalCountries > 0 ? Math.round((agreeCount / totalCountries) * 100) : 0;
  const mixedPercent = totalCountries > 0 ? Math.round((mixedCount / totalCountries) * 100) : 0;
  const disagreePercent = totalCountries > 0 ? Math.round((disagreeCount / totalCountries) * 100) : 0;

  return (
    <Card className="animate-fade-in">
      <CardHeader>
        <CardTitle className="text-2xl font-heading">Global Analysis Results</CardTitle>
        <div className="text-sm text-muted-foreground">
          Analyzed on {formatDate(result.timestamp)}
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h3 className="text-xl font-medium mb-2 border-l-4 border-highlight pl-3">{result.claim}</h3>
          <p className="text-muted-foreground">{result.globalConsensus || "No global consensus available."}</p>
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <h4 className="font-medium">Global Truth Index</h4>
            <span className={`font-bold ${getTruthColor(result.truthIndex)}`}>
              {result.truthIndex}% - {getTruthLabel(result.truthIndex)}
            </span>
          </div>
          <Progress value={result.truthIndex} className="h-2" />
          <p className="text-xs text-muted-foreground">
            The Truth Index measures how globally agreed upon this claim is across different countries and cultures.
          </p>
        </div>
        
        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="bg-agree/10 p-3 rounded-md">
            <div className="text-xl font-bold text-agree">
              {agreeCount} ({agreePercent}%)
            </div>
            <div className="text-sm">Countries Agree</div>
          </div>
          <div className="bg-mixed/10 p-3 rounded-md">
            <div className="text-xl font-bold text-mixed">
              {mixedCount} ({mixedPercent}%)
            </div>
            <div className="text-sm">Countries Mixed</div>
          </div>
          <div className="bg-disagree/10 p-3 rounded-md">
            <div className="text-xl font-bold text-disagree">
              {disagreeCount} ({disagreePercent}%)
            </div>
            <div className="text-sm">Countries Disagree</div>
          </div>
        </div>

        <div className="text-sm text-muted-foreground text-center pt-2">
          {totalCountries > 0 ? (
            <span>Analysis includes <strong>{totalCountries}</strong> countries from around the world</span>
          ) : (
            <span>No country data available</span>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ResultSummary;
