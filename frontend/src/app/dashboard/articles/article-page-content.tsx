"use client";

import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuth } from "../../../contexts/AuthContext";
import { API_ENDPOINTS } from '@/config/api';

// Define the Article type structure for type-checking
interface Article {
    _id: string;
    title: string;
    authors: string[];
    journal: string;
    year: number;
    doi: string;
    status: string;
    rating?: number;
    evidence?: Array<{
        _id: string;
        result: "AGREE" | "DISAGREE" | "NEUTRAL";
        researchType: string;
        participantType: string;
        notes: string;
        practice: { _id: string; name: string };
        claim: { _id: string; statement: string };
        analyst: { _id: string; name: string };
    }>;
}

export default function SubmittedArticlesPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const ids = searchParams.getAll("id");
    const { logout } = useAuth();

    const [articles, setArticles] = useState<Article[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchArticles = async () => {
            if (!ids.length) {
                setError("No article ID provided.");
                setLoading(false);
                return;
            }

            const token = localStorage.getItem('token');
            if (!token) {
                setError("Please log in to view articles.");
                router.push('/login');
                return;
            }

            try {
                const results = await Promise.all(
                    ids.map(async (id) => {
                        const res = await fetch(`${API_ENDPOINTS.ARTICLES}/${id}`, {
                            headers: {
                                'Authorization': `Bearer ${token}`,
                                'Accept': 'application/json'
                            }
                        });
                        if (!res.ok) throw new Error(`Failed to fetch article ${id}`);
                        return res.json();
                    })
                );
                setArticles(results);
            } catch (err) {
                console.error("Error fetching articles:", err);
                setError("Failed to load one or more articles.");
            } finally {
                setLoading(false);
            }
        };

        fetchArticles();
    }, [ids, router]);

    const handleLogout = () => {
        logout();
        router.push('/');
    };

    if (loading) return <div className="p-6">Loading...</div>;
    if (error) return <div className="p-6 text-red-600">{error}</div>;

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Top navigation bar */}
            <nav className="bg-white shadow-sm">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex h-16 justify-between items-center">
                        <div className="flex items-center space-x-6">
                            <span className="text-xl font-bold text-blue-600">SPEED</span>
                            <Link href="/dashboard" className="text-sm text-gray-500 hover:text-gray-900">Home</Link>
                            <Link href="/dashboard/practices" className="text-sm text-gray-500 hover:text-gray-900">Practices</Link>
                            <Link href="/dashboard/search" className="text-sm text-gray-500 hover:text-gray-900">Search</Link>
                            <Link href="/dashboard/submit" className="text-sm text-gray-500 hover:text-gray-900">Submit Article</Link>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="text-sm text-gray-500 hover:text-gray-900"
                        >
                            Logout
                        </button>
                    </div>
                </div>
            </nav>

            {/* Page content */}
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
                <Link href="/dashboard" className="text-sm text-blue-600 hover:text-blue-800 inline-block mb-4">
                    ← Back to Dashboard
                </Link>

                {/* Display articles in a responsive grid layout */}
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {articles.map((article) => (
                        <div
                            key={article._id}
                            className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow"
                        >
                            <div className="flex flex-col h-full justify-between">
                                <div>
                                    {/* Article title */}
                                    <h2 className="text-xl font-semibold text-gray-900 mb-2">{article.title}</h2>

                                    {/* List of authors */}
                                    <div className="flex flex-wrap gap-2 mb-2">
                                        {article.authors.map((author, idx) => (
                                            <span key={idx} className="px-2 py-1 text-xs bg-gray-100 text-gray-800 rounded-full">
                                                {author}
                                            </span>
                                        ))}
                                    </div>

                                    {/* Journal and publication year */}
                                    <div className="text-sm text-gray-600 mb-1">
                                        {article.journal} • {article.year}
                                    </div>

                                    {/* DOI link */}
                                    <div className="text-sm text-blue-600 truncate mb-3">
                                        <a
                                            href={`https://doi.org/${article.doi}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="hover:underline"
                                        >
                                            DOI: {article.doi}
                                        </a>
                                    </div>

                                    {/* Status and rating display */}
                                    <div className="flex items-center space-x-2 text-sm">
                                        <span
                                            className={`px-2 py-1 rounded-full text-xs font-semibold ${
                                                article.status === "APPROVED"
                                                    ? "bg-green-100 text-green-800"
                                                    : article.status === "REJECTED"
                                                        ? "bg-red-100 text-red-800"
                                                        : "bg-yellow-100 text-yellow-800"
                                            }`}
                                        >
                                            {article.status}
                                        </span>
                                        {article.rating && (
                                            <>
                                                <span className="text-yellow-500">
                                                    {"★".repeat(Math.round(article.rating))}
                                                </span>
                                                <span className="text-gray-300">
                                                    {"★".repeat(5 - Math.round(article.rating))}
                                                </span>
                                                <span className="text-gray-500">
                                                    ({article.rating.toFixed(1)}/5)
                                                </span>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
