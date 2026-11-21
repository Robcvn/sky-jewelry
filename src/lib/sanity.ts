/**
 * A small, typed client for Sanity's Query API, used at build time (src/lib/content.ts). Plain fetch, no token: the
 * production dataset is public-read, and only published documents are read. The project id and dataset come from the
 * environment (.env.local locally, workflow variables in CI); they are public values, not secrets.
 */

/** Sanity's advice: pin the date the integration was written; later API changes then never change this client. */
export const SANITY_API_VERSION = "2026-11-21";

export type SanityConfig = { projectId: string; dataset: string; endpoint: string };

export function sanityConfig(): SanityConfig | null {
  const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID?.trim();
  const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET?.trim();
  if (!projectId || !dataset) return null;
  // SANITY_API_URL is only for checking an import file locally (notes: a stand-in server that answers with the file).
  const base = process.env.SANITY_API_URL?.trim().replace(/\/$/, "") || `https://${projectId}.api.sanity.io`;
  return { projectId, dataset, endpoint: `${base}/v${SANITY_API_VERSION}/data/query/${dataset}?perspective=published` };
}

export class SanityError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "SanityError";
  }
}

/** Runs a GROQ query. POST, like the Shopify client: one uncached request per build worker, so a deploy reads fresh data. */
export async function sanityQuery<T>(config: SanityConfig, query: string, params: Record<string, unknown> = {}, timeoutMs = 15000): Promise<T> {
  let response: Response;
  try {
    response = await fetch(config.endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query, params }),
      signal: AbortSignal.timeout(timeoutMs),
    });
  } catch (error) {
    throw new SanityError(`Could not reach Sanity: ${error instanceof Error ? error.message : String(error)}`);
  }
  if (!response.ok) throw new SanityError(`Sanity answered ${response.status} ${response.statusText}.`);
  const body = (await response.json()) as { result?: T; error?: { description?: string } };
  if (body.error) throw new SanityError(`Sanity query failed: ${body.error.description ?? JSON.stringify(body.error)}`);
  return body.result as T;
}
