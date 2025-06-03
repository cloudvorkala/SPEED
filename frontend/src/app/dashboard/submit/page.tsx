"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface ArticleFormData {
  title: string;
  authors: string[];
  journal: string;
  year: number;
  volume?: string;
  number?: string;
  pages?: string;
  doi: string;
}

export default function SubmitArticle() {
  const router = useRouter();
  const [formData, setFormData] = useState<ArticleFormData>({
    title: "",
    authors: [""],
    journal: "",
    year: new Date().getFullYear(),
    volume: "",
    number: "",
    pages: "",
    doi: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleAuthorChange = (index: number, value: string) => {
    const newAuthors = [...formData.authors];
    newAuthors[index] = value;
    setFormData({ ...formData, authors: newAuthors });
  };

  const addAuthor = () => {
    setFormData({ ...formData, authors: [...formData.authors, ""] });
  };

  const removeAuthor = (index: number) => {
    const newAuthors = formData.authors.filter((_, i) => i !== index);
    setFormData({ ...formData, authors: newAuthors });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // 过滤掉空作者
      const filteredAuthors = formData.authors.filter(author => author.trim() !== "");

      const response = await fetch("http://localhost:4000/articles", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          authors: filteredAuthors,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to submit article");
      }

      const data = await response.json();
      router.push(`/dashboard/articles/${data._id}`);
    } catch (err) {
      setError("Failed to submit article. Please try again.");
      console.error("Error submitting article:", err);
    } finally {
      setLoading(false);
    }
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

          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6">
              <h2 className="text-lg font-medium text-gray-900">Submit New Article</h2>
              <p className="mt-1 text-sm text-gray-500">
                Please provide the article details below. All fields marked with * are required.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="border-t border-gray-200 px-4 py-5 sm:px-6">
              {error && (
                <div className="mb-4 p-4 text-sm text-red-700 bg-red-100 rounded-lg" role="alert">
                  {error}
                </div>
              )}

              <div className="space-y-6">
                {/* Title */}
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                    Title *
                  </label>
                  <input
                    type="text"
                    id="title"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  />
                </div>

                {/* Authors */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">Authors *</label>
                  {formData.authors.map((author, index) => (
                    <div key={index} className="mt-2 flex items-center space-x-2">
                      <input
                        type="text"
                        required
                        value={author}
                        onChange={(e) => handleAuthorChange(index, e.target.value)}
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                        placeholder={`Author ${index + 1}`}
                      />
                      {formData.authors.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeAuthor(index)}
                          className="inline-flex items-center p-1 border border-transparent rounded-full shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                        >
                          <svg
                            className="h-5 w-5"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={addAuthor}
                    className="mt-2 inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Add Another Author
                  </button>
                </div>

                {/* Journal */}
                <div>
                  <label htmlFor="journal" className="block text-sm font-medium text-gray-700">
                    Journal *
                  </label>
                  <input
                    type="text"
                    id="journal"
                    required
                    value={formData.journal}
                    onChange={(e) => setFormData({ ...formData, journal: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  />
                </div>

                {/* Year
                <div>
                  <label htmlFor="year" className="block text-sm font-medium text-gray-700">
                    Year *
                  </label>
                  <input
                    type="number"
                    id="year"
                    required
                    min="1900"
                    max={new Date().getFullYear()}
                    value={formData.year}
                    onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value) })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  />
                </div> */}
                {/* Year */}

                <div>
                  <label htmlFor="year" className="block text-sm font-medium text-gray-700">
                    Year *
                  </label>
                  <select
                    id="year"
                    required
                    value={formData.year}
                    onChange={(e) =>
                      setFormData({ ...formData, year: parseInt(e.target.value) })
                    }
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  >
                    <option value="" disabled hidden>Select a year</option>
                    {Array.from({ length: new Date().getFullYear() - 1899 }, (_, i) => 1900 + i)
                      .reverse()
                      .map((year) => (
                        <option key={year} value={year}>
                          {year}
                        </option>
                      ))}
                  </select>
                </div>


                {/* Volume */}
                <div>
                  <label htmlFor="volume" className="block text-sm font-medium text-gray-700">
                    Volume
                  </label>
                  <input
                    type="text"
                    id="volume"
                    value={formData.volume}
                    onChange={(e) => setFormData({ ...formData, volume: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  />
                </div>

                {/* Number */}
                <div>
                  <label htmlFor="number" className="block text-sm font-medium text-gray-700">
                    Number
                  </label>
                  <input
                    type="text"
                    id="number"
                    value={formData.number}
                    onChange={(e) => setFormData({ ...formData, number: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  />
                </div>

                {/* Pages */}
                <div>
                  <label htmlFor="pages" className="block text-sm font-medium text-gray-700">
                    Pages
                  </label>
                  <input
                    type="text"
                    id="pages"
                    value={formData.pages}
                    onChange={(e) => setFormData({ ...formData, pages: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    placeholder="e.g., 123-145"
                  />
                </div>

                {/* DOI */}
                <div>
                  <label htmlFor="doi" className="block text-sm font-medium text-gray-700">
                    DOI *
                  </label>
                  <input
                    type="text"
                    id="doi"
                    required
                    value={formData.doi}
                    onChange={(e) => setFormData({ ...formData, doi: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    placeholder="e.g., 10.1145/1234567.1234568"
                  />
                </div>

                {/* Submit button */}
                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={loading}
                    className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                  >
                    {loading ? "Submitting..." : "Submit Article"}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}