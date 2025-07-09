import axios from 'axios';


const EXCHANGE_RATE_BASE_URL = 'https://v6.exchangerate-api.com/v6';

const getDefaultBaseCurrency = () => 'USD';

export const fetchCurrency = async () => {
  const apiKey = process.env.EXCHANGERATE_API_KEY;

  if (!apiKey) {
    throw new Error('Missing EXCHANGERATE_API_KEY');
  }

  const baseCurrency = getDefaultBaseCurrency();
  const response = await axios.get(
    `${EXCHANGE_RATE_BASE_URL}/${apiKey}/latest/${baseCurrency}`,
  );

  return {
    baseCurrency,
    rates: response.data.conversion_rates,
  };
};

