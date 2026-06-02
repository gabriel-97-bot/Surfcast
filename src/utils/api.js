import { scoreConditions } from './scoring.js';

export const SPOTS = {
  olberg: {
    name: "Ølberg",
    lat: 58.8697,
    lon: 5.5657,
    beachFacing: 270,
    offshoreWindMin: 45,
    offshoreWindMax: 135,
    bestSwellDir: 270,
    swellDirTolerance: 60,
  },
  bore: {
    name: "Bore",
    lat: 58.7995,
    lon: 5.5474,
    beachFacing: 280,
    offshoreWindMin: 45,
    offshoreWindMax: 135,
    bestSwellDir: 285,
    swellDirTolerance: 60,
  }
};

export async function fetchSpotData(spotKey) {
  const spot = SPOTS[spotKey];
  const [marineRes, weatherRes] = await Promise.all([
    fetch(`https://marine-api.open-meteo.com/v1/marine?latitude=${spot.lat}&longitude=${spot.lon}&hourly=wave_height,wave_direction,wave_period,swell_wave_height,swell_wave_direction,swell_wave_period&timezone=Europe%2FOslo&forecast_days=5`),
    fetch(`https://api.open-meteo.com/v1/forecast?latitude=${spot.lat}&longitude=${spot.lon}&hourly=windspeed_10m,winddirection_10m,weathercode&timezone=Europe%2FOslo&forecast_days=5&windspeed_unit=ms`)
  ]);

  if (!marineRes.ok || !weatherRes.ok) throw new Error('API fetch failed');

  const marine = await marineRes.json();
  const weather = await weatherRes.json();

  // Combine into hourly array
  const hours = marine.hourly.time.map((time, i) => {
    const waveHeight = marine.hourly.wave_height[i] ?? 0;
    const wavePeriod = marine.hourly.wave_period[i] ?? 0;
    const swellDir = marine.hourly.swell_wave_direction[i] ?? 0;
    const windSpeed = weather.hourly.windspeed_10m[i] ?? 0;
    const windDir = weather.hourly.winddirection_10m[i] ?? 0;
    const weatherCode = weather.hourly.weathercode[i] ?? 0;

    const score = scoreConditions(waveHeight, wavePeriod, windSpeed, windDir, swellDir, spot);

    return {
      time,
      waveHeight,
      wavePeriod,
      swellDir,
      windSpeed,
      windDir,
      weatherCode,
      score,
    };
  });

  return hours;
}

export function groupByDay(hours) {
  const days = {};
  for (const h of hours) {
    const date = h.time.split('T')[0];
    if (!days[date]) days[date] = [];
    days[date].push(h);
  }
  return days;
}
