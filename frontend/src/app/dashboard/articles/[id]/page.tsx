import Link from "next/link";

export default function ArticleDetail({ params }: { params: { id: string } }) {
  // 在实际应用中，这里会根据ID从API获取数据
  const articleId = params.id;

  // 模拟数据
  const articleData = {
    id: articleId,
    title: "Test-Driven Development and its Impact on Software Quality",
    authors: ["John Smith", "Jane Doe"],
    journal: "Journal of Software Engineering",
    year: 2022,
    volume: "45",
    number: "2",
    pages: "157-172",
    doi: "10.1145/1234567.1234568",
    status: "APPROVED",
    submitter: {
      id: "user1",
      name: "Robert Johnson",
      email: "robert@example.com",
    },
    moderator: {
      id: "moderator1",
      name: "Admin User",
      email: "admin@example.com",
    },
    moderationDate: "2023-04-15",
    averageRating: 4.2,
    ratingCount: 5,
    evidence: [
      {
        id: "evidence1",
        claim: {
          id: "claim1",
          statement: "Improves Code Quality",
          practice: {
            id: "tdd",
            name: "Test-Driven Development",
          },
        },
        result: "AGREE",
        researchType: "EXPERIMENT",
        participantType: "PRACTITIONER",
        notes: "This study showed significant improvement in code quality metrics when TDD was applied.",
        analyst: {
          id: "user2",
          name: "Mary Williams",
        },
      },
      {
        id: "evidence2",
        claim: {
          id: "claim2",
          statement: "Reduces Defects",
          practice: {
            id: "tdd",
            name: "Test-Driven Development",
          },
        },
        result: "AGREE",
        researchType: "EXPERIMENT",
        participantType: "PRACTITIONER",
        notes: "The experiment demonstrated a 25% reduction in defects for teams using TDD.",
        analyst: {
          id: "user2",
          name: "Mary Williams",
        },
      },
      {
        id: "evidence3",
        claim: {
          id: "claim3",
          statement: "Increases Productivity",
          practice: {
            id: "tdd",
            name: "Test-Driven Development",
          },
        },
        result: "NEUTRAL",
        researchType: "EXPERIMENT",
        participantType: "PRACTITIONER",
        notes: "No significant impact on productivity was observed in this study.",
        analyst: {
          id: "user3",
          name: "David Brown",
        },
      },
    ],
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
              href="/dashboard/search"
              className="text-sm text-blue-600 hover:text-blue-800 mr-2"
            >
              ← Back to Search
            </Link>
          </div>

          {/* Article header */}
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6">
              <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-gray-900">{articleData.title}</h1>
                <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                  {articleData.status}
                </span>
              </div>
              <p className="mt-1 text-sm text-gray-500">
                DOI: <a href={`https://doi.org/${articleData.doi}`} className="text-blue-600 hover:text-blue-800" target="_blank" rel="noreferrer">{articleData.doi}</a>
              </p>
            </div>
            <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
              <dl className="grid grid-cols-1 gap-x-4 gap-y-4 sm:grid-cols-2">
                <div className="sm:col-span-1">
                  <dt className="text-sm font-medium text-gray-500">Authors</dt>
                  <dd className="mt-1 text-sm text-gray-900">{articleData.authors.join(", ")}</dd>
                </div>
                <div className="sm:col-span-1">
                  <dt className="text-sm font-medium text-gray-500">Journal</dt>
                  <dd className="mt-1 text-sm text-gray-900">{articleData.journal}</dd>
                </div>
                <div className="sm:col-span-1">
                  <dt className="text-sm font-medium text-gray-500">Year</dt>
                  <dd className="mt-1 text-sm text-gray-900">{articleData.year}</dd>
                </div>
                <div className="sm:col-span-1">
                  <dt className="text-sm font-medium text-gray-500">Volume / Number / Pages</dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {articleData.volume && `Vol. ${articleData.volume}`}
                    {articleData.number && `, No. ${articleData.number}`}
                    {articleData.pages && `, pp. ${articleData.pages}`}
                  </dd>
                </div>
                <div className="sm:col-span-1">
                  <dt className="text-sm font-medium text-gray-500">Rating</dt>
                  <dd className="mt-1 text-sm text-gray-900 flex items-center">
                    <span className="text-yellow-400">{'★'.repeat(Math.round(articleData.averageRating))}</span>
                    <span className="text-gray-300">{'★'.repeat(5 - Math.round(articleData.averageRating))}</span>
                    <span className="ml-1">({articleData.averageRating.toFixed(1)}/5 from {articleData.ratingCount} ratings)</span>
                  </dd>
                </div>
                <div className="sm:col-span-1">
                  <dt className="text-sm font-medium text-gray-500">Submitted by</dt>
                  <dd className="mt-1 text-sm text-gray-900">{articleData.submitter.name}</dd>
                </div>
              </dl>
            </div>
          </div>
        </div>

        {/* Evidence section */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Evidence</h2>
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <ul className="divide-y divide-gray-200">
              {articleData.evidence.map((item) => (
                <li key={item.id} className="px-4 py-5 sm:px-6">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center">
                      <Link
                        href={`/dashboard/practices/${item.claim.practice.id}`}
                        className="text-sm font-medium text-blue-600 hover:text-blue-800"
                      >
                        {item.claim.practice.name}
                      </Link>
                      <span className="mx-2 text-gray-500">→</span>
                      <span className="text-sm font-medium text-gray-900">{item.claim.statement}</span>
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
                  <div className="flex flex-wrap gap-2 mb-2">
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

        {/* Actions section */}
        <div className="flex justify-end space-x-4">
          <button className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none">
            Add Evidence
          </button>
          <button className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none">
            Rate Article
          </button>
        </div>
      </div>
    </div>
  );
}