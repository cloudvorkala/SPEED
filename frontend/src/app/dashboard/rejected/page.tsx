"use client";

import { useEffect, useState } from "react";
import { useAuth } from "../../../contexts/AuthContext";
import { useRouter } from "next/navigation";
import { API_ENDPOINTS } from "../../../config/api";
import { Article } from "../../../types";

export default function RejectedArticles() {
  const { user } = useAuth();
  const router = useRouter();
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.isAnalyst && !user?.isModerator && !user?.isAdmin) {
      router.push("/dashboard");
      return;
    }
    fetchRejectedArticles();
  }, [user, router]);

  const fetchRejectedArticles = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No authentication token found");
        return;
      }

      const response = await fetch(`${API_ENDPOINTS.ANALYSIS}/rejected`, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch rejected articles");
      }

      const data = await response.json();
      setArticles(data);
    } catch (error) {
      console.error("Error fetching rejected articles:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="p-8 text-center">Loading...</div>;
  }

  if (!user?.isAnalyst && !user?.isModerator && !user?.isAdmin) {
    return <div className="p-8 text-center">Access denied.</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Rejected Articles</h1>

        <div className="bg-white rounded-lg shadow">
          <div className="p-6">
            {articles.length > 0 ? (
              <div className="space-y-4">
                {articles.map((article) => (
                  <div
                    key={article._id}
                    className="border rounded-lg p-4 hover:bg-gray-50 transition"
                  >
                    <h3 className="font-semibold mb-2">{article.title}</h3>
                    <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                      <div>
                        <p>Authors: {article.authors.join(", ")}</p>
                        <p>Journal: {article.journal}</p>
                      </div>
                      <div>
                        <p>Year: {article.year}</p>
                        <p>DOI: {article.doi || "N/A"}</p>
                      </div>
                    </div>
                    {article.rejectionReason && (
                      <div className="mt-4 p-3 bg-red-50 rounded-md">
                        <p className="text-sm font-medium text-red-800">
                          Rejection Reason:
                        </p>
                        <p className="text-sm text-red-700 mt-1">
                          {article.rejectionReason}
                        </p>
                      </div>
                    )}
                    <div className="mt-4 text-sm text-gray-500">
                      <p>
                        Rejected on:{" "}
                        {new Date(article.updatedAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-600">No rejected articles found</p>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}