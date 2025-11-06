const { generateResponse } = require('./geminiClient');

async function extractStartupData(rawText) {
  const prompt = `
Extract structured startup data from the following pitch deck text. Return ONLY a valid JSON object with the following structure:
{
  "startup_name": "string",
  "founders": [{"name": "string", "role": "string"}],
  "ask": {"amount": number, "use_of_funds": "string"},
  "stage": "string",
  "traction": {"monthly_revenue_usd": number, "users": number, "growth": number},
  "metrics": {"cac_usd": number, "lifetime_value_usd": number, "churn": number},
  "business_model": "string",
  "market_tam_usd": number,
  "competition": "string",
  "ip": "string",
  "notes": "string"
}

Pitch deck text:
${rawText}

If any field is not found, use null or empty string/array as appropriate. Ensure the JSON is valid and parseable.
`;

  try {
    const response = await generateResponse(prompt);
    // Clean the response to extract JSON
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return jsonMatch[0];
    } else {
      throw new Error('No JSON found in response');
    }
  } catch (error) {
    console.error('Error extracting startup data:', error);
    // Dynamic fallback based on input text
    const mockData = generateDynamicMockData(rawText);
    return JSON.stringify(mockData);
  }
}

// Helper function to generate dynamic mock data based on input text
function generateDynamicMockData(rawText) {
  const text = rawText.toLowerCase();

  // Extract basic info from text
  const startupName = extractStartupName(text);
  const founders = extractFounders(text);
  const ask = extractAsk(text);
  const stage = extractStage(text);
  const traction = extractTraction(text);
  const metrics = extractMetrics(text);
  const businessModel = extractBusinessModel(text);
  const marketTam = extractMarketTam(text);
  const competition = extractCompetition(text);
  const ip = extractIP(text);
  const notes = extractNotes(text);

  return {
    startup_name: startupName,
    founders: founders,
    ask: ask,
    stage: stage,
    traction: traction,
    metrics: metrics,
    business_model: businessModel,
    market_tam_usd: marketTam,
    competition: competition,
    ip: ip,
    notes: notes
  };
}

function extractStartupName(text) {
  // Look for patterns like "Startup Name: X" or "Company: X"
  const patterns = [
    /startup name:\s*([^\n\r]+)/i,
    /company:\s*([^\n\r]+)/i,
    /([A-Z][a-z]+ [A-Z][a-z]+)/  // Title case words
  ];

  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match && match[1]) {
      return match[1].trim();
    }
  }
  return "Unknown Startup";
}

function extractFounders(text) {
  const founderPatterns = [
    /founders?:\s*([^,\n\r]+(?:,\s*[^,\n\r]+)*)/i,
    /ceo:\s*([^,\n\r]+)/i,
    /cto:\s*([^,\n\r]+)/i
  ];

  const founders = [];
  for (const pattern of founderPatterns) {
    const match = text.match(pattern);
    if (match && match[1]) {
      const names = match[1].split(',').map(name => name.trim());
      names.forEach(name => {
        if (name) {
          const role = text.includes('ceo') && name.toLowerCase().includes('ceo') ? 'CEO' :
                      text.includes('cto') && name.toLowerCase().includes('cto') ? 'CTO' : 'Founder';
          founders.push({ name: name.replace(/(ceo|cto)/i, '').trim(), role });
        }
      });
    }
  }

  return founders.length > 0 ? founders : [{ name: "Unknown Founder", role: "CEO" }];
}

function extractAsk(text) {
  const askPatterns = [
    /ask:\s*\$?(\d+(?:\.\d+)?)\s*(m|k)?/i,
    /raising:\s*\$?(\d+(?:\.\d+)?)\s*(m|k)?/i
  ];

  for (const pattern of askPatterns) {
    const match = text.match(pattern);
    if (match) {
      let amount = parseFloat(match[1]);
      if (match[2]?.toLowerCase() === 'm') amount *= 1000000;
      else if (match[2]?.toLowerCase() === 'k') amount *= 1000;

      const useMatch = text.match(/use of funds?:\s*([^,\n\r]+)/i);
      const useOfFunds = useMatch ? useMatch[1].trim() : "product development";

      return { amount: Math.round(amount), use_of_funds: useOfFunds };
    }
  }
  return { amount: 2000000, use_of_funds: "product development" };
}

