
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CountryAnalysis, CountryStance } from "../types";

interface CountryResultCardProps {
  country: CountryAnalysis;
}

const CountryResultCard = ({ country }: CountryResultCardProps) => {
  const getBadgeColor = (stance: CountryStance) => {
    switch (stance) {
      case 'agree':
        return 'bg-agree text-white hover:bg-agree/80';
      case 'disagree':
        return 'bg-disagree text-white hover:bg-disagree/80';
      case 'mixed':
        return 'bg-mixed text-white hover:bg-mixed/80';
      default:
        return 'bg-muted text-muted-foreground hover:bg-muted/80';
    }
  };

  return (
    <Card className="result-card overflow-hidden h-full">
      <div className={`h-2 w-full ${
        country.stance === 'agree' 
          ? 'bg-agree' 
          : country.stance === 'disagree' 
            ? 'bg-disagree' 
            : 'bg-mixed'
      }`}></div>
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <CardTitle className="text-xl font-heading">{country.countryName}</CardTitle>
          <Badge className={getBadgeColor(country.stance)}>
            {country.stance.charAt(0).toUpperCase() + country.stance.slice(1)}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-muted-foreground text-sm">{country.summary}</p>
        
        {country.headlines && country.headlines.length > 0 && (
          <div className="space-y-2">
            <h4 className="font-medium text-sm">Headlines:</h4>
            <ul className="space-y-2 text-sm">
              {country.headlines.slice(0, 3).map((headline, idx) => (
                <li key={idx} className="border-l-2 border-muted pl-3">
                  "{headline.title}" <span className="text-xs text-muted-foreground">- {headline.source}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
        
        {country.culturalContext && country.culturalContext.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {country.culturalContext.map((tag, idx) => (
              <span key={idx} className="text-xs px-2 py-1 bg-secondary rounded-full">
                {tag}
              </span>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CountryResultCard;
