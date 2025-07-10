import type { NextFunction, Request, Response } from 'express';

import { fetchCurrency } from '../services/currencyService';
import { fetchNews } from '../services/newsService';
import { fetchTime } from '../services/timeService';
import { fetchWeather } from '../services/weatherService';
import { getCache, setCache } from '../utils/cache';
import { logger } from '../utils/logger';
import type { CityData } from '../types';

const buildCacheKey = (city: string) => `city:${city.toLowerCase()}`;

export const getCityInfo = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { city } = req.params;

    if (!city) {
      return res.status(400).json({ error: 'City parameter is required' });
    }

    const cacheKey = buildCacheKey(city);
    const cached = getCache<CityData>(cacheKey);

    if (cached) {
      return res.json({ ...cached, cached: true });
    }

    const results = await Promise.allSettled([
      fetchWeather(city),
      fetchTime(city),
      fetchNews(city),
      fetchCurrency(),
    ]);

    const [weather, time, news, currency] = results;

    const cityData: CityData = {
      city,
      country: 'Unknown',
      weather: weather.status === 'fulfilled' ? weather.value : null,
      time: time.status === 'fulfilled' ? time.value : null,
      news: news.status === 'fulfilled' ? news.value : [],
      currency: currency.status === 'fulfilled' ? currency.value : null,
      timestamp: new Date().toISOString(),
    };

    if (weather.status === 'rejected') {
      logger.warn('Weather service failed', { city, reason: weather.reason });
    }
    if (time.status === 'rejected') {
      logger.warn('Time service failed', { city, reason: time.reason });
    }
    if (news.status === 'rejected') {
      logger.warn('News service failed', { city, reason: news.reason });
    }
    if (currency.status === 'rejected') {
      logger.warn('Currency service failed', { city, reason: currency.reason });
    }

    setCache(cacheKey, cityData);

    res.json(cityData);
  } catch (error) {
    next(error);
  }
};

