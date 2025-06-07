'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { API_ENDPOINTS } from '../../../config/api';

interface Article {
  _id: string;
  title: string;
}

export default function AnalysisDashboard() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setError('No authentication token found');
          setLoading(false);
          return;
        }

        const response = await fetch(API_ENDPOINTS.ARTICLES, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch articles: ${response.status}`);
        }

        const data = await response.json();
        setArticles(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load articles');
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, []);

  if (loading) return <div className="p-8 text-center">Loading...</div>;
  if (error) return <div className="p-8 text-center text-red-500">{error}</div>;

  return (
    <div className="p-8">
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold mb-2">Analysis Dashboard</h1>
          <p className="text-gray-600">Welcome! Here you can see articles waiting for analysis and your analysis history.</p>
        </div>
        <Link
          href="/dashboard"
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
        >
          Back to Dashboard
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Articles Ready for Analysis</h2>
        {articles.length === 0 ? (
          <p className="text-gray-500">No articles are currently ready for analysis.</p>
        ) : (
          <ul className="space-y-4">
            {articles.map(article => (
              <li key={article._id} className="border-b pb-4 last:border-b-0">
                <Link
                  href={`/dashboard/analysis/${article._id}`}
                  className="text-blue-600 hover:text-blue-800 hover:underline"
                >
                  {article.title}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
