import Link from "next/link";

export default async function PracticeDetail({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const practiceId = resolvedParams.id;

  const practiceData = {
    id: practiceId,
    name: getPracticeName(practiceId),
    description: "A detailed description of this software engineering practice and its applications in various contexts. This practice has been studied extensively in different environments including industry and academic settings.",
    claims: [
      {
        id: "claim1",
        statement: "Improves Code Quality",
        supportingEvidenceCount: 8,
        neutralEvidenceCount: 3,
        contraEvidenceCount: 2,
      },
      {
        id: "claim2",
        statement: "Reduces Defects",
        supportingEvidenceCount: 10,
        neutralEvidenceCount: 2,
        contraEvidenceCount: 1,
      },
      {
        id: "claim3",
        statement: "Increases Productivity",
        supportingEvidenceCount: 5,
        neutralEvidenceCount: 4,
        contraEvidenceCount: 6,
      },
      {
        id: "claim4",
        statement: "Improves Developer Satisfaction",
        supportingEvidenceCount: 7,
        neutralEvidenceCount: 2,
        contraEvidenceCount: 1,
      },
    ],
    relatedArticles: [
      {
        id: "article1",
        title: `Impact of ${getPracticeName(practiceId)} on Software Quality: A Case Study`,
        authors: "John Smith, Jane Doe",
        year: 2022,
        journal: "Journal of Software Engineering",
        evidenceCount: 3,
      },
      {
        id: "article2",
        title: `${getPracticeName(practiceId)} in Enterprise Environments`,
        authors: "Robert Johnson, Mary Williams",
        year: 2021,
        journal: "IEEE Transactions on Software Engineering",
        evidenceCount: 4,
      },
      {
        id: "article3",
        title: `Comparing Traditional Methods with ${getPracticeName(practiceId)}`,
        authors: "David Brown, Lisa Green",
        year: 2023,
        journal: "ACM SIGSOFT Software Engineering Notes",
        evidenceCount: 2,
      },
    ]
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
                  className="px-3 py-2 text-sm font-medium text-blue-600"
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
            <Link
              href="/dashboard/practices"
              className="text-sm text-blue-600 hover:text-blue-800 mr-2"
            >
              ← Back to Practices
            </Link>
          </div>

          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6">
              <h1 className="text-2xl font-bold text-gray-900">{practiceData.name}</h1>
            </div>
            <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
              <p className="text-gray-700">{practiceData.description}</p>
            </div>
          </div>
        </div>

        {/* Claims section */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Claims</h2>
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <ul className="divide-y divide-gray-200">
              {practiceData.claims.map((claim) => (
                <li key={claim.id} className="px-4 py-4 sm:px-6">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-gray-900">{claim.statement}</p>
                    <Link
                      href={`/dashboard/search?practice=${practiceData.id}&claim=${claim.id}`}
                      className="text-sm text-blue-600 hover:text-blue-800"
                    >
                      View Evidence →
                    </Link>
                  </div>
                  <div className="mt-2 flex items-center space-x-4">
                    <div className="flex items-center">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                        Supporting: {claim.supportingEvidenceCount}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                        Neutral: {claim.neutralEvidenceCount}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                        Contradicting: {claim.contraEvidenceCount}
                      </span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Related Articles section */}
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Related Articles</h2>
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <ul className="divide-y divide-gray-200">
              {practiceData.relatedArticles.map((article) => (
                <li key={article.id} className="px-4 py-4 sm:px-6">
                  <div>
                    <Link
                      href={`/dashboard/articles/${article.id}`}
                      className="text-sm font-medium text-blue-600 hover:text-blue-800"
                    >
                      {article.title}
                    </Link>
                  </div>
                  <div className="mt-2 flex items-center justify-between">
                    <div className="text-sm text-gray-500">
                      {article.authors} ({article.year})
                    </div>
                    <div className="text-sm text-gray-500">
                      {article.journal}
                    </div>
                  </div>
                  <div className="mt-1 text-sm text-gray-500">
                    {article.evidenceCount} evidence records
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

// 辅助函数，根据ID返回实践名称
function getPracticeName(id: string): string {
  const practiceNames: Record<string, string> = {
    "tdd": "Test-Driven Development (TDD)",
    "pair-programming": "Pair Programming",
    "code-review": "Code Review",
    "agile": "Agile Methods",
    "devops": "DevOps",
    "continuous-integration": "Continuous Integration",
  };

  return practiceNames[id] || "Software Engineering Practice";
}