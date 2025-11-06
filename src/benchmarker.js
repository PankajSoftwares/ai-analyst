function generateBenchmarks(data) {
  const benchmarks = [];

  // ARR Growth %
  const arrGrowth = data.traction?.growth || 'UNKNOWN';
  benchmarks.push({ metric: 'ARR Growth %', value: arrGrowth, sector_median: 18 });

  // LTV/CAC
  const ltv = data.metrics?.lifetime_value_usd;
  const cac = data.metrics?.cac_usd;
  const ltvCacRatio = (ltv && cac) ? (ltv / cac) : null;
  benchmarks.push({ metric: 'LTV/CAC', value: ltvCacRatio, sector_median: 3 });

  return benchmarks;
}
module.exports = { generateBenchmarks };
