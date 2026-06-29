import { NextResponse } from "next/server";

const TOKEN = process.env.VERCEL_TOKEN!;

async function vcl(path: string) {
  const res = await fetch(`https://api.vercel.com${path}`, {
    headers: { Authorization: `Bearer ${TOKEN}` },
    next: { revalidate: 60 },
  });
  if (!res.ok) throw new Error(`Vercel ${path}: ${res.status}`);
  return res.json();
}

export async function GET() {
  try {
    const [projects, deployments] = await Promise.all([
      vcl("/v9/projects?limit=10"),
      vcl("/v6/deployments?limit=10"),
    ]);

    const deploys = (deployments as any).deployments?.map((d: any) => ({
      name: d.name,
      state: d.state,   // READY | ERROR | BUILDING | CANCELED
      url: d.url ? `https://${d.url}` : null,
      branch: d.meta?.githubCommitRef ?? "main",
      message: d.meta?.githubCommitMessage?.split("\n")[0] ?? "",
      createdAt: d.createdAt,
    })) ?? [];

    const projectList = (projects as any).projects?.map((p: any) => ({
      name: p.name,
      framework: p.framework,
      updatedAt: p.updatedAt,
    })) ?? [];

    return NextResponse.json({ deploys, projects: projectList });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
