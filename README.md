# What Does The World Think?
## Overview

"What Does The World Think?" is a cutting-edge AI-powered web application that provides global perspective analysis on any claim or statement. Using the Perplexity API, it visualizes how all 192 United Nations member countries would likely respond to any given statement, highlighting the fascinating differences in cultural, political, and social contexts around the world.

## Key Features
- Global Truth Analysis: Submit any claim to see how it's perceived across all UN member countries
- Interactive World Map: Color-coded visualization showing agreement levels (green for agree, yellow for mixed, red for disagree)
- Truth Index: A percentage score showing how globally agreed-upon a claim is
- Country-by-Country Breakdown: Detailed analysis for each nation with cultural context
- Summary Statistics: Quick view of how many countries agree, disagree, or have mixed opinions

## How It Works
1. Users enter their Perplexity API key (stored securely in browser local storage)
2. They submit any claim or statement they're curious about
3. Our application prompts the Perplexity AI with a carefully structured query
4. The AI analyzes the claim against cultural, political, and social contexts of different nations
5. Results are transformed into an interactive map and detailed country breakdowns

## Technical Implementation
- Built with React, TypeScript, and Tailwind CSS
- Uses Shadcn UI components for consistent design
- Integrates with Perplexity's AI
- Visualizes data using Leaflet for interactive mapping
- Processes AI-generated responses into structured data

## Privacy Features
- API keys never leave the user's browser
- Analyses are performed through secure API calls
- No persistent storage of user claims or results

## Impact
> This tool helps users understand how "truth" isn't universal but deeply contextual. It promotes global awareness and critical thinking by highlighting how the same statement can be received differently across various cultural contexts.

## Future Development
- Historical tracking to show changing global opinions
- Detailed citations for country-specific perspectives
- Side-by-side claim comparisons
- Regional opinion variations within countries
- Mobile app development for on-the-go analyses

The application serves as a powerful reminder that global perspectives vary widely, and what seems obviously true in one context may be viewed completely differently elsewhere. By visualizing these differences, "What Does The World Think?" helps users develop a more nuanced understanding of global discourse.

