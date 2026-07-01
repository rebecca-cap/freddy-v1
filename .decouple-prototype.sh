#!/usr/bin/env bash
# Decouple one prototype from the shared proto-base node_modules and freeze it
# to the proto-base's CURRENT dependency resolution (Frank's "current runtime"
# choice), then boot it and verify it renders. Idempotent. Prints one
# RESULT_JSON: <json> line at the end. Usage: decouple-prototype.sh <TARGET_DIR> <PORT>
set -uo pipefail

TARGET="${1:?need target dir}"
PORT="${2:?need port}"
PROTOBASE="/Users/frankoverland/freddy/proto-base"
EXCALIBRR_REAL="/Users/frankoverland/freddy/excalibrr-freddy"
GROOT="$(npm root -g)"
RENDER="/tmp/render-check.mjs"

emit() { echo "RESULT_JSON: $1"; }
jbool() { [ "$1" = "true" ] && echo true || echo false; }

cd "$TARGET" 2>/dev/null || { emit "{\"target\":\"$TARGET\",\"ok\":false,\"step\":\"cd\"}"; exit 1; }

# 1. Align package.json to proto-base's runtime deps (+ excalibrr -> absolute real path)
node -e '
  const fs=require("fs"), f="package.json";
  const p=JSON.parse(fs.readFileSync(f,"utf8"));
  p.dependencies=p.dependencies||{};
  p.dependencies["antd"]="4.24.16";
  p.dependencies["react-router-dom"]="6.28.1";
  p.dependencies["openapi-fetch"]="^0.13.0";
  p.dependencies["@gravitate-js/excalibrr"]="file:'"$EXCALIBRR_REAL"'";
  fs.writeFileSync(f, JSON.stringify(p,null,2)+"\n");
' || { emit "{\"target\":\"$TARGET\",\"ok\":false,\"step\":\"align\"}"; exit 1; }

# 2. Tear down the symlink + any stale yarn state
[ -L node_modules ] && rm node_modules
rm -rf node_modules .yarn/install-state.gz .yarn/cache

# 3. Seed lockfile + cache from proto-base (offline + matching checksums)
cp "$PROTOBASE/yarn.lock" yarn.lock
mkdir -p .yarn/cache
cp -Rc "$PROTOBASE/.yarn/cache/." .yarn/cache/ 2>/dev/null || cp -R "$PROTOBASE/.yarn/cache/." .yarn/cache/

# 4. Fix stale react-router import if present (test-1)
RRFIX=false
if [ -f src/hooks/useNavigationBlock.ts ] && grep -q 'unstable_useBlocker' src/hooks/useNavigationBlock.ts; then
  sed -i '' 's/unstable_BlockerFunction/BlockerFunction/g; s/unstable_useBlocker as useBlocker/useBlocker/g; s/unstable_useBlocker/useBlocker/g' src/hooks/useNavigationBlock.ts
  RRFIX=true
fi

# 5. Install (offline-capable via seeded cache)
yarn install > "/tmp/decouple-install-$PORT.log" 2>&1
INSTALL_RC=$?

NM_REAL=false; [ -d node_modules ] && [ ! -L node_modules ] && NM_REAL=true
RRV="$(node -p "require('./node_modules/react-router-dom/package.json').version" 2>/dev/null || echo MISSING)"
UBLOCK="$(node -e "process.stdout.write(typeof require('./node_modules/react-router-dom').useBlocker)" 2>/dev/null || echo missing)"

if [ "$INSTALL_RC" != "0" ] || [ "$NM_REAL" != "true" ]; then
  emit "{\"target\":\"$TARGET\",\"ok\":false,\"step\":\"install\",\"installRc\":$INSTALL_RC,\"nodeModulesReal\":$(jbool $NM_REAL),\"reactRouterDom\":\"$RRV\",\"rrFix\":$(jbool $RRFIX)}"
  exit 1
fi

# 6. Boot dev server (kill anything already on the port first)
lsof -ti tcp:$PORT 2>/dev/null | xargs kill 2>/dev/null
VITE_PORT=$PORT yarn start > "/tmp/decouple-boot-$PORT.log" 2>&1 &
for i in $(seq 1 45); do curl -s -o /dev/null "http://localhost:$PORT/" && break; sleep 1; done
BOOT_HTTP="$(curl -s -o /dev/null -w '%{http_code}' "http://localhost:$PORT/" 2>/dev/null)"

# 7. Render check via Playwright
RENDER_JSON="$(node "$RENDER" "http://localhost:$PORT/" "/tmp/decouple-shot-$PORT.png" 2>/dev/null || echo '{}')"

# 8. Tear down dev server
lsof -ti tcp:$PORT 2>/dev/null | xargs kill 2>/dev/null

# 9. Compose result
node -e '
  const r=JSON.parse(process.argv[1]||"{}");
  const info=r.info||{}; const pe=r.pageErrors||[];
  const out={
    target: process.argv[2],
    ok: (process.argv[3]==="200") && (info.rootChildren>0) && (info.bodyTextLen>200) && pe.length===0,
    step: "verified",
    installRc: 0,
    nodeModulesReal: true,
    reactRouterDom: process.argv[4],
    useBlocker: process.argv[5],
    rrFix: process.argv[6]==="true",
    bootHttp: process.argv[3],
    rootChildren: info.rootChildren||0,
    bodyTextLen: info.bodyTextLen||0,
    title: info.title||"",
    pageErrors: pe.slice(0,5),
  };
  console.log("RESULT_JSON: "+JSON.stringify(out));
' "$RENDER_JSON" "$TARGET" "$BOOT_HTTP" "$RRV" "$UBLOCK" "$RRFIX"
