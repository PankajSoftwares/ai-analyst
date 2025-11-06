const { generateResponse } = require('./geminiClient');

async function generateMemo(data, risks, benchmarks) {
  const prompt = `
Generate a professional investment memo for the following startup data. Use emojis and clear formatting. Include:

🏢 Startup name and founders
📊 Key metrics (revenue, TAM, stage)
🔹 Strengths (business model, competitive advantages)
⚠️ Risks (list with severity)
📈 Benchmarks comparison
💡 Recommendation (Invest/Follow/Pass)

Format as a clean, readable memo with sections separated by lines.

Startup data:
${JSON.stringify(data, null, 2)}

Risks:
${JSON.stringify(risks, null, 2)}

Benchmarks:
${JSON.stringify(benchmarks, null, 2)}

Return only the formatted memo text, no additional explanations.
`;

  try {
    const response = await generateResponse(prompt);
    return response.trim();
  } catch (error) {
    console.error('Error generating memo:', error);
    // Fallback to basic memo
    return `
🏢 Startup: ${data.startup_name}
Founder: ${data.founders?.map(f => f.name).join(', ') || 'Unknown'}
Stage: ${data.stage || 'Unknown'}
Revenue: $${data.traction?.monthly_revenue_usd || 'UNKNOWN'} MRR
TAM: $${data.market_tam_usd || 'UNKNOWN'}
------------------------------------
🔹 Strengths:
- ${data.business_model || 'Unknown'}
- ${benchmarks[0]?.metric || 'Unknown'}: ${benchmarks[0]?.value || 'Unknown'} (vs sector ${benchmarks[0]?.sector_median || 'Unknown'})
🔹 Risks:
${risks.map(r => `- ${r.title} (${r.severity})`).join('\n')}
------------------------------------
Recommendation: ${risks.length > 3 ? 'Follow' : 'Invest'}
`;
  }
}
module.exports = { generateMemo };
