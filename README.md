# jp_sendbox

Mock testing environment mirroring JP (Sreypich Chan) UI/network with test credentials and mock data for Cloud soft-switch failover debugging.

## Purpose

Test the soft-switch failover plan **before** deploying to production. Simulate Live-down, preferCloud, updating states, and version mismatches without touching real infrastructure.

## Quick Start

```bash
npm install
npm run db:init      # create SQLite database + schema
npm run db:seed      # populate test data
npm run dev          # http://localhost:3099
```

## Test Credentials

| Role | Telegram ID | Name | Header Value |
|------|-------------|------|--------------|
| admin | 900000001 | Sendbox Admin | `admin` or `900000001` |
| readonly | 900000002 | Sendbox Viewer | `readonly` or `900000002` |
| seller | 900000003 | Test Seller One | `seller` or `900000003` |
| salon_manager | 900000004 | Salon Manager Test | `salon_manager` or `900000004` |
| company_admin | 900000005 | Company Admin Test | `company_admin` or `900000005` |
| super_admin | 900000006 | Super Admin Test | `super_admin` or `900000006` |

Pass via header: `x-sendbox-test-user: admin` (or any role/id above).

## Health Simulator

Control what `/api/health/live` returns to test failover scenarios:

```bash
# Get current state
curl http://localhost:3099/api/sendbox/health-control

# Simulate Live outage (503)
curl -X POST http://localhost:3099/api/sendbox/health-control \
  -H "Content-Type: application/json" \
  -d '{"state": "live-down"}'

# Simulate preferCloud drain
curl -X POST http://localhost:3099/api/sendbox/health-control \
  -H "Content-Type: application/json" \
  -d '{"state": "prefer-cloud"}'

# Simulate version mismatch
curl -X POST http://localhost:3099/api/sendbox/health-control \
  -H "Content-Type: application/json" \
  -d '{"state": "version-mismatch", "version": "1.0.85"}'
```

### Available States

| State | Effect |
|-------|--------|
| `healthy` | Normal operation, ok:true |
| `updating` | Fast ship badge, ok:true + updating:true |
| `live-down` | HTTP 503 — triggers outage grace → Cloud failover |
| `prefer-cloud` | Immediate Cloud drain (no grace wait) |
| `cloud-down` | Cloud unreachable simulation |
| `version-mismatch` | Returns older version than shell expects |

## Architecture

- **Database**: SQLite via better-sqlite3 (mirrors cr1f8_* Dataverse tables)
- **Auth**: Mock Telegram initData bypass (`SENDBOX_MOCK_AUTH=1`)
- **Network layer**: Same soft-switch/probe logic as JP — copied from sreypich_chan
- **UI**: Replicates JP pages with mock data providers

## Scripts

| Script | Purpose |
|--------|---------|
| `npm run dev` | Start dev server on port 3099 |
| `npm run db:init` | Create SQLite DB + apply schema |
| `npm run db:seed` | Seed test contacts/products/orders |
| `npm run db:reset` | Drop and recreate DB |
| `npm test` | Run vitest tests |

## Related

- Failover test plan: `sreypich_chan` PR (network-soft-switch.test.ts)
- Production code: `sreypich_chan/src/platform/network/`