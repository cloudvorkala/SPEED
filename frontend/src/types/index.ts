export interface User {
  _id: string;
  email: string;
  name: string;
  role: string;
  isAdmin: boolean;
  isModerator: boolean;
  isAnalyst: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Article {
  _id: string;
  title: string;
  abstract: string;
  authors: string[];
  journal: string;
  year: number;
  volume?: string;
  number?: string;
  pages?: string;
  doi?: string;
  status: "PENDING" | "APPROVED" | "REJECTED" | "READY_FOR_ANALYSIS" | "ANALYZED";
  rating?: number;
  rejectionReason?: string;
  moderatorId?: string;
  moderatedAt?: string;
  analyzedBy?: string;
  analyzedAt?: string;
  analysisResult?: {
    researchType: string;
    participantType: string;
    methodology: string;
    findings: string;
    limitations?: string;
    recommendations?: string;
    notes?: string;
  };
  isPeerReviewed?: boolean;
  isRelevantToSE?: boolean;
  isDuplicateChecked?: boolean;
  duplicateCheckResult?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Practice {
  _id: string;
  name: string;
  description: string;
  claims?: Array<{
    _id: string;
    statement: string;
    evidence: Array<{
      _id: string;
      result: "AGREE" | "DISAGREE" | "NEUTRAL";
    }>;
  }>;
  createdAt: string;
  updatedAt: string;
}
