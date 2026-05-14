import CompanyDetailClient from "@/components/company-detail-client";

export default async function CompanyPage({ params }: { params: Promise<{ ticker: string }> }) {
  const { ticker } = await params;
  return <CompanyDetailClient ticker={ticker} />;
}
