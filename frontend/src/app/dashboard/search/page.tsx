"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "../../../contexts/AuthContext";
import { useRouter } from "next/navigation";
import { API_ENDPOINTS } from "../../../config/api";

interface Article {
  _id: string;
  title: string;
  authors: string[];
  journal: string;
  year: number;
  status: "PENDING" | "APPROVED" | "REJECTED";
  isPeerReviewed?: boolean;
  isRelevantToSE?: boolean;
  isDuplicateChecked?: boolean;
  rating?: number;
}

interface SearchFilters {
  title: string;
  author: string;
  journal: string;
  year: string;
  status: string;
}

export default function SearchPage() {
  const { logout } = useAuth();
  const router = useRouter();
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const [filters, setFilters] = useState<SearchFilters>({
    title: "",
    author: "",
    journal: "",
    year: "",
    status: ""
  });

  // clear filters and results
  const handleClearFilters = () => {
    setFilters({
      title: "",
      author: "",
      journal: "",
      year: "",
      status: "",
    });
    setArticles([]);
    setError("");
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/login');
        return;
      }

      const params = new URLSearchParams();
      if (filters.title) params.append('title', filters.title);
      if (filters.author) params.append('author', filters.author);
      if (filters.journal) params.append('journal', filters.journal);
      if (filters.year) params.append('year', filters.year);
      if (filters.status) params.append('status', filters.status);

      const searchUrl = `${API_ENDPOINTS.ARTICLES}?${params.toString()}`;
      console.log('Search URL:', searchUrl);
      console.log('Search parameters:', Object.fromEntries(params.entries()));

      const response = await fetch(searchUrl, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch articles');
      }

      const data = await response.json();
      console.log('Search results:', data);
      setArticles(data);
    } catch (error) {
      console.error('Search error:', error);
      setError('Failed to search articles. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top navigation bar */}
      <nav className="bg-white shadow-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 justify-between">
            <div className="flex">
              <div className="flex flex-shrink-0 items-center">
                <span className="text-xl font-bold text-blue-600">SPEED</span>
              </div>
              <div className="ml-6 flex items-center space-x-4">
                <Link
                  href="/dashboard"
                  className="px-3 py-2 text-sm font-medium text-gray-500 hover:text-gray-900"
                >
                  Home
                </Link>
                <Link
                  href="/dashboard/practices"
                  className="px-3 py-2 text-sm font-medium text-gray-500 hover:text-gray-900"
                >
                  Practices
                </Link>
                <Link
                  href="/dashboard/search"
                  className="px-3 py-2 text-sm font-medium text-gray-500 hover:text-gray-900"
                >
                  Search
                </Link>
                <Link
                  href="/dashboard/submit"
                  className="px-3 py-2 text-sm font-medium text-gray-500 hover:text-gray-900"
                >
                  Submit Article
                </Link>
              </div>
            </div>
            <div className="flex items-center">
              <button
                onClick={() => { logout(); router.push('/'); }}
                className="text-sm font-medium text-gray-500 hover:text-gray-900"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main content */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <Link href="/dashboard" className="text-sm text-blue-600 hover:text-blue-800 mr-2">
              ← Back to Dashboard
            </Link>
          </div>

          {/* Search form */}
          <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-6">
            <div className="px-4 py-5 sm:px-6">
              <h2 className="text-lg font-medium text-gray-900">Search Articles</h2>
              <p className="mt-1 text-sm text-gray-500">
                Use the filters below to search for articles in the database.
              </p>
            </div>

            <form onSubmit={handleSearch} className="border-t border-gray-200 px-4 py-5 sm:px-6">
              {error && (
                <div className="mb-4 p-4 text-sm text-red-700 bg-red-100 rounded-lg" role="alert">
                  {error}
                </div>
              )}

              <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                <div className="sm:col-span-3">
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                    Title
                  </label>
                  <input
                    type="text"
                    name="title"
                    id="title"
                    value={filters.title}
                    onChange={handleFilterChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  />
                </div>

                <div className="sm:col-span-3">
                  <label htmlFor="author" className="block text-sm font-medium text-gray-700">
                    Author
                  </label>
                  <input
                    type="text"
                    name="author"
                    id="author"
                    value={filters.author}
                    onChange={handleFilterChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  />
                </div>

                <div className="sm:col-span-3">
                  <label htmlFor="journal" className="block text-sm font-medium text-gray-700">
                    Journal
                  </label>
                  <input
                    type="text"
                    name="journal"
                    id="journal"
                    value={filters.journal}
                    onChange={handleFilterChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label htmlFor="year" className="block text-sm font-medium text-gray-700">
                    Year
                  </label>
                  <select
                    name="year"
                    id="year"
                    value={filters.year}
                    onChange={handleFilterChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  >
                    <option value="">Any</option>
                    {Array.from({ length: 30 }, (_, i) => new Date().getFullYear() - i).map((year) => (
                      <option key={year} value={year}>
                        {year}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="sm:col-span-1">
                  <label htmlFor="status" className="block text-sm font-medium text-gray-700">
                    Status
                  </label>
                  <select
                    name="status"
                    id="status"
                    value={filters.status}
                    onChange={handleFilterChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  >
                    <option value="">Any</option>
                    <option value="APPROVED">Approved</option>
                    <option value="PENDING">Pending</option>
                    <option value="REJECTED">Rejected</option>
                  </select>
                </div>
              </div>

              <div className="mt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={handleClearFilters}
                  className="inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  Clear Filters
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  {loading ? "Searching..." : "Search"}
                </button>
              </div>
            </form>
          </div>

          {/* Search results */}
          {articles.length > 0 && (
            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
              <div className="px-4 py-5 sm:px-6">
                <h3 className="text-lg font-medium text-gray-900">Search Results</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Found {articles.length} article(s)
                </p>
              </div>
              <div className="border-t border-gray-200">
                <ul className="divide-y divide-gray-200">
                  {articles.map((article) => (
                    <li key={article._id} className="px-4 py-4 sm:px-6">
                      <div className="flex items-center justify-between">
                        <div className="flex-1 min-w-0">
                          <h4 className="text-lg font-medium text-blue-600 truncate">
                            {article.title}
                          </h4>
                          <p className="mt-1 text-sm text-gray-500">
                            {article.authors.join(", ")} • {article.journal} • {article.year}
                          </p>
                          <div className="mt-2 flex items-center">
                            <span className={`inline-flex px-2 py-1 rounded-full text-xs font-semibold ${
                              article.status === "APPROVED" ? "bg-green-100 text-green-800" :
                              article.status === "REJECTED" ? "bg-red-100 text-red-800" :
                              "bg-yellow-100 text-yellow-800"
                            }`}>
                              {article.status}
                            </span>
                            {article.rating && (
                              <div className="ml-2 flex items-center">
                                <span className="text-yellow-500">
                                  {"★".repeat(Math.round(article.rating))}
                                </span>
                                <span className="text-gray-300">
                                  {"★".repeat(5 - Math.round(article.rating))}
                                </span>
                                <span className="ml-1 text-sm text-gray-500">
                                  ({article.rating.toFixed(1)}/5)
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="ml-4 flex-shrink-0">
                          <Link
                            href={`/dashboard/articles?id=${article._id}`}
                            className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                          >
                            View Details
                          </Link>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}