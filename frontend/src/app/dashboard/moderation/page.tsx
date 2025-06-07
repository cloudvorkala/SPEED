"use client";

import { useEffect, useState } from "react";
import { useAuth } from "../../../contexts/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { User } from "../../../types";
import { API_ENDPOINTS } from "../../../config/api";

interface Article {
  _id: string;
  title: string;
  authors: string[];
  journal: string;
  year: number;
  doi: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  isPeerReviewed: boolean;
  isRelevantToSE: boolean;
  isDuplicateChecked: boolean;
  duplicateCheckResult?: string;
  rejectionReason?: string;
  rejectionCheckResult?: string;
}

export default function ModerationPage() {
  const { user } = useAuth() as { user: User | null };
  const router = useRouter();
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [pendingCount, setPendingCount] = useState(0);
  const [showNotification, setShowNotification] = useState(false);

  useEffect(() => {
    if (!user?.isModerator) {
      router.push("/dashboard");
      return;
    }
    fetchPendingArticles();
    const interval = setInterval(fetchPendingArticles, 30000); // Check every 30 seconds
    return () => clearInterval(interval);
  }, [user, router]);

  const fetchPendingArticles = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error("No authentication token found");
        return;
      }

      const [articlesResponse, countResponse] = await Promise.all([
        fetch(`${API_ENDPOINTS.ARTICLES}/pending`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          }
        }),
        fetch(`${API_ENDPOINTS.ARTICLES}/pending/count`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          }
        })
      ]);

      if (!articlesResponse.ok || !countResponse.ok) {
        throw new Error('Failed to fetch articles');
      }

      const articlesData = await articlesResponse.json();
      const countData = await countResponse.json();

      setArticles(articlesData);
      setPendingCount(countData.count);

      if (countData.count > 0) {
        setShowNotification(true);
        setTimeout(() => setShowNotification(false), 5000);
      }
    } catch (error) {
      console.error("Error fetching articles:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleModeration = async (
    articleId: string,
    status: "APPROVED" | "REJECTED",
    moderationData: {
      isPeerReviewed: boolean;
      isRelevantToSE: boolean;
      isDuplicateChecked: boolean;
      duplicateCheckResult?: string;
      rejectionReason?: string;
    }
  ) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error("No authentication token found");
        return;
      }

      const response = await fetch(`${API_ENDPOINTS.ARTICLES}/${articleId}/moderate`, {
        method: "POST",
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          status,
          ...moderationData,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to moderate article');
      }

      await fetchPendingArticles();
    } catch (error) {
      console.error("Error moderating article:", error);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

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
          </div>
        </div>
      </nav>

      {/* Main content */}
      <div className="container mx-auto px-4 py-8">
        {showNotification && (
          <div className="fixed top-4 right-4 bg-blue-500 text-white px-6 py-3 rounded-lg shadow-lg">
            {pendingCount} new article{pendingCount !== 1 ? 's' : ''} waiting for moderation
          </div>
        )}

        <h1 className="text-2xl font-bold mb-6">Article Moderation</h1>
        <div className="space-y-6">
          {articles.map((article) => (
            <div
              key={article._id}
              className="bg-white shadow rounded-lg p-6"
            >
              <h2 className="text-xl font-semibold mb-2">{article.title}</h2>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-gray-600">Authors</p>
                  <p>{article.authors.join(", ")}</p>
                </div>
                <div>
                  <p className="text-gray-600">Journal</p>
                  <p>{article.journal}</p>
                </div>
                <div>
                  <p className="text-gray-600">Year</p>
                  <p>{article.year}</p>
                </div>
                <div>
                  <p className="text-gray-600">DOI</p>
                  <p>{article.doi}</p>
                </div>
              </div>

              {/* Check Results */}
              {(article.duplicateCheckResult || article.rejectionCheckResult) && (
                <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <h3 className="text-lg font-semibold text-yellow-800 mb-2">Check Results</h3>
                  {article.duplicateCheckResult && (
                    <div className="mb-2">
                      <p className="text-yellow-700">
                        <span className="font-medium">Duplicate Check:</span> {article.duplicateCheckResult}
                      </p>
                    </div>
                  )}
                  {article.rejectionCheckResult && (
                    <div>
                      <p className="text-yellow-700">
                        <span className="font-medium">Previous Rejection:</span> {article.rejectionCheckResult}
                      </p>
                    </div>
                  )}
                </div>
              )}

              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      className="form-checkbox"
                      checked={article.isPeerReviewed}
                      onChange={(e) =>
                        handleModeration(article._id, article.status as "APPROVED" | "REJECTED", {
                          ...article,
                          isPeerReviewed: e.target.checked,
                        })
                      }
                    />
                    <span className="ml-2">Peer Reviewed</span>
                  </label>

                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      className="form-checkbox"
                      checked={article.isRelevantToSE}
                      onChange={(e) =>
                        handleModeration(article._id, article.status as "APPROVED" | "REJECTED", {
                          ...article,
                          isRelevantToSE: e.target.checked,
                        })
                      }
                    />
                    <span className="ml-2">Relevant to SE</span>
                  </label>

                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      className="form-checkbox"
                      checked={article.isDuplicateChecked}
                      onChange={(e) =>
                        handleModeration(article._id, article.status as "APPROVED" | "REJECTED", {
                          ...article,
                          isDuplicateChecked: e.target.checked,
                        })
                      }
                    />
                    <span className="ml-2">Duplicate Checked</span>
                  </label>
                </div>

                <div className="flex space-x-4">
                  <button
                    onClick={() =>
                      handleModeration(article._id, "APPROVED", {
                        ...article,
                      })
                    }
                    className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() =>
                      handleModeration(article._id, "REJECTED", {
                        ...article,
                      })
                    }
                    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                  >
                    Reject
                  </button>
                </div>

                {article.status === "REJECTED" && (
                  <div>
                    <label className="block text-gray-600 mb-2">
                      Rejection Reason
                    </label>
                    <textarea
                      value={article.rejectionReason || ""}
                      onChange={(e) =>
                        handleModeration(article._id, article.status as "APPROVED" | "REJECTED", {
                          ...article,
                          rejectionReason: e.target.value,
                        })
                      }
                      className="w-full border rounded p-2"
                      rows={3}
                    />
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}