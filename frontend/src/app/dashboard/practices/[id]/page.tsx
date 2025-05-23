import Link from "next/link";
import { Metadata } from "next";

interface Practice {
  _id: string;
  name: string;
  description: string;
  claims?: Array<{
    _id: string;
    statement: string;
    evidence: Array<{
      _id: string;
      result: "AGREE" | "DISAGREE" | "NEUTRAL";
      researchType: string;
      participantType: string;
      notes: string;
      article: {
        _id: string;
        title: string;
        authors: string[];
        journal: string;
        year: number;
        doi: string;
      };
      analyst: {
        _id: string;
        name: string;
      };
    }>;
  }>;
}

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const response = await fetch(`http://localhost:4000/practices/${id}`);
  if (!response.ok) {
    return {
      title: "Practice Not Found",
    };
  }
  const practice: Practice = await response.json();
  return {
    title: practice.name,
  };
}

export default async function PracticeDetail({ params }: Props) {
  const { id } = await params;
  const response = await fetch(`http://localhost:4000/practices/${id}`);
  if (!response.ok) {
    throw new Error("Failed to fetch practice");
  }
  const practice: Practice = await response.json();

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
            <Link href="/dashboard/practices" className="text-sm text-blue-600 hover:text-blue-800 mr-2">
              ← Back to Practices
            </Link>
          </div>

          {/* Practice header */}
          <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-6">
            <div className="px-4 py-5 sm:px-6">
              <h1 className="text-2xl font-bold text-gray-900">{practice.name}</h1>
              <p className="mt-1 text-sm text-gray-500">{practice.description}</p>
            </div>
          </div>

          {/* Claims and evidence */}
          <div className="space-y-6">
            {practice.claims?.map((claim) => (
              <div key={claim._id} className="bg-white shadow overflow-hidden sm:rounded-lg">
                <div className="px-4 py-5 sm:px-6">
                  <h2 className="text-lg font-medium text-gray-900">{claim.statement}</h2>
                </div>

                <div className="border-t border-gray-200">
                  <div className="px-4 py-5 sm:px-6">
                    <h3 className="text-sm font-medium text-gray-500 mb-4">Supporting Evidence</h3>
                    {claim.evidence.length === 0 ? (
                      <p className="text-sm text-gray-500">No evidence available for this claim.</p>
                    ) : (
                      <ul className="space-y-6">
                        {claim.evidence.map((item) => (
                          <li key={item._id} className="border-b border-gray-200 pb-6 last:border-0 last:pb-0">
                            <div className="flex items-center justify-between mb-2">
                              <Link
                                href={`/dashboard/articles/${item.article._id}`}
                                className="text-sm font-medium text-blue-600 hover:text-blue-800"
                              >
                                {item.article.title}
                              </Link>
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
                            <div className="mt-2 text-sm text-gray-500">
                              {item.article.authors.join(", ")} • {item.article.journal} ({item.article.year})
                            </div>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              </div>
            ))}
            {!practice.claims || practice.claims.length === 0 ? (
              <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                <div className="px-4 py-5 sm:px-6">
                  <p className="text-sm text-gray-500">No claims available for this practice.</p>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}