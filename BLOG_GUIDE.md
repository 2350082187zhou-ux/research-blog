# Publishing research articles to BOTH websites

This repository is the **one source of truth** for the cybersecurity blog.

- Canonical independent blog: https://blog.zhouzedong.top/
- Automatically mirrored academic blog: https://zhouzedong.top/blog/
- Academic homepage repository: https://github.com/2350082187zhou-ux/2350082187zhou-ux.github.io

## Create a new article

Use GitHub's Add file > Create new file in this repository. Name it
`_posts/YYYY-MM-DD-short-title.md` (for example,
`_posts/2026-10-16-introduction.md`), and enter:

```markdown
---
layout: cyber-post
title: "My Research Note"
date: 2026-10-16
excerpt: "A brief description of the research note."
categories: [Research Notes]
tags: [Linux, Security]
---

# Introduction

Write the article here.
```

Commit to `main`. The independent blog automatically rebuilds on each push.
The academic website rebuilds on an hourly schedule to import the same
published articles (and the blog page's original cyber-themed design). GitHub
scheduled workflows may run late. If needed, manually run
`Deploy Academic Pages template site to Pages` in the academic repository's
Actions tab.

**Do not also edit** the academic site's `_posts`; changes there are not
canonical and will not carry over to the next build.

## Article images

Put images in `assets/blog/` or `images/blog/` in this repository. Use
a root-relative reference like `![Diagram](/assets/blog/diagram.png)`. The
academic build mirrors these image folders.

## Security conference deadlines

Conference dates/rankings are sourced from the academic website and copied
into this site's build by its deployment workflow; there is no need to update
two independent copies. Check official calls for papers for changes.

## Blog presentation

This blog retains the Cybersecurity Blog design originally at
`zhouzedong.top/blog/`. The academic site's blog homepage is mirrored from
this repo's `index.md`, with its `/blog/` permalink preserved. Dedicated
blog CSS, animations, and SVG artwork are also copied during academic builds.

Do not add secrets, credentials, confidential datasets or unpublished
sensitive experiments to public repositories.
