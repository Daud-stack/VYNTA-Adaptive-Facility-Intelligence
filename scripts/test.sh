#!/bin/bash

echo "🔍 Running Static Checks..."
npm run lint || exit 1
npm run typecheck || exit 1
pylint src/ || exit 1

echo "🧪 Running Unit Tests..."
npm run test:unit || exit 1
pytest tests/unit || exit 1

echo "🧩 Running Component Tests..."
npm run test:component || exit 1
pytest tests/component || exit 1

echo "🔗 Running Integration Tests..."
npm run test:integration || exit 1
pytest tests/integration || exit 1

echo "🌐 Running E2E Tests..."
npm run test:e2e || exit 1
pytest tests/e2e || exit 1

echo "⚡ Running Performance Tests..."
npm run test:performance || exit 1

echo "🔐 Running Security Tests..."
npm run test:security || exit 1
bandit -r . || exit 1

echo "🎉 All tests passed successfully."
