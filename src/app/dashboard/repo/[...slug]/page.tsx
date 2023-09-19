import { RepoPage } from "@/components/pages";

export default function Page({ params }: { params: { slug: string[] } }) {
  return <RepoPage params={params} />;
}
