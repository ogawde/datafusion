const API_BASE_URL = `${location.protocol}//${location.hostname}:${location.port === '3000' ? location.port : '3000'}/api/city`;

const elements = {
  input: document.querySelector('#city-input'),
  button: document.querySelector('#search-button'),
  results: document.querySelector('#results'),
  weather: document.querySelector('#weather-card'),
  time: document.querySelector('#time-card'),
  news: document.querySelector('#news-card'),
  currency: document.querySelector('#currency-card'),
  raw: document.querySelector('#raw-card'),
};

const renderWeather = (weather) => {
  const info = weather ?? {};
  elements.weather.innerHTML = `
    <h2>Weather</h2>
    <dl>
      <div>
        <dt>Conditions</dt>
        <dd>${info.description ?? '—'}</dd>
      </div>
      <div>
        <dt>Temperature</dt>
        <dd>${info.temperature != null ? `${info.temperature.toFixed(1)} °C` : '—'}</dd>
      </div>
      <div>
        <dt>Humidity</dt>
        <dd>${info.humidity != null ? `${info.humidity}%` : '—'}</dd>
      </div>
      <div>
        <dt>Wind Speed</dt>
        <dd>${info.windSpeed != null ? `${info.windSpeed} m/s` : '—'}</dd>
      </div>
    </dl>
  `;
};

const renderTime = (time) => {
  const info = time ?? {};
  const formatted = info.datetime
    ? new Date(info.datetime).toLocaleString(undefined, {
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric',
        weekday: 'short',
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      })
    : '—';
  elements.time.innerHTML = `
    <h2>Local Time</h2>
    <dl>
      <div>
        <dt>Timezone</dt>
        <dd>${info.timezone ?? '—'}</dd>
      </div>
      <div>
        <dt>Date &amp; Time</dt>
        <dd>${formatted}</dd>
      </div>
      <div>
        <dt>UTC Offset</dt>
        <dd>${info.utcOffset ?? '—'}</dd>
      </div>
    </dl>
  `;
};

const renderNews = (news) => {
  const list = Array.isArray(news)
    ? news.slice(0, 5).map((item) => {
        const entry = item ?? {};
        const published = entry.publishedAt
          ? new Date(entry.publishedAt).toLocaleString()
          : '';
        return `
          <li>
            <a href="${entry.url ?? '#'}" target="_blank" rel="noreferrer">${entry.title ?? 'Untitled'}</a>
            <small>${published}</small>
            <p>${entry.description ?? ''}</p>
          </li>
        `;
      }).join('')
    : '';
  elements.news.innerHTML = `
    <h2>Top Headlines</h2>
    ${list ? `<ul>${list}</ul>` : '<p>No recent headlines found.</p>'}
  `;
};

const renderCurrency = (currency) => {
  const info = currency ?? { rates: {} };
  const topRates = Object.entries(info.rates ?? {})
    .slice(0, 8)
    .map(([code, rate]) => `
      <div>
        <dt>${code}</dt>
        <dd>${Number.isFinite(rate) ? rate : '—'}</dd>
      </div>
    `)
    .join('');
  elements.currency.innerHTML = `
    <h2>Currency Rates</h2>
    <p>Base: <strong>${info.baseCurrency ?? '—'}</strong></p>
    ${topRates ? `<dl class="rate-grid">${topRates}</dl>` : '<p>Exchange rate data unavailable.</p>'}
  `;
};

const renderRaw = (payload) => {
  elements.raw.innerHTML = `
    <h2>Raw Response</h2>
    <pre>${JSON.stringify(payload, null, 2)}</pre>
  `;
};

const renderResults = (data) => {
  renderWeather(data.weather);
  renderTime(data.time);
  renderNews(data.news);
  renderCurrency(data.currency);
  renderRaw(data);
  elements.results.hidden = false;
};

const fetchCity = (city) =>
  fetch(`${API_BASE_URL}/${encodeURIComponent(city)}`).then((response) => response.json());

const handleFetch = () => {
  const city = elements.input.value.trim();
  if (!city) return;
  elements.button.disabled = true;
  fetchCity(city)
    .then((data) => {
      renderResults(data);
    })
    .finally(() => {
      elements.button.disabled = false;
    });
};

elements.button.addEventListener('click', handleFetch);
elements.input.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') handleFetch();
});

window.addEventListener('DOMContentLoaded', () => {
  elements.input.value = 'London';
  handleFetch();
});

