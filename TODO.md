# Fix Build Errors for Next.js + Netlify

## Issues Identified
1. Node version ^25.3.0 not supported by Netlify (max Node 20)
2. Local package not built before main build
3. Potential Prisma issues in serverless environment
4. Unused vercel.json file

## Tasks
- [x] Update Node version to 20 in package.json
- [x] Modify netlify.toml build command to build local package first
- [x] Ensure package dependencies are compatible
- [x] Remove vercel.json if not needed
- [x] Test build locally if possible (skipped due to system constraints)
