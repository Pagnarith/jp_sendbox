/**
 * Sendbox health simulator — controls what /api/health/live returns.
 * Allows testing soft-switch failover scenarios without real infrastructure.
 *
 * POST { state: "healthy" | "updating" | "live-down" | "prefer-cloud" | "cloud-down" | "version-mismatch", version?: string }
 * GET returns current state
 */
import { NextResponse } from "next/server";
import Database from "better-sqlite3";
import path from "path";

const DB_PATH = path.join(process.cwd(), "db/sendbox/sendbox.db");

function getDb() {
  return new Database(DB_PATH);
}

export async function GET() {
  try {
    const db = getDb();
    const row = db.prepare("SELECT * FROM sendbox_health_state WHERE id = 1").get() as Record<string, unknown> | undefined;
    db.close();
    if (!row) {
      return NextResponse.json({ state: "healthy", version: "1.0.91" });
    }
    return NextResponse.json({
      state: row.state,
      version: row.version ?? "1.0.91",
      preferCloud: Boolean(row.preferCloud),
      updating: Boolean(row.updating),
      simulateLatencyMs: row.simulateLatencyMs ?? 0,
    });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validStates = ["healthy", "updating", "live-down", "prefer-cloud", "cloud-down", "version-mismatch"];
    if (!validStates.includes(body.state)) {
      return NextResponse.json({ error: `Invalid state. Must be one of: ${validStates.join(", ")}` }, { status: 400 });
    }

    const db = getDb();
    const preferCloud = body.state === "prefer-cloud" ? 1 : 0;
    const updating = body.state === "updating" ? 1 : 0;
    const version = body.version ?? "1.0.91";
    const latency = body.simulateLatencyMs ?? 0;

    db.prepare(`
      UPDATE sendbox_health_state
      SET state = ?, version = ?, preferCloud = ?, updating = ?, simulateLatencyMs = ?, updatedAt = datetime('now')
      WHERE id = 1
    `).run(body.state, version, preferCloud, updating, latency);
    db.close();

    return NextResponse.json({ ok: true, state: body.state, version, preferCloud: Boolean(preferCloud), updating: Boolean(updating) });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}