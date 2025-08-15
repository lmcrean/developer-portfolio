#!/bin/bash
set -e

# Run single-server E2E tests
# Usage: ./run-e2e-tests.sh <web_url> [test_name]

WEB_URL="$1"
TEST_NAME="${2:-single-server-quick-test}"

if [ -z "$WEB_URL" ]; then
  echo "❌ Web URL required"
  echo "Usage: $0 <web_url> [test_name]"
  exit 1
fi

echo "🧪 Running single-server E2E tests..."
echo "📍 Web URL: $WEB_URL"
echo "🎭 Test: $TEST_NAME"

# Setup E2E environment
cd e2e

# Install E2E dependencies
echo "📦 Installing E2E dependencies..."
npm ci

# Install Playwright browsers
echo "🎭 Installing Playwright browsers..."
npx playwright install

# Pre-test validation
echo "🌐 Pre-test validation..."
for i in {1..3}; do
  echo "Web accessibility check $i/3..."
  if curl -f "$WEB_URL" -m 15 > /dev/null 2>&1; then
    echo "✅ Web app is accessible"
    break
  fi
  
  if [ $i -eq 3 ]; then
    echo "❌ Web app accessibility check failed"
    exit 1
  fi
  
  sleep 5
done

# Run E2E tests
echo "🚀 Running E2E tests..."
export WEB_URL="$WEB_URL"

npx playwright test tests/features/pull-request/${TEST_NAME}.web.spec.ts --reporter=line

echo "✅ E2E tests completed successfully!"
echo "🎯 Single-server architecture validated!"