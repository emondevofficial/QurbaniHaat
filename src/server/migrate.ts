import { ensureAuthDatabase } from "./auth";

await ensureAuthDatabase();
console.log("Authentication database schema is ready.");
