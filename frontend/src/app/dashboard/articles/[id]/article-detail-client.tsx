"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { API_ENDPOINTS } from "../../../../config/api";
import { Article } from "../../../../types";

interface ArticleDetailClientProps {
  id: string;
}

export default function ArticleDetailClient({ id }: ArticleDetailClientProps) {
  const router = useRouter();
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    const fetchArticle = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Please log in to view this article.");
        router.push("/login");
        return;
      }
      try {
        const res = await fetch(`${API_ENDPOINTS.ARTICLES}/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        });
        if (!res.ok) throw new Error("Failed to fetch article");
        const data = await res.json();
        setArticle(data);
      } catch {
        setError("Failed to load article.");
      } finally {
        setLoading(false);
      }
    };
    fetchArticle();
  }, [id, router]);

  if (loading) return <div className="p-8">Loading...</div>;
  if (error) return <div className="p-8 text-red-600">{error}</div>;
  if (!article) return <div className="p-8">Article not found.</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-2xl mx-auto px-4 py-8">
        <div className="mb-6">
          <button
            onClick={() => router.back()}
            className="flex items-center text-blue-600 hover:text-blue-800"
          >
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Back
          </button>
        </div>
        <h1 className="text-2xl font-bold mb-4">{article.title}</h1>
        <div className="mb-2 text-gray-700">Authors: {article.authors.join(", ")}</div>
        <div className="mb-2 text-gray-700">Journal: {article.journal}</div>
        <div className="mb-2 text-gray-700">Year: {article.year}</div>
        {article.doi && (
          <div className="mb-2 text-blue-700">
            <a href={`https://doi.org/${article.doi}`} target="_blank" rel="noopener noreferrer" className="hover:underline">
              DOI: {article.doi}
            </a>
          </div>
        )}
        <div className="mb-2 text-gray-700">Status: <span className="font-semibold">{article.status}</span></div>
        {article.rating && (
          <div className="mb-2 text-yellow-600">Rating: {article.rating.toFixed(1)} / 5</div>
        )}
        {article.rejectionReason && (
          <div className="mb-2 text-red-700">Rejection Reason: {article.rejectionReason}</div>
        )}
        {/* Analysis Result Display */}
        {article.analysisResult && (
          <div className="mt-6 p-4 bg-blue-50 rounded">
            <h2 className="font-semibold text-blue-700 mb-2">Analysis Result</h2>
            <ul className="text-sm text-gray-700 space-y-1">
              <li><strong>Research Type:</strong> {article.analysisResult.researchType}</li>
              <li><strong>Participant Type:</strong> {article.analysisResult.participantType}</li>
              <li><strong>Methodology:</strong> {article.analysisResult.methodology}</li>
              <li><strong>Findings:</strong> {article.analysisResult.findings}</li>
              {article.analysisResult.limitations && (
                <li><strong>Limitations:</strong> {article.analysisResult.limitations}</li>
              )}
              {article.analysisResult.recommendations && (
                <li><strong>Recommendations:</strong> {article.analysisResult.recommendations}</li>
              )}
              {article.analysisResult.notes && (
                <li><strong>Notes:</strong> {article.analysisResult.notes}</li>
              )}
            </ul>
          </div>
        )}
      </main>
    </div>
  );
}