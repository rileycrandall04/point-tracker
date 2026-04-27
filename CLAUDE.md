# Project conventions

Working notes for Claude sessions on the MWA Point Tracker repo.

## Service worker cache bump

`sw.js` has a versioned `CACHE_NAME` (e.g. `mwa-tracker-v187`). Until that
constant changes, the service worker keeps serving the previously-cached
`index.html`, so users won't see new code shipped to master.

**Whenever a PR modifies `index.html` (or any asset listed in `sw.js` →
`ASSETS`), bump `CACHE_NAME` to the next integer in the same commit.**
The bump can ride along with the feature commit or be its own follow-up
commit on the same branch — either way, ship them together.

## Branch and PR flow

- Develop on `claude/<short-description>` branches off `master`.
- Open a PR via the GitHub MCP tools, then squash-merge.
- Don't push directly to `master`.

## Pre-commit check

Before committing changes to `index.html`, run a quick syntax sanity
check on every inline `<script>` block:

```bash
node -e "const fs=require('fs');const html=fs.readFileSync('index.html','utf8');const m=html.match(/<script[^>]*>([\s\S]*?)<\/script>/g);for(let i=0;i<m.length;i++){const inner=m[i].replace(/^<script[^>]*>/,'').replace(/<\/script>$/,'');try{new Function(inner);}catch(e){console.error('Error #'+i+':',e.message);}}console.log('ok')"
```

This catches the easy class of "I accidentally broke a brace" errors
before they hit master.
