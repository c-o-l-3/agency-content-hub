# Agency Content Hub

Central content repository for Maison Albion, Maui Pineapple Chapel, and future brands.

## Structure

```
content-hub/
├── content/              # All content organized by brand
│   ├── maison-albion/
│   ├── maui-pineapple-chapel/
│   └── _meta/            # Cross-brand content
├── site/                 # Static site generator
│   ├── templates/
│   └── static/
└── .github/workflows/    # Auto-deploy to Cloudflare Pages
```

## Access

**Public URL:** https://agency-content.pages.dev (after first deploy)

## For Agents

To publish content:
1. Write to `content/{brand}/{type}/{slug}.md`
2. Include frontmatter with title, date, tags
3. Commit to this repo
4. Auto-deploys to Cloudflare Pages

## Frontmatter Template

```yaml
---
title: "Content Title"
brand: "maison-albion" | "maui-pineapple-chapel"
type: "brand-profile" | "trend-report" | "content-strategy"
date: 2026-03-23
tags: ["tag1", "tag2"]
audience: ["stakeholders", "content-team"]
status: "draft" | "published"
---
```

## System Status

- ✅ Content Hub Agent: Configured
- ✅ Publisher Agent: Configured  
- ⏳ Cloudflare Pages: Pending first deploy
- ⏳ Initial Content: Loading brand profiles
