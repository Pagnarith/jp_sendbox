/**
 * Sendbox health endpoint — mirrors /api/health/live from JP.
 * Returns state controlled by /api/sendbox/health-control for failover testing.
 */
import { NextResponse } from "next/server";
import { getHealthState } from "@/platform/dataverse/sendbox-store";

export const dynamic = "force-dynamic";

export async function GET() {
  const state = getHealthState();

  // Simulate latency if configured
  if (state.simulateLatencyMs > 0) {
    await new Promise((r) => setTimeout(r, state.simulateLatencyMs));
  }

  // live-down: return 503 to simulate Mini outage
  if (state.state === "live-down") {
    return new NextResponse("Service Unavailable", { status: 503 });
  }

  // cloud-down: return ok but with cloud-specific error flag
  if (state.state === "cloud-down") {
    return NextResponse.json(
      { ok: false, error: "cloud_unreachable" },
      { status: 503 }
    );
  }

  // version-mismatch: return different version than shell expects
  if (state.state === "version-mismatch") {
    return NextResponse.json({
      ok: true,
      version: state.version || "1.0.85",
      preferCloud: state.preferCloud,
      updating: state.updating,
    });
  }

  // healthy / updating / prefer-cloud
  return NextResponse.json({
    ok: true,
    version: state.version || "1.0.91",
    preferCloud: state.preferCloud,
    updating: state.updating,
    role: "sendbox",
  });
}