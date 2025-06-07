"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";

// Define the structure of the article form data
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
  const currentYear = new Date().getFullYear();

  // Initial state: one empty article form
  const [formList, setFormList] = useState<ArticleFormData[]>([
    {
      title: "",
      authors: [""],
      journal: "",
      year: currentYear,
      volume: "",
      number: "",
      pages: "",
      doi: "",
    },
  ]);

  // Track which forms have been successfully submitted
  const [submittedForms, setSubmittedForms] = useState<number[]>([]);

  // Validate that required fields are filled
  const isFormValid = (form: ArticleFormData): boolean => {
    return (
      form.title.trim() !== "" &&
      form.journal.trim() !== "" &&
      form.doi.trim() !== "" &&
      form.authors.filter((a) => a.trim() !== "").length > 0
    );
  };

  // Handle field changes for text inputs
  const handleChange = <K extends keyof ArticleFormData>(
    formIndex: number,
    field: K,
    value: ArticleFormData[K]
  ) => {
    const updatedForms = [...formList];
    updatedForms[formIndex][field] = value;
    setFormList(updatedForms);
  };

  // Handle author input changes
  const handleAuthorChange = (formIndex: number, authorIndex: number, value: string) => {
    const updatedForms = [...formList];
    updatedForms[formIndex].authors[authorIndex] = value;
    setFormList(updatedForms);
  };

  // Add a new author input to a form
  const addAuthor = (formIndex: number) => {
    const updatedForms = [...formList];
    updatedForms[formIndex].authors.push("");
    setFormList(updatedForms);
  };

  // Remove an author input from a form
  const removeAuthor = (formIndex: number, authorIndex: number) => {
    const updatedForms = [...formList];
    updatedForms[formIndex].authors.splice(authorIndex, 1);
    setFormList(updatedForms);
  };

  // Add a completely new form to the list
  const addNewForm = () => {
    setFormList([
      ...formList,
      {
        title: "",
        authors: [""],
        journal: "",
        year: currentYear,
        volume: "",
        number: "",
        pages: "",
        doi: "",
      },
    ]);
  };

  // Remove a specific form from the list
  const deleteForm = (index: number) => {
    const updatedForms = [...formList];
    updatedForms.splice(index, 1);
    setFormList(updatedForms);
    setSubmittedForms((prev) => prev.filter((i) => i !== index));
  };

  // Handle submission of all valid, unsubmitted forms
  const handleSubmitAll = async () => {
    const submittedIds: string[] = [];
    const token = localStorage.getItem('token');

    if (!token) {
      alert('Please log in to submit articles');
      router.push('/login');
      return;
    }

    for (let i = 0; i < formList.length; i++) {
      if (!isFormValid(formList[i]) || submittedForms.includes(i)) continue;

      try {
        const filteredAuthors = formList[i].authors.filter((a) => a.trim() !== "");
        const response = await fetch("http://localhost:4000/articles", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
          body: JSON.stringify({ ...formList[i], authors: filteredAuthors }),
        });

        if (!response.ok) {
          const errorText = await response.text();
          console.error("Submission error for form", i + 1, ":", errorText);
          throw new Error("Failed to submit");
        }

        const data = await response.json();
        submittedIds.push(data._id);
        setSubmittedForms((prev) => [...prev, i]);
      } catch (err) {
        console.error("Error submitting article:", err);
        alert("Submission failed");
      }
    }

    // Redirect to article details page with query parameters of submitted IDs
    if (submittedIds.length > 0) {
      const query = submittedIds.map(id => `id=${id}`).join("&");
      router.push(`/dashboard/articles/?${query}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top navigation bar */}
      <nav className="bg-white shadow-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <span className="text-xl font-bold text-blue-600">SPEED</span>
            <div className="space-x-4 text-sm">
              <Link href="/dashboard" className="text-gray-500 hover:text-gray-900">Home</Link>
              <Link href="/dashboard/practices" className="text-gray-500 hover:text-gray-900">Practices</Link>
              <Link href="/dashboard/search" className="text-gray-500 hover:text-gray-900">Search</Link>
              <Link href="/dashboard/submit" className="text-gray-500 hover:text-gray-900">Submit Article</Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Main content area */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
        <Link href="/dashboard" className="text-sm text-blue-600 hover:text-blue-800 mb-4 inline-block">
          ← Back to Dashboard
        </Link>
        <h2 className="text-lg font-medium text-gray-900 mb-6">Submit New Article(s)</h2>

        {/* List of article forms */}
        <AnimatePresence>
          {formList.map((formData, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
              className="bg-white p-6 mb-8 shadow rounded-md border"
            >
              {/* Form header */}
              <div className="flex justify-between mb-2">
                <h3 className="text-md font-semibold">Article Form #{index + 1}</h3>
                {formList.length > 1 && (
                  <button
                    type="button"
                    onClick={() => deleteForm(index)}
                    className="text-sm text-red-600 hover:text-red-800"
                  >
                    Drop Form
                  </button>
                )}
              </div>

              {/* Standard fields: title, journal, volume, number, pages, doi */}
              {["title", "journal", "volume", "number", "pages", "doi"].map((field) => (
                <div key={field} className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">
                    {field.charAt(0).toUpperCase() + field.slice(1)}
                    {["title", "journal", "doi"].includes(field) ? " *" : ""}
                  </label>
                  <input
                    type="text"
                    required={["title", "journal", "doi"].includes(field)}
                    value={formData[field as keyof ArticleFormData] || ""}
                    onChange={(e) => handleChange(index, field as keyof ArticleFormData, e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm"
                    placeholder={field === "pages" ? "e.g., 123-145" : field === "doi" ? "e.g., 10.1145/1234567.1234568" : ""}
                  />
                </div>
              ))}

              {/* Authors section */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Authors *</label>
                {formData.authors.map((author, aIndex) => (
                  <div key={aIndex} className="flex items-center space-x-2 mb-1">
                    <input
                      type="text"
                      required
                      value={author}
                      onChange={(e) => handleAuthorChange(index, aIndex, e.target.value)}
                      className="block w-full rounded-md border-gray-300 shadow-sm sm:text-sm"
                      placeholder={`Author ${aIndex + 1}`}
                    />
                    {formData.authors.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeAuthor(index, aIndex)}
                        className="text-red-600 text-sm"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => addAuthor(index)}
                  className="mt-1 text-blue-600 text-sm"
                >
                  + Add Another Author
                </button>
              </div>

              {/* Year field */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Year *</label>
                <select
                  required
                  value={formData.year}
                  onChange={(e) => handleChange(index, "year", parseInt(e.target.value))}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm"
                >
                  <option value="" disabled hidden>Select a year</option>
                  {Array.from({ length: currentYear - 1899 }, (_, i) => 1900 + i)
                    .reverse()
                    .map((year) => (
                      <option key={year} value={year}>{year}</option>
                    ))}
                </select>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Action buttons: Add and Submit */}
        <div className="flex justify-end space-x-3 mt-6">
          <button
            type="button"
            onClick={addNewForm}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            Add Another Form
          </button>
          <button
            type="button"
            onClick={handleSubmitAll}
            disabled={formList.some((form, i) => !isFormValid(form) || submittedForms.includes(i))}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {formList.length === 1 ? "Submit Article" : "Submit All Articles"}
          </button>
        </div>
      </div>
    </div>
  );
}
