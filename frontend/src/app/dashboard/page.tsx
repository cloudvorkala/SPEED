"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

interface Article {
  _id: string;
  title: string;
  authors: string[];
  year: number;
  status: string;
}

export default function Dashboard() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        console.log("Fetching articles...");
        const response = await fetch("http://localhost:4000/articles", {
          method: "GET",
          headers: {
            "Accept": "application/json",
          },
        });

        console.log("Response status:", response.status);
        if (!response.ok) {
          const errorText = await response.text();
          console.error("Error response:", errorText);
          throw new Error(`Failed to fetch articles: ${response.status} ${errorText}`);
        }

        const data = await response.json();
        console.log("Received data:", data);
        setArticles(data);
      } catch (err) {
        console.error("Error fetching articles:", err);
        setError(err instanceof Error ? err.message : "Failed to load articles");
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, []);

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
                <Link href="/dashboard" className="px-3 py-2 text-sm font-medium text-blue-600">
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
              <button className="ml-3 text-sm font-medium text-gray-500 hover:text-gray-900">
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main content */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Welcome to SPEED</h1>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {/* Practices card */}
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h2 className="text-lg font-medium text-gray-900">Software Engineering Practices</h2>
              <p className="mt-1 text-sm text-gray-500">
                Browse different software engineering practices and view related evidence.
              </p>
            </div>
            <div className="bg-gray-50 px-4 py-4 sm:px-6">
              <Link href="/dashboard/practices" className="text-sm text-blue-600 hover:text-blue-800">
                Browse practices →
              </Link>
            </div>
          </div>

          {/* Search card */}
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h2 className="text-lg font-medium text-gray-900">Search Evidence</h2>
              <p className="mt-1 text-sm text-gray-500">
                Search for evidence about software engineering practices and their outcomes.
              </p>
            </div>
            <div className="bg-gray-50 px-4 py-4 sm:px-6">
              <Link href="/dashboard/search" className="text-sm text-blue-600 hover:text-blue-800">
                Start searching →
              </Link>
            </div>
          </div>

          {/* Submit card */}
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h2 className="text-lg font-medium text-gray-900">Submit Article</h2>
              <p className="mt-1 text-sm text-gray-500">
                Submit new research articles to contribute to the evidence database.
              </p>
            </div>
            <div className="bg-gray-50 px-4 py-4 sm:px-6">
              <Link href="/dashboard/submit" className="text-sm text-blue-600 hover:text-blue-800">
                Submit article →
              </Link>
            </div>
          </div>
        </div>

        {/* Latest articles */}
        <div className="mt-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Recently Approved Articles</h2>
          <div className="bg-white shadow overflow-hidden sm:rounded-md">
            {loading ? (
              <div className="px-4 py-4 text-center text-gray-500">Loading articles...</div>
            ) : error ? (
              <div className="px-4 py-4 text-center text-red-500">{error}</div>
            ) : articles.length === 0 ? (
              <div className="px-4 py-4 text-center text-gray-500">No articles found</div>
            ) : (
              <ul className="divide-y divide-gray-200">
                {articles.map((article) => (
                  <li key={article._id}>
                    <div className="px-4 py-4 sm:px-6">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-blue-600 truncate">
                          <Link href={`/dashboard/articles/${article._id}`}>
                            {article.title}
                          </Link>
                        </p>
                        <div className="ml-2 flex-shrink-0 flex">
                          <p className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                            {article.status}
                          </p>
                        </div>
                      </div>
                      <div className="mt-2 sm:flex sm:justify-between">
                        <div className="sm:flex">
                          <p className="flex items-center text-sm text-gray-500">
                            Authors: {article.authors.join(", ")}
                          </p>
                        </div>
                        <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                          Published: {article.year}
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}