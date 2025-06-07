"use client";

import { useEffect, useState } from "react";
import { useAuth } from "../../../../contexts/AuthContext";
import { useRouter } from "next/navigation";
import { API_ENDPOINTS } from "../../../../config/api";
import { Article } from "../../../../types";

interface AnalysisFormClientProps {
  id: string;
}

export default function AnalysisFormClient({ id }: AnalysisFormClientProps) {
  const { user } = useAuth();
  const router = useRouter();
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    researchType: "",
    participantType: "",
    methodology: "",
    findings: "",
    limitations: "",
    recommendations: "",
    notes: "",
  });

  useEffect(() => {
    if (!user?.isAnalyst) {
      router.push("/dashboard");
      return;
    }
    const fetchArticle = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          console.error("No authentication token found");
          router.push("/login");
          return;
        }

        const response = await fetch(`${API_ENDPOINTS.ARTICLES}/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          if (response.status === 403) {
            router.push("/dashboard");
            return;
          }
          throw new Error("Failed to fetch article");
        }

        const data = await response.json();
        if (data.status !== 'READY_FOR_ANALYSIS') {
          alert("This article is not ready for analysis");
          router.push("/dashboard");
          return;
        }
        setArticle(data);
      } catch (error) {
        console.error("Error fetching article:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchArticle();
  }, [user, router, id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user?.isAnalyst) {
      alert("Only analysts can submit analysis");
      router.push("/dashboard");
      return;
    }

    if (article?.status !== 'READY_FOR_ANALYSIS') {
      alert("This article is not ready for analysis");
      router.push("/dashboard");
      return;
    }

    setSubmitting(true);

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No authentication token found");
        router.push("/login");
        return;
      }

      console.log('Submitting analysis for article:', id);
      console.log('Analysis data:', formData);

      const response = await fetch(`${API_ENDPOINTS.ANALYSIS}/articles/${id}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        console.error('Error response:', errorData);
        if (response.status === 403) {
          alert(errorData?.message || "You don't have permission to submit analysis");
          router.push("/dashboard");
          return;
        }
        if (response.status === 404) {
          alert("Article not found or not ready for analysis");
          router.push("/dashboard");
          return;
        }
        throw new Error(errorData?.message || "Failed to submit analysis");
      }

      const result = await response.json();
      console.log('Analysis submission result:', result);

      router.push("/dashboard/analysis");
    } catch (error) {
      console.error("Error submitting analysis:", error);
      alert("Failed to submit analysis. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  if (loading) {
    return <div className="p-8 text-center">Loading...</div>;
  }

  if (!user?.isAnalyst) {
    return <div className="p-8 text-center">Access denied.</div>;
  }

  if (!article) {
    return <div className="p-8 text-center">Article not found.</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold mb-6">Analyze Article</h1>

          {/* Article Details */}
          <div className="bg-white rounded-lg shadow p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4">{article.title}</h2>
            <div className="grid grid-cols-2 gap-4 text-gray-600">
              <div>
                <p>Authors: {article.authors.join(", ")}</p>
                <p>Journal: {article.journal}</p>
              </div>
              <div>
                <p>Year: {article.year}</p>
                <p>DOI: {article.doi || "N/A"}</p>
              </div>
            </div>
          </div>

          {/* Analysis Form */}
          <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6">
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Research Type
                </label>
                <select
                  name="researchType"
                  value={formData.researchType}
                  onChange={handleChange}
                  required
                  className="w-full border rounded-md p-2"
                >
                  <option value="">Select research type</option>
                  <option value="empirical">Empirical</option>
                  <option value="case_study">Case Study</option>
                  <option value="survey">Survey</option>
                  <option value="experiment">Experiment</option>
                  <option value="systematic_review">Systematic Review</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Participant Type
                </label>
                <select
                  name="participantType"
                  value={formData.participantType}
                  onChange={handleChange}
                  required
                  className="w-full border rounded-md p-2"
                >
                  <option value="">Select participant type</option>
                  <option value="students">Students</option>
                  <option value="professionals">Professionals</option>
                  <option value="mixed">Mixed</option>
                  <option value="none">No Participants</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Methodology
                </label>
                <textarea
                  name="methodology"
                  value={formData.methodology}
                  onChange={handleChange}
                  required
                  rows={4}
                  className="w-full border rounded-md p-2"
                  placeholder="Describe the research methodology..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Findings
                </label>
                <textarea
                  name="findings"
                  value={formData.findings}
                  onChange={handleChange}
                  required
                  rows={4}
                  className="w-full border rounded-md p-2"
                  placeholder="Summarize the key findings..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Limitations
                </label>
                <textarea
                  name="limitations"
                  value={formData.limitations}
                  onChange={handleChange}
                  rows={4}
                  className="w-full border rounded-md p-2"
                  placeholder="List any limitations of the study..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Recommendations
                </label>
                <textarea
                  name="recommendations"
                  value={formData.recommendations}
                  onChange={handleChange}
                  rows={4}
                  className="w-full border rounded-md p-2"
                  placeholder="Provide recommendations for future research..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Notes
                </label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  rows={4}
                  className="w-full border rounded-md p-2"
                  placeholder="Additional notes or observations..."
                />
              </div>

              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => router.push("/dashboard/analysis")}
                  className="px-4 py-2 border rounded-md hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50"
                >
                  {submitting ? "Submitting..." : "Submit Analysis"}
                </button>
              </div>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}