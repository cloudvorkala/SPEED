import ArticleDetailClient from './article-detail-client';
import { Metadata } from 'next';

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  return {
    title: `文章详情 - ${id}`,
    description: '查看文章详细信息',
  };
}

export default async function ArticleDetailPage({ params }: Props) {
  const { id } = await params;
  return <ArticleDetailClient id={id} />;
}