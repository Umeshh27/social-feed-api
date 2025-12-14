# Social Feed API

A backend built to feel like the feed behind a modern social app: fast reads, low latency, and predictable performance. It leans on fan-out-on-write, Redis caching, and cursor pagination so feeds stay quick even when reads spike.

---

## What this is

An Express-powered REST API that serves personalized feeds. It is tuned for read-heavy traffic and keeps counters and cache freshness in mind, so you get the snappy experience you expect from a social feed.

---

## Stack

- Node.js and Express for the API
- PostgreSQL for durable data
- Redis for feed caching
- JWT for auth

---

## Layout

```
src/
├── app.js                 # Express app setup
├── server.js              # Server entry point
├── config/
│   ├── db.js              # PostgreSQL connection
│   └── redis.js           # Redis connection
├── middleware/
│   └── auth.js            # JWT authentication middleware
├── routes/
│   ├── auth.routes.js     # Auth APIs
│   ├── users.routes.js    # Follow / Unfollow APIs
│   ├── posts.routes.js    # Create posts
│   ├── interactions.routes.js # Like, Unlike, Comment
│   └── feed.routes.js     # Feed API
├── services/
│   ├── auth.service.js
│   ├── follow.service.js
│   ├── post.service.js
│   ├── interaction.service.js
│   └── feed.service.js
```

---

## Models at a glance

- User: id, username, profile_info, follower_count, following_count
- Follow: follower_id, following_id
- Post: id, user_id, content, like_count, comment_count
- Like: user_id, post_id
- Comment: id, user_id, post_id, content

---

## Auth

- JWT tokens gate any state-changing request
- Middleware adds the authenticated user to `req.user.id`

---

## Features

- Follow / unfollow with atomic counter updates
- Create posts (persisted in PostgreSQL)
- Like, unlike, comment with idempotent operations and denormalized counts

---

## Feed design

- Fan-out-on-write: every new post ID is pushed to followers’ Redis feeds
- Redis ZSET per user: key `feed:<user_id>`, score = timestamp, TTL ~1–2 hours
- Fast reads via `GET /feed` with cursor-based pagination; falls back to Postgres on cache miss

---

## Performance notes

- Redis caching to keep reads hot
- Denormalized counters to avoid COUNT churn
- Indexed foreign keys in PostgreSQL

---

## Pagination

- Cursor-based using timestamps to avoid slow deep pages
- Example: `GET /feed?cursor=1702540000000`

---

## Status

- Auth ✔
- Follow system ✔
- Post creation ✔
- Likes and comments ✔
- Redis feed caching ✔
- Fan-out-on-write ✔
- Cursor pagination ✔
- Cache-miss fallback ✔

---

## Why it matters

This codebase shows how to deliver a responsive social feed with battle-tested patterns: cache-first reads, predictable write paths, and clear separation between routing, services, and data. It is designed to be both understandable and production-friendly.
