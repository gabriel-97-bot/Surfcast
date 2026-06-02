export function angleDiff(a, b) {
  let diff = ((a - b) + 360) % 360;
  if (diff > 180) diff = 360 - diff;
  return diff;
}

function isWindOffshore(windDir, spot) {
  const offshoreCenter = (spot.offshoreWindMin + spot.offshoreWindMax) / 2;
  const diff = angleDiff(windDir, offshoreCenter);
  return diff < 45;
}

function isWindCross(windDir, spot) {
  const offshoreCenter = (spot.offshoreWindMin + spot.offshoreWindMax) / 2;
  const onshoreCenter = (offshoreCenter + 180) % 360;
  const toOffshore = angleDiff(windDir, offshoreCenter);
  const toOnshore = angleDiff(windDir, onshoreCenter);
  return toOffshore >= 45 && toOnshore >= 45;
}

export function scoreConditions(waveHeight, wavePeriod, windSpeed, windDir, swellDir, spot) {
  // Wave height score (ideal: 0.8–1.8m for intermediate)
  let heightScore;
  if (waveHeight < 0.3) heightScore = 0;
  else if (waveHeight < 0.6) heightScore = 3;
  else if (waveHeight < 0.8) heightScore = 6;
  else if (waveHeight <= 1.8) heightScore = 10;
  else if (waveHeight <= 2.5) heightScore = 7;
  else heightScore = 3;

  // Wave period score (longer = more powerful walls)
  let periodScore;
  if (wavePeriod < 6) periodScore = 2;
  else if (wavePeriod < 8) periodScore = 5;
  else if (wavePeriod < 10) periodScore = 7;
  else periodScore = 10;

  // Wind score
  const isOffshore = isWindOffshore(windDir, spot);
  const isCross = isWindCross(windDir, spot);
  let windScore;
  if (windSpeed < 2) windScore = 8;
  else if (isOffshore && windSpeed < 8) windScore = 10;
  else if (isOffshore && windSpeed < 15) windScore = 7;
  else if (isOffshore) windScore = 4;
  else if (isCross && windSpeed < 5) windScore = 6;
  else if (isCross) windScore = 3;
  else if (windSpeed < 5) windScore = 5;
  else windScore = 1;

  // Swell direction score
  const swellAngleDiff = angleDiff(swellDir, spot.bestSwellDir);
  let swellDirScore;
  if (swellAngleDiff < 20) swellDirScore = 10;
  else if (swellAngleDiff < 40) swellDirScore = 8;
  else if (swellAngleDiff < spot.swellDirTolerance) swellDirScore = 5;
  else swellDirScore = 2;

  const total = (heightScore * 0.25 + periodScore * 0.30 + windScore * 0.30 + swellDirScore * 0.15);
  return Math.round(total);
}

export function getConditionLabel(score) {
  if (score >= 8) return { label: "Firing 🔥", color: "#22c55e" };
  if (score >= 6) return { label: "Good", color: "#22c55e" };
  if (score >= 4) return { label: "Fair", color: "#f59e0b" };
  if (score >= 2) return { label: "Poor", color: "#ef4444" };
  return { label: "Flat/Blown out", color: "#ef4444" };
}

export function getScoreColor(score) {
  if (score >= 7) return "#22c55e";
  if (score >= 4) return "#f59e0b";
  return "#ef4444";
}

export function findBestWindow(hourlyData) {
  // Find best 3-hour consecutive window
  let bestAvg = 0;
  let bestStart = 0;
  for (let i = 0; i < hourlyData.length - 2; i++) {
    const avg = (hourlyData[i].score + hourlyData[i+1].score + hourlyData[i+2].score) / 3;
    if (avg > bestAvg) {
      bestAvg = avg;
      bestStart = i;
    }
  }
  return { start: bestStart, avg: Math.round(bestAvg) };
}
