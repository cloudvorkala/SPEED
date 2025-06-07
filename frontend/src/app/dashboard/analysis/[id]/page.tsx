import AnalysisFormClient from './analysis-form-client';
import { Metadata } from 'next';

export const dynamic = 'force-dynamic';

type Props = {
  params: Promise<{ id: string }>
}

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Article Analysis',
    description: 'Analyze article details and provide feedback'
  };
}

export default async function AnalysisFormPage({ params }: Props) {
  const { id } = await params;
  return <AnalysisFormClient id={id} />;
}