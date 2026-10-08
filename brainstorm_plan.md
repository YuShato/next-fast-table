# Brainstorming & Plan: Fix prisma db seed timeouts

## Information Gathered

### Current State
- **data.json**: 415,788 records (ids 0..415787)
- **DB**: 395,265 records (ids 0..395264) — from a previous successful run
- **Missing**: 20,523 records (ids 395265..415787)
- **Test artifacts**: 371 rows with id > 100000000 (from test scripts)
- **Checkpoint**: `seed-checkpoint.json` is stale (shows nextIndex=191 but DB has 395k rows)

### Network Characteristics
- **Round-trip latency**: ~1.1s per query (very high — likely slow ISP/route to Neon us-east-1)
- **Connection stability**: TCP connections drop during sustained data transfer ("Connection terminated unexpectedly")
- **Reliable batch size**: rows ≤ ~50 work consistently; 64+ rows cause timeout (Query read timeout)
- **Single-row INSERT**: 100% reliable (3/3 rounds)
- **UNNEST with arrays**: 200 rows failed; 50 rows works
- **pg-copy-streams**: Installed but COPY also hangs — network can't sustain streaming

### Seed Script v5 Issues
1. Starts from scratch each run (regenerates data.json from Excel)
2. Adaptive batch size doubles on success (1→2→4→8→16→32→64→100) — hits timeout at 64
3. After 3 consecutive failures, SHRINK_AFTER=3 triggers stop — but the code has a bug: `insertBatchWithRetry` only retries SHRINK_AFTER=3 times, then throws; but the error message says "after 10 попыток" (MAX_RETRIES=10) — confusing
4. Fresh connection per batch is correct but wasteful
5. No TCP keepalive configuration
6. The checkpoint system is correct but the seed doesn't detect what's already in DB

### Root Cause
The issue is **network instability between this machine and Neon's us-east-1 region**. The TCP connection drops during sustained data transfer. This is not a query size issue but a network-level connectivity problem.

### Reported Error (this task)
```
An error occurred in the main function: Client has encountered a connection error and is not queryable
```
The old seed.js sent ALL 415,788 rows in a single `prisma.payment.createMany()`.
One giant INSERT over an unstable TCP connection → connection drops mid-transfer → error.

## Solution Strategy (approved)

Instead of rewriting the entire seed script, we should:

### Option A: Insert only missing records (recommended — fastest)
- Clean test artifacts
- Detect which ids are missing from DB
- Insert only the 20,523 missing records in small batches (25 rows)
- Use UNNEST for efficient parameterization
- Fresh connection per batch with keepalive
- Conservative retry logic

### Option B: Rewrite seed.js with reliable batch size
- Fixed batch size of 25 (not adaptive, not growing)
- UNNEST-based INSERT (6 params regardless of batch size)
- TCP keepalive on connections
- Clean checkpoint management
- Detect existing rows and skip them

### Option C: Use pooler connection for more stable connections
- The DATABASE_URL uses the pooler (ep-frosty-dew-a4gvwvk7-pooler)
- Pooler keeps TCP connections warm to the DB
- Might be more stable for batched inserts
- Tradeoff: pgbouncer=true limits prepared statements

## Recommended Plan (implemented)

**Phase 1: Quick fix — insert just the missing 20,523 records**
1. Clean test artifacts (rows with id > 415787)
2. Write a targeted script that:
   - Queries DB for existing ids range
   - Only inserts missing records (ids 395265..415787)
   - Uses batch size 25, UNNEST, fresh connections, keepalive
   - Retries up to 3 times per batch with backoff
3. Verify data integrity

**Phase 2: Update seed.js for future runs** ✅
1. ✅ Fixed adaptive batch size (fixed at 50, configurable via `SEED_BATCH_SIZE`)
2. ✅ Use UNNEST instead of VALUES
3. ✅ Add TCP keepalive
4. ✅ Fix the retry logic (permanent SQL errors vs transient network errors; exponential backoff)
5. ✅ Add detection of existing rows to skip / full rewrite on count mismatch
6. ✅ Add checkpoint `prisma/seed-checkpoint.json` with data hash for resume after crash
7. ✅ Final verification `COUNT(*) === total` + sequence reset

## File Changes
- `prisma/seed.js` — rewritten: reliable batch size (50), UNNEST, keepalive, retries, checkpoint, full rewrite on count mismatch
- `brainstorm_plan.md` — updated with this plan
- `TODO.md` — updated with completed tasks
- `prisma/seed-checkpoint.json` — will be regenerated on next run

## Estimated Time
- Phase 1: ~15 minutes (20,523 records / 25 per batch = 821 batches × 1.1s = 902s)
- Phase 2: immediate (code change, no runtime)

