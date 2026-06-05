---
id: homelab nosql linkedin post
aliases: []
tags: []
---
 
# LinkedIn Posting Strategy — Homelab Monitoring Project
 
## The angle
 
Post decisions and thinking, not features. "I chose MongoDB over a relational DB because..." outperforms "I built a monitoring dashboard" every time. You're a CS student with real infrastructure experience — the insight is the content, not the output.
 
Your existing style is personal narrative, keep that. The goal is to add technical depth to it, not swap one for the other. People who followed you through game dev and book posts will watch you grow in real time, that compounding is the whole point of building in public.
 
---
 
## Post format that works
 
```
Hook — one sentence, the interesting insight or decision, not the feature
 
2-3 short paragraphs of actual explanation
written like talking to a smart friend
not a press release or tutorial
 
What you learned, decided, or realised and why
 
Optional: screenshot, diagram, or short code snippet
```
 
Keep paragraphs short. LinkedIn is not a blog. If it looks like a wall of text on mobile it won't get read.
 
---
 
## The full posting arc
 
### Before you write a line of code
 
These are already postable right now, based on decisions already made.
 
**Post 1 — The architecture insight**
The interesting angle: your homelab isn't reliably reachable from outside, so instead of the world pulling data from it, it pushes data out. Most people haven't thought about inbound vs outbound as an architectural constraint. Explain the problem, explain the flip, draw a simple arrow diagram if you want.
 
**Post 2 — Why MongoDB**
You have a real answer to this. You have another project with SQL, you wanted to learn a pure NoSQL document store, and time-series collections in MongoDB are a legitimate use case. The fact that you consciously chose a tool for a reason and can defend it is the post — not the tool itself.
 
**Post 3 — The tiered rollup design**
One entry per minute, rolled up to hourly, then daily, then the raw data gets purged. Explain why you don't need to keep every minute forever. Draw the funnel. This is a concept used in real production observability systems — Datadog, Prometheus long-term storage — and you arrived at it yourself for a homelab project.
 
---
 
### While building
 
**Post 4 — First data point hitting Atlas**
Screenshot of the first document in MongoDB after the script goes live. Small moment, good visual, marks a real milestone. Talk about what the document structure looks like and why you shaped it that way — metadata separate from fields, timestamp as the primary index.
 
**Post 5 — TTL indexes**
Most people don't know these exist. MongoDB can auto-delete documents after a set time with a single index — no cron job, no cleanup script. The raw collection deletes itself after 24h. Short educational post, genuinely useful to other people reading it.
 
**Post 6 — The rollup trigger working**
First time the hourly rollup runs and produces a document in the hourly collection. Show a before (raw documents) and after (one aggregated hourly document). Talk about the aggregation pipeline — avg, max, why you kept both instead of just one.
 
**Post 7 — Why the API token can't live on the frontend**
-- Hono proxy on cloudfare workers !!!
The Hono proxy exists for one reason: to keep the MongoDB API key off the client. Anyone who opens devtools would see it otherwise. Short post, fundamental security concept, relevant to any developer not just DevOps people. Broad reach.
 
 
**Post 8 — The React dashboard goes live**
> Could be useful to use grafana first
 
Visual post. Screenshot of the finished page in your portfolio. Talk about the range selector switching between raw, hourly, and daily data — three API calls, three collections, one UI decision that ties the whole pipeline together visually.
 
---
 
### After it's done
 
**Post 9 — The retrospective**
What you planned vs what actually happened. What took longer than expected, what was easier, what you'd do differently. Retrospective posts perform well because they're honest and most people only post wins.
- What would id do if this was actually in production
**Post 10 — The full arc post**
One post that links everything together — the problem, the decisions, the stack, the result. Write it like you're explaining to someone who missed the whole series. This becomes the post you pin or reference in job applications.
 
---
 
## Intercalating with other content
 
The build has natural waiting periods baked in — you have to wait for data to accumulate before rollups show real behaviour. Use these gaps intentionally:
 
```
Week 1-2   → Post 1, 2, 3 (pre-build decisions)
Week 3     → Build script + Atlas setup
Week 3     → Post 4 (first data point)
Week 4     → Let it collect data, post a book thing
Week 4-5   → Build rollup triggers
Week 5     → Post 5, 6 (TTL + rollup working)
Week 5-6   → Book post or smaller project post
Week 6-7   → Build Hono proxy + React page
Week 7     → Post 7, 8 (proxy reasoning + dashboard live)
Week 8     → Post 9, 10 (retrospective + full arc)
```
 
A project that takes 6-8 weeks documented publicly is more valuable than one hammered out in a weekend. The timeline is the content.
 
---
 
## General rules
 
- **Don't wait until it's finished** to start posting. The decisions made before writing code are legitimate content.
- **One idea per post.** Don't cram the whole project into one update.
- **Visuals help but aren't mandatory.** A diagram, screenshot, or short snippet adds reach. A well-written text post is still worth posting.
- **Reply to comments properly.** If someone asks a question, answer it like you'd answer a colleague. That's how you build actual connections not just followers.
- **Don't over-optimise for the algorithm.** Post things you'd actually want to read. The people you want to attract are the ones who respond to genuine technical content.
 
