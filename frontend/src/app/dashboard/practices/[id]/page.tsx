import { Metadata } from "next";
import { API_ENDPOINTS } from '@/config/api';
import PracticeDetailClient from './practice-detail-client';

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
  const response = await fetch(`${API_ENDPOINTS.PRACTICES}/${id}`);
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
  const response = await fetch(`${API_ENDPOINTS.PRACTICES}/${id}`);
  if (!response.ok) {
    throw new Error("Failed to fetch practice");
  }
  const practice: Practice = await response.json();

  return <PracticeDetailClient practice={practice} />;
}