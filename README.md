# Public Dashboards (Umbrella Repo)

One public repo, multiple dashboards - keeps public-facing output
separate from the private career/EB-1A work, without needing a new
repo (and new GitHub Pages setup) for every future dashboard.

## Structure
```
public-dashboards/
├── v20-dashboard/
│   ├── index.html
│   └── buy_zone_candidates.csv    <- synced daily by ai-build-2026's workflow
└── (future dashboards go in their own subfolder here)
```

## Setup
1. Create this repo as PUBLIC (required for free GitHub Pages)
2. Settings -> Pages -> Deploy from branch -> main -> / (root)
3. Live at: https://<username>.github.io/public-dashboards/

Each subfolder becomes its own clean URL automatically:
https://<username>.github.io/public-dashboards/v20-dashboard/

## Adding a future dashboard
1. New subfolder here, e.g. `some-new-dashboard/`
2. Add its index.html
3. Update whichever private-repo workflow produces its data to sync
   into `public-dashboards/some-new-dashboard/` the same way
   v20-daily.yml does for v20-dashboard/ (see the "Sync to public
   dashboard repo" step there for the pattern)

## Required secret (in the PRIVATE repo doing the syncing)
`DASHBOARD_REPO_TOKEN` - a fine-grained GitHub PAT scoped to ONLY this
repo, with Contents: Read and write permission. Never give it access
to any other repo, especially not your private career repo.