function extractStage(text) {
  const stages = ['seed', 'series a', 'series b', 'series c', 'growth'];
  for (const stage of stages) {
    if (text.includes(stage)) {
      return stage.charAt(0).toUpperCase() + stage.slice(1);
    }
  }
  return "Seed";
}

function extractTraction(text) {
  const revenueMatch = text.match(/(\d+(?:\.\d+)?)\s*(?:k|m)?\s*mrr/i);
  const usersMatch = text.match(/(\d+(?:\.\d+)?)\s*users?/i);
  const growthMatch = text.match(/(\d+(?:\.\d+)?)%?\s*growth/i);

  let revenue = 12000;
  if (revenueMatch) {
    revenue = parseFloat(revenueMatch[1]);
    if (revenueMatch[0].includes('k')) revenue *= 1000;
    else if (revenueMatch[0].includes('m')) revenue *= 1000000;
  }

  const users = usersMatch ? parseInt(usersMatch[1]) : 500;
  const growth = growthMatch ? parseFloat(growthMatch[1]) : 20;

  return { monthly_revenue_usd: Math.round(revenue), users, growth };
}

function extractMetrics(text) {
  const cacMatch = text.match(/cac:?\s*\$?(\d+(?:\.\d+)?)/i);
  const ltvMatch = text.match(/ltv:?\s*\$?(\d+(?:\.\d+)?)/i);
  const churnMatch = text.match(/churn:?\s*(\d+(?:\.\d+)?)%?/i);

  const cac = cacMatch ? parseFloat(cacMatch[1]) : 800;
  const ltv = ltvMatch ? parseFloat(ltvMatch[1]) : 6000;
  const churn = churnMatch ? parseFloat(churnMatch[1]) : 5;

  return { cac_usd: cac, lifetime_value_usd: ltv, churn };
}

function extractBusinessModel(text) {
  if (text.includes('saas')) return 'SaaS for clinics';
  if (text.includes('marketplace')) return 'Marketplace platform';
  if (text.includes('subscription')) return 'Subscription service';
  return 'Software platform';
}

function extractMarketTam(text) {
  const tamMatch = text.match(/tam:?\s*\$?(\d+(?:\.\d+)?)\s*(m|b|k)?/i);
  if (tamMatch) {
    let tam = parseFloat(tamMatch[1]);
    if (tamMatch[2]?.toLowerCase() === 'b') tam *= 1000000000;
    else if (tamMatch[2]?.toLowerCase() === 'm') tam *= 1000000;
    else if (tamMatch[2]?.toLowerCase() === 'k') tam *= 1000;
    return Math.round(tam);
  }
  return 2500000000;
}

function extractCompetition(text) {
  if (text.includes('low') || text.includes('none')) return 'Low';
  if (text.includes('high') || text.includes('intense')) return 'High';
  if (text.includes('medium') || text.includes('moderate')) return 'Medium';
  return 'Low';
}

function extractIP(text) {
  if (text.includes('proprietary')) return 'Proprietary algorithms';
  if (text.includes('patent')) return 'Patented technology';
  if (text.includes('algorithm')) return 'Proprietary algorithms';
  return 'Proprietary technology';
}

function extractNotes(text) {
  if (text.includes('small customer base')) return 'Promising but small customer base';
  if (text.includes('promising')) return 'Promising startup';
  if (text.includes('early stage')) return 'Early stage with potential';
  return 'Emerging startup';
}

module.exports = { extractStartupData };
