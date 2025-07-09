import axios from 'axios';


const NEWS_BASE_URL = 'https://newsapi.org/v2/everything';

export const fetchNews = async (city: string) => {
  const apiKey = process.env.NEWS_API_KEY;

  if (!apiKey) {
    throw new Error('Missing NEWS_API_KEY');
  }

  const response = await axios.get(NEWS_BASE_URL, {
    params: {
      q: city,
      pageSize: 5,
      sortBy: 'publishedAt',
      apiKey,
    },
  });

  return response.data.articles.map(
    (article: Record<string, unknown>) => ({
      title: String(article.title ?? 'Untitled'),
      description: (article.description as string | null) ?? null,
      url: String(article.url ?? ''),
      publishedAt: String(article.publishedAt ?? ''),
    }),
  );
};

