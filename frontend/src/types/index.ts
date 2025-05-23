export interface Article {
  _id: string;
  title: string;
  abstract: string;
  authors: string[];
  journal: string;
  year: number;
  status: "PENDING" | "APPROVED" | "REJECTED";
  rating?: number;
  rejectionReason?: string;
  moderatorId?: string;
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