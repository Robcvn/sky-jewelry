import { defineCliConfig } from "sanity/cli";

export default defineCliConfig({
  api: { projectId: "74lb1xq2", dataset: "production" },
  // The studio's app id, printed by the first `npx sanity deploy` (https://sky-site.sanity.studio): later deploys
  // reuse it instead of asking for the address again.
  deployment: { appId: "fp9yaj81fjzmucavd7ukmour", autoUpdates: true },
});
