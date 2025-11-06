const { generateResponse } = require('./geminiClient');

async function analyzeRisks(data) {
  const prompt = `
Analyze the following startup data and identify potential risks. Return ONLY a valid JSON array of risk objects with this structure:
[{"title": "string", "severity": "High|Medium|Low"}]

Consider these risk factors:
- Financial risks (high CAC vs LTV, no revenue, high churn)
- Team risks (single founder, inexperienced team)
- Market risks (high competition, small TAM)
- Product risks (no IP, unproven technology)
- Operational risks (high growth without infrastructure)

Startup data:
${JSON.stringify(data, null, 2)}

Return only the JSON array, no additional text.
`;

  try {
    const response = await generateResponse(prompt);
    // Clean the response to extract JSON
    const jsonMatch = response.match(/\[[\s\S]*\]/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    } else {
      throw new Error('No JSON array found in response');
    }
  } catch (error) {
    console.error('Error analyzing risks:', error);
    // Fallback to basic analysis
    const risks = [];
    if (data.metrics?.cac_usd > data.metrics?.lifetime_value_usd)
      risks.push({ title: 'High CAC vs LTV', severity: 'High' });
    if (!data.traction?.monthly_revenue_usd)
      risks.push({ title: 'No revenue data', severity: 'High' });
    if (data.founders?.length < 2)
      risks.push({ title: 'Single founder risk', severity: 'Medium' });
    return risks;
  }
}
module.exports = { analyzeRisks };
