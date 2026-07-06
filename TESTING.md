# Developer Testing Guide

## What to run before pushing
- Lint
- Type-check
- Unit tests
- Component tests

## What to run before merging
- Integration tests
- E2E tests

## What to run before release
- Performance tests
- Security tests

## Golden Rule
If it's not tested, it doesn't exist.

---

# Testing Governance

## Coverage Targets
- Unit: 80%
- Integration: 60%
- E2E: 20–40%

## Naming Convention
should_<expected_behavior>_when_<condition>

## Mocking Rules
- Unit → heavy mocking
- Integration → minimal mocking
- E2E → zero mocking

## Test Data Rules
- No real data
- Use factories
- Use fixtures
- Use randomization for fuzzing

## Automation
- Pre-commit hooks
- CI pipeline
- Scheduled scans
