import axios from 'axios';

const API_KEY = '6b140d55899b499ca9c96e9d932b3cf2';
const BASE_URL = 'https://newsapi.org/v2/';

export const fetchNews = async (domain, query) => {
  try {
    const response = await axios.get(`${BASE_URL}everything`, {
      params: {
        domains: domain,
        q: query,
        language: 'en',
        sortBy: 'publishedAt',
        apiKey: API_KEY,
      },
    });
    return response.data.articles;
  } catch (error) {
    console.error('Erreur lors de la récupération des données:', error);
    return [];
  }
};
