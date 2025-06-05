import { Suspense } from "react";
import ArticlePageContent from "./article-page-content"; // Extracted logic

export default function SubmittedArticlesPageWrapper() {
  return (
    <Suspense fallback={<div className="p-6">Loading...</div>}>
      <ArticlePageContent />
    </Suspense>
  );
}
