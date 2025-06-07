'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { API_ENDPOINTS } from '../../../config/api';
import Link from 'next/link';

interface Article {
  _id: string;
  title: string;
  authors: string[];
  year: number;
  journal: string;
  status: string;
  analysisResult?: {
    researchType: string;
    participantType: string;
    methodology: string;
    findings: string;
    limitations?: string;
    recommendations?: string;
    notes?: string;
  };
}

interface Column {
  id: string;
  label: string;
  visible: boolean;
}

export default function AnalysisResults() {
  const router = useRouter();
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' } | null>(null);
  const [columns, setColumns] = useState<Column[]>([
    { id: 'title', label: 'Title', visible: true },
    { id: 'authors', label: 'Authors', visible: true },
    { id: 'year', label: 'Year', visible: true },
    { id: 'journal', label: 'Journal/Conference', visible: true },
    { id: 'researchType', label: 'Research Type', visible: true },
    { id: 'participantType', label: 'Participant Type', visible: true },
    { id: 'findings', label: 'Findings', visible: true }
  ]);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          router.push('/login');
          return;
        }

        console.log('Fetching analyzed articles...');
        const response = await fetch(`${API_ENDPOINTS.ARTICLES}/analyzed`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          }
        });

        console.log('Response status:', response.status);
        if (response.status === 401) {
          console.log('Unauthorized, redirecting to login...');
          router.push('/login');
          return;
        }

        if (!response.ok) {
          const errorData = await response.json().catch(() => null);
          console.error('Error response:', errorData);
          throw new Error(errorData?.message || 'Failed to fetch articles');
        }

        const data = await response.json();
        console.log('Received articles:', data);
        setArticles(data);
      } catch (err) {
        console.error('Error fetching articles:', err);
        setError(err instanceof Error ? err.message : 'Failed to load articles');
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, [router]);

  const handleSort = (key: string) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });

    const sortedArticles = [...articles].sort((a, b) => {
      if (key === 'authors') {
        const aAuthors = a[key].join(', ');
        const bAuthors = b[key].join(', ');
        return direction === 'asc' ? aAuthors.localeCompare(bAuthors) : bAuthors.localeCompare(aAuthors);
      }

      let aValue: string | number | undefined;
      let bValue: string | number | undefined;

      if (key === 'researchType' || key === 'participantType' || key === 'findings') {
        aValue = a.analysisResult?.[key] || '';
        bValue = b.analysisResult?.[key] || '';
      } else {
        aValue = a[key as keyof Article] as string | number;
        bValue = b[key as keyof Article] as string | number;
      }

      if (aValue < bValue) return direction === 'asc' ? -1 : 1;
      if (aValue > bValue) return direction === 'asc' ? 1 : -1;
      return 0;
    });

    setArticles(sortedArticles);
  };

  const toggleColumn = (columnId: string) => {
    setColumns(columns.map(col =>
      col.id === columnId ? { ...col, visible: !col.visible } : col
    ));
  };

  const renderCellContent = (article: Article, columnId: string) => {
    switch (columnId) {
      case 'authors':
        return article.authors.join(', ');
      case 'researchType':
        return article.analysisResult?.researchType || 'N/A';
      case 'participantType':
        return article.analysisResult?.participantType || 'N/A';
      case 'findings':
        return article.analysisResult?.findings || 'N/A';
      default:
        const value = article[columnId as keyof Article];
        return typeof value === 'string' || typeof value === 'number' ? value : 'N/A';
    }
  };

  if (loading) return <div className="p-8 text-center">Loading...</div>;
  if (error) return <div className="p-8 text-center text-red-500">{error}</div>;

  return (
    <div className="p-8">
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold mb-2">Analysis Results</h1>
          <p className="text-gray-600">View and sort analysis results for all analyzed articles</p>
        </div>
        <Link
          href="/dashboard"
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
        >
          Back to Dashboard
        </Link>
      </div>

      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-4">Column Visibility</h2>
        <div className="flex flex-wrap gap-2">
          {columns.map(column => (
            <button
              key={column.id}
              onClick={() => toggleColumn(column.id)}
              className={`px-3 py-1 rounded ${
                column.visible
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 text-gray-700'
              }`}
            >
              {column.label}
            </button>
          ))}
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200">
          <thead>
            <tr>
              {columns.filter(col => col.visible).map(column => (
                <th
                  key={column.id}
                  onClick={() => handleSort(column.id)}
                  className="px-6 py-3 border-b border-gray-200 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                >
                  <div className="flex items-center space-x-1">
                    <span>{column.label}</span>
                    {sortConfig?.key === column.id && (
                      <span className="text-blue-500">
                        {sortConfig.direction === 'asc' ? '↑' : '↓'}
                      </span>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {articles.map(article => (
              <tr key={article._id} className="hover:bg-gray-50">
                {columns.filter(col => col.visible).map(column => (
                  <td key={column.id} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {renderCellContent(article, column.id)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}