import axios from 'axios';


const OPENWEATHER_BASE_URL = 'https://api.openweathermap.org/data/2.5/weather';

export const fetchWeather = async (city: string) => {
  const apiKey = process.env.OPENWEATHER_API_KEY;

  if (!apiKey) {
    throw new Error('Missing OPENWEATHER_API_KEY');
  }

  const response = await axios.get(OPENWEATHER_BASE_URL, {
    params: {
      q: city,
      appid: apiKey,
      units: 'metric',
    },
  });

  return {
    temperature: response.data.main.temp,
    description: response.data.weather?.[0]?.description ?? 'Unavailable',
    humidity: response.data.main.humidity,
    windSpeed: response.data.wind.speed,
  };
};

