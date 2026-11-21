// A stand-in for Sanity's Query API that answers with the import file, to check what the site builds from it before (or
// without) importing: every editorial document then comes "from Sanity" through the real code path (src/lib/content.ts).
//   node scripts/serve-sanity-import.mjs [file] [port]       (defaults: studio/import/production.ndjson, 4400)
//   NEXT_PUBLIC_SANITY_PROJECT_ID=74lb1xq2 NEXT_PUBLIC_SANITY_DATASET=production SANITY_API_URL=http://127.0.0.1:4400 npm run build
// It answers only the site's one query (published documents of the editorial types). Local only; it reaches nothing.
import fs from "node:fs";
import http from "node:http";

const file = process.argv[2] ?? "studio/import/production.ndjson";
const port = Number(process.argv[3] ?? 4400);
const documents = fs.readFileSync(file, "utf8").trim().split("\n").map((line) => JSON.parse(line));

http
  .createServer((request, response) => {
    let body = "";
    request.on("data", (chunk) => (body += chunk));
    request.on("end", () => {
      const send = (status, value) => {
        response.writeHead(status, { "Content-Type": "application/json" });
        response.end(JSON.stringify(value));
      };
      if (request.method !== "POST" || !/^\/v\d{4}-\d{2}-\d{2}\/data\/query\/[\w-]+/.test(request.url ?? "")) return send(404, { error: { description: "Not found" } });
      let parsed;
      try {
        parsed = JSON.parse(body);
      } catch {
        return send(400, { error: { description: "Invalid JSON body" } });
      }
      const types = parsed.params?.types ?? [];
      const result = documents.filter((doc) => types.includes(doc._type) && !doc._id.startsWith("drafts."));
      send(200, { query: parsed.query, result, ms: 1 });
    });
  })
  .listen(port, "127.0.0.1", () => console.log(`Answering Sanity queries with ${documents.length} documents from ${file} on http://127.0.0.1:${port}`));
