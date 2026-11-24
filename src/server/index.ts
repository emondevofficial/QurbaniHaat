import express from "express";
import path from "node:path";
import { toNodeHandler } from "better-auth/node";
import { auth, googleOAuthConfigured } from "./auth";

const app = express();
const port = Number(process.env.PORT || 3000);
const distPath = path.resolve(process.cwd(), "dist");

app.disable("x-powered-by");

app.get("/api/auth/config", (_req, res) => {
  res.setHeader("Cache-Control", "no-store");
  res.json({ googleEnabled: googleOAuthConfigured });
});

app.all(/^\/api\/auth(?:\/.*)?$/, toNodeHandler(auth));
app.use(express.static(distPath, { index: false }));
app.get("*", (_req, res, next) => {
  res.sendFile(path.join(distPath, "index.html"), (error) => {
    if (error) next(error);
  });
});

app.use((error: unknown, _req: express.Request, res: express.Response, next: express.NextFunction) => {
  if (res.headersSent) {
    next(error);
    return;
  }
  console.error("HTTP server error:", error);
  res.status(500).json({ error: "An unexpected server error occurred." });
});

app.listen(port, "0.0.0.0", () => {
  console.log(`QurbaniHaat server listening on port ${port}`);
});
