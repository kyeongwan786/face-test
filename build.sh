#!/bin/bash
set -e  # 오류 발생 시 스크립트 중단

echo ""
echo "=============================="
echo "✅ Installing dependencies with legacy-peer-deps..."
echo "=============================="
echo ""
npm install --legacy-peer-deps

echo ""
echo "=============================="
echo "✅ Building project..."
echo "=============================="
echo ""
npm run build

echo ""
echo "=============================="
echo "🎉 Build completed successfully!"
echo "=============================="
