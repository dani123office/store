# SQL Injection Fix Plan

## Changes

None — No raw SQL injection vectors found. All queries use parameterized Eloquent/Query Builder methods.

## New files

None.

## Verification goals

- [x] No `DB::raw`, `whereRaw`, `orderByRaw`, `havingRaw`, `groupByRaw` in backend application code.
- [x] All user input in queries uses Laravel parameterized binding.
- [x] No string concatenation or f-strings in SQL queries.

## Manual verification (for the human)

- If adding new database queries, always use Eloquent or Query Builder with parameterized where clauses.
- Never concatenate user input directly into SQL strings.
