import Link from "next/link";
import { Metadata } from "next";

interface Article {
  _id: string;
  title: string;
  authors: string[];
  journal: string;
  year: number;
  doi: string;
  status: string;
  averageRating: number;
  ratingCount: number;
  evidence?: Array<{
    _id: string;
    result: "AGREE" | "DISAGREE" | "NEUTRAL";
    researchType: string;
    participantType: string;
    notes: string;
    practice: {
      _id: string;
      name: string;
    };
    claim: {
      _id: string;
      statement: string;
    };
    analyst: {
      _id: string;
      name: string;
    };
  }>;
}

type Props = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const response = await fetch(`http://localhost:4000/articles/${id}`);
  if (!response.ok) {
    return {
      title: "Article Not Found",
    };
  }
  const article: Article = await response.json();
  return {
    title: article.title,
  };
}

export default async function ArticleDetail({ params }: Props) {
  const { id } = await params;
  const response = await fetch(`http://localhost:4000/articles/${id}`);
  if (!response.ok) {
    throw new Error("Failed to fetch article");
  }
  const article: Article = await response.json();

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
                <Link href="/dashboard" className="px-3 py-2 text-sm font-medium text-gray-500 hover:text-gray-900">
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
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <Link href="/dashboard" className="text-sm text-blue-600 hover:text-blue-800 mr-2">
              ← Back to Dashboard
            </Link>
          </div>

          {/* Article header */}
          <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-6">
            <div className="px-4 py-5 sm:px-6">
              <h1 className="text-2xl font-bold text-gray-900">{article.title}</h1>
              <div className="mt-2 flex items-center space-x-4">
                <span
                  className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    article.status === "APPROVED"
                      ? "bg-green-100 text-green-800"
                      : article.status === "REJECTED"
                      ? "bg-red-100 text-red-800"
                      : "bg-yellow-100 text-yellow-800"
                  }`}
                >
                  {article.status}
                </span>
                <div className="flex items-center">
                  <span className="text-yellow-400">{'★'.repeat(Math.round(article.averageRating))}</span>
                  <span className="text-gray-300">{'★'.repeat(5 - Math.round(article.averageRating))}</span>
                  <span className="ml-1 text-sm text-gray-500">
                    ({article.averageRating.toFixed(1)}/5, {article.ratingCount} ratings)
                  </span>
                </div>
              </div>
            </div>
            <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
              <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
                <div>
                  <dt className="text-sm font-medium text-gray-500">Authors</dt>
                  <dd className="mt-1 text-sm text-gray-900">{article.authors.join(", ")}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Journal</dt>
                  <dd className="mt-1 text-sm text-gray-900">{article.journal}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Year</dt>
                  <dd className="mt-1 text-sm text-gray-900">{article.year}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">DOI</dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    <a
                      href={`https://doi.org/${article.doi}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800"
                    >
                      {article.doi}
                    </a>
                  </dd>
                </div>
              </dl>
            </div>
          </div>

          {/* Evidence section */}
          {article.evidence && article.evidence.length > 0 && (
            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
              <div className="px-4 py-5 sm:px-6">
                <h2 className="text-lg font-medium text-gray-900">Evidence</h2>
              </div>
              <div className="border-t border-gray-200">
                <ul className="divide-y divide-gray-200">
                  {article.evidence.map((item) => (
                    <li key={item._id} className="px-4 py-5 sm:px-6">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <Link
                            href={`/dashboard/practices/${item.practice._id}`}
                            className="text-sm font-medium text-blue-600 hover:text-blue-800"
                          >
                            {item.practice.name}
                          </Link>
                          <span className="mx-2 text-gray-500">→</span>
                          <span className="text-sm text-gray-900">{item.claim.statement}</span>
                        </div>
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            item.result === "AGREE"
                              ? "bg-green-100 text-green-800"
                              : item.result === "DISAGREE"
                              ? "bg-red-100 text-red-800"
                              : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {item.result}
                        </span>
                      </div>
                      <div className="flex space-x-2 mb-2">
                        <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-800">
                          Research: {item.researchType}
                        </span>
                        <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-800">
                          Participants: {item.participantType}
                        </span>
                        <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-800">
                          Analyst: {item.analyst.name}
                        </span>
                      </div>
                      <p className="text-sm text-gray-700">{item.notes}</p>
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