import { useState, useEffect } from "react";
import { Toaster, toast } from "sonner";

type Weather = {
  description?: string;
  temperature?: number;
  humidity?: number;
  windSpeed?: number;
};

type Time = {
  timezone?: string;
  datetime?: string;
  utcOffset?: string;
};

type NewsItem = {
  title?: string;
  description?: string;
  url?: string;
  publishedAt?: string;
};

type Currency = {
  baseCurrency?: string;
  rates?: Record<string, number>;
};

type CityData = {
  city: string;
  weather: Weather | null;
  time: Time | null;
  news: NewsItem[];
  currency: Currency | null;
};

const API_BASE_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
  ? 'http://localhost:3000/api/city'
  : '/api/city';

function App() {
  const [city, setCity] = useState('London');
  const [data, setData] = useState<CityData | null>(null);
  const [loading, setLoading] = useState(false);

  // fetch city logic

  const fetchCity = async (cityName: string) => {
    setLoading(true);
    const response = await fetch(`${API_BASE_URL}/${encodeURIComponent(cityName)}`);
    const result = await response.json();

    if (!result.weather || result.weather === null) {
      toast.error('City not available');
      setData(null);
    } else {
      setData(result);
    }
    setLoading(false);
  };

  const handleSearch = () => {
    if (city.trim()) {
      fetchCity(city.trim());
    }
  };

  useEffect(() => {
    fetchCity(city);
  }, []);


  // format date time logic

  const formatDateTime = (datetime?: string) => {
    if (!datetime) return '—';
    return new Date(datetime).toLocaleString(undefined, {
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  // api url logic
  const apiUrl = data ? `${API_BASE_URL}/${encodeURIComponent(data.city)}` : '';

  // copy to clipboard logic
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard');
  };

  return (
    <main className="min-h-screen bg-white text-black p-6">
      <Toaster position="bottom-right" />
      <div className="max-w-2xl mx-auto flex flex-col gap-6">
        <header className="text-center">
          <h1 className="text-4xl font-bold mb-2">DataFusion Lookup</h1>
          <p className="text-gray-600">Check the latest city intelligence in a single request.</p>
        </header>

        <section className="flex gap-3">
          <input
            type="text"
            value={city}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCity(e.target.value)}
            onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => e.key === 'Enter' && handleSearch()}
            placeholder="Enter a city"
            className="flex-1 px-4 py-3 border border-black rounded-lg bg-white text-black text-base focus:outline-none focus:border-2"
          />
          <button
            onClick={handleSearch}
            disabled={loading}
            className="px-6 py-3 border border-black rounded-lg bg-black text-white font-semibold cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed whitespace-nowrap"
          >
            Fetch
          </button>
        </section>

        {apiUrl && (
          <section className="border border-black rounded-lg p-4 bg-gray-50">
            <p className="text-sm text-gray-600 mb-1">API Endpoint:</p>
            <code className="text-base font-mono break-all block">{apiUrl}</code>
          </section>
        )}

        {data && (
          <section className="flex flex-col gap-6">
            <article className="border-t border-black pt-6">
              <h2 className="text-lg font-semibold uppercase tracking-wide mb-4">Weather</h2>
              <dl className="space-y-1">
                <div>
                  <dt className="text-xs font-semibold uppercase tracking-wider text-gray-600">Conditions</dt>
                  <dd className="text-base">{data.weather?.description ?? '—'}</dd>
                </div>
                <div>
                  <dt className="text-xs font-semibold uppercase tracking-wider text-gray-600">Temperature</dt>
                  <dd className="text-base">
                    {data.weather?.temperature != null ? `${data.weather.temperature.toFixed(1)} °C` : '—'}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs font-semibold uppercase tracking-wider text-gray-600">Humidity</dt>
                  <dd className="text-base">{data.weather?.humidity != null ? `${data.weather.humidity}%` : '—'}</dd>
                </div>
                <div>
                  <dt className="text-xs font-semibold uppercase tracking-wider text-gray-600">Wind Speed</dt>
                  <dd className="text-base">
                    {data.weather?.windSpeed != null ? `${data.weather.windSpeed} m/s` : '—'}
                  </dd>
                </div>
              </dl>
            </article>

            <article className="border-t border-black pt-6">
              <h2 className="text-lg font-semibold uppercase tracking-wide mb-4">Local Time</h2>
              <dl className="space-y-1">
                <div>
                  <dt className="text-xs font-semibold uppercase tracking-wider text-gray-600">Timezone</dt>
                  <dd className="text-base">{data.time?.timezone ?? '—'}</dd>
                </div>
                <div>
                  <dt className="text-xs font-semibold uppercase tracking-wider text-gray-600">Date & Time</dt>
                  <dd className="text-base">{formatDateTime(data.time?.datetime)}</dd>
                </div>
                <div>
                  <dt className="text-xs font-semibold uppercase tracking-wider text-gray-600">UTC Offset</dt>
                  <dd className="text-base">{data.time?.utcOffset ?? '—'}</dd>
                </div>
              </dl>
            </article>

            <article className="border-t border-black pt-6">
              <h2 className="text-lg font-semibold uppercase tracking-wide mb-4">Top Headlines</h2>
              {data.news && data.news.length > 0 ? (
                <ul className="list-disc pl-6 space-y-2">
                  {data.news.slice(0, 5).map((item: NewsItem, index: number) => (
                    <li key={index} className="break-word">
                      <a
                        href={item.url ?? '#'}
                        target="_blank"
                        rel="noreferrer"
                        className="text-black underline"
                      >
                        {item.title ?? 'Untitled'}
                      </a>
                      <small className="block text-sm text-gray-600">
                        {item.publishedAt ? new Date(item.publishedAt).toLocaleString() : ''}
                      </small>
                      <p className="text-sm mt-1">{item.description ?? ''}</p>
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No recent headlines found.</p>
              )}
            </article>

            <article className="border-t border-black pt-6">
              <h2 className="text-lg font-semibold uppercase tracking-wide mb-4">Currency Rates</h2>
              {data.currency?.rates ? (
                <>
                  <p className="mb-3">
                    Base: <strong>{data.currency.baseCurrency ?? '—'}</strong>
                  </p>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {Object.entries(data.currency.rates)
                      .slice(0, 8)
                      .map(([code, rate]) => (
                        <div key={code} className="border border-black rounded p-2">
                          <div className="text-xs font-semibold uppercase tracking-wider text-gray-600 mb-1">{code}</div>
                          <div className="text-base font-medium">{Number.isFinite(rate) ? rate.toFixed(4) : '—'}</div>
                        </div>
                      ))}
                  </div>
                </>
              ) : (
                <p>Exchange rate data unavailable.</p>
              )}
            </article>

            <article className="border-t border-black pt-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold uppercase tracking-wide">Raw Response</h2>
                <button
                  onClick={() => copyToClipboard(JSON.stringify(data, null, 2))}
                  className="px-3 py-1 text-sm border border-black rounded bg-white hover:bg-gray-100"
                >
                  Copy
                </button>
              </div>
              <div className="bg-gray-100 border border-black rounded-lg p-4 max-h-64 overflow-auto">
                <pre className="text-sm m-0">
                  {JSON.stringify(data, null, 2)}
                </pre>
              </div>
            </article>
          </section>
        )}
      </div>
    </main>
  );
}

export default App;

