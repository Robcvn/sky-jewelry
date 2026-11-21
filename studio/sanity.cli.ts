import { defineCliConfig } from "sanity/cli";

export default defineCliConfig({
  api: { projectId: "74lb1xq2", dataset: "production" },
  // The first `npx sanity deploy` asks for the studio's address (<name>.sanity.studio) and prints an app id:
  // add it here as deployment: { appId: "…" } so later deploys don't ask again.
  deployment: { autoUpdates: true },
});
