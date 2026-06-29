import { NextResponse } from "next/server";

const TOKEN = process.env.GITHUB_TOKEN!;
const USERNAME = process.env.GITHUB_USERNAME || "amayannasamudram";

async function gh(path: string) {
  const res = await fetch(`https://api.github.com${path}`, {
    headers: { Authorization: `Bearer ${TOKEN}`, Accept: "application/vnd.github+json" },
    next: { revalidate: 60 },
  });
  if (!res.ok) throw new Error(`GitHub ${path}: ${res.status}`);
  return res.json();
}

export async function GET() {
  try {
    const [events, prs] = await Promise.all([
      gh(`/users/${USERNAME}/events?per_page=10`),
      gh(`/search/issues?q=is:pr+author:${USERNAME}+is:open&per_page=5`),
    ]);

    const pushes = (events as any[])
      .filter((e: any) => e.type === "PushEvent")
      .slice(0, 5)
      .map((e: any) => ({
        repo: e.repo.name.split("/")[1],
        repoFull: e.repo.name,
        branch: e.payload.ref?.replace("refs/heads/", "") ?? "main",
        message: e.payload.commits?.[0]?.message?.split("\n")[0] ?? "",
        sha: e.payload.commits?.[0]?.sha?.slice(0, 7) ?? "",
        time: e.created_at,
      }));

    const openPRs = (prs as any).items?.slice(0, 3).map((pr: any) => ({
      title: pr.title,
      repo: pr.repository_url.split("/").slice(-1)[0],
      url: pr.html_url,
      number: pr.number,
    })) ?? [];

    return NextResponse.json({ pushes, openPRs });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
