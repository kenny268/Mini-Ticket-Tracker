# Mini Ticket Tracker

A small support-ticket board: a Django API, a Next.js page, and PostgreSQL.

## Demo login

| | |
|---|---|
| Email | `demo@example.com` |
| Password | `demo-pass-123` |

Open [http://localhost:3000](http://localhost:3000) after the stack is up and sign in with the account above. Reads work before you log in. Creating a ticket or changing its status requires this user.

## Setup

```bash
cp .env.example .env
docker compose up --build
```

- Page: [http://localhost:3000](http://localhost:3000)
- API: [http://localhost:8000](http://localhost:8000)

Run the API tests in a second terminal:

```bash
docker compose exec backend python manage.py test
```

The demo user is created on API startup when that email is missing. `DEMO_USER_EMAIL` and `DEMO_USER_PASSWORD` in `.env` override the defaults.

## Code map

A request travels `urls` → `views` → `serializers` → `services` or `selectors` → `models`.

| File | Allowed to do |
|---|---|
| `backend/tickets/views.py` | Status codes. Call one serializer and one function. No ORM. |
| `backend/tickets/serializers.py` | Field rules and JSON shape. |
| `backend/tickets/services.py` | Create and update. The status-change transaction lives here. |
| `backend/tickets/selectors.py` | Filter, paginate, and aggregate. |
| `backend/tickets/models.py` | Columns, check constraints, and the list index. |
| `frontend/lib/validators.ts` | The same field rules, checked with Zod before submit. |
| `frontend/lib/api.ts` | The only frontend file that knows the API URL. |
| `frontend/hooks/useSession.ts` | Login, logout, and the access token in `sessionStorage`. |
| `frontend/hooks/useTickets.ts` | List, filter, page, create, status change, and stats. |

Login is Django's user model plus SimpleJWT. `python manage.py seed_demo_user` lives on the tickets app. There is no accounts app.

## API

| Method | Path | Auth | Result |
|---|---|---|---|
| POST | `/api/auth/token/` | Public | `{ "access": "<jwt>" }` |
| POST | `/tickets/` | JWT | `201` and the ticket. Status is always `open`. |
| GET | `/tickets/?status=&page=&limit=` | Public | `{ "data", "page", "limit", "total" }` |
| PATCH | `/tickets/<id>/` | JWT | Status, priority, or both. |
| GET | `/tickets/stats/` | Public | `{ "open", "in_progress", "closed" }` |

List defaults are page `1` and limit `20`, capped at `100`, ordered by `created_at` descending and then `id` descending. A bad status, page, or limit is `400`. An unknown ticket is `404`. A write with no token is `401`.

## Decisions and tradeoffs

New tickets always start as `open`, and priority defaults to `medium` when the client omits it. Pagination is offset pagination, ordered by `created_at` and `id`, so a page stays stable when two tickets share a timestamp; I would switch to keyset pagination once this table is large. Changing a status runs in one database transaction because the ticket row and the `TicketEvent` row have to commit together; a single insert, such as create, does not need that. Reads are public so the board can be shown before login. JWT is one seeded user, stored as an access token only, and there is no signup. Zod and the serializer share the field rules, and the server remains the source of truth. Client state is two hooks, `useSession` and `useTickets`, rather than a store. The interface is one page with three breakpoints, built from shadcn cards, buttons, and theme tokens. Compose runs the development servers; a deploy would use Gunicorn and `next build`. With more time I would add cursor pagination, refresh tokens, and comments as a new module.

## Extension

A new field on a ticket changes `models.py`, a migration, the serializer, `frontend/lib/validators.ts`, and the form. A new concept, such as comments, is a new Django app with the same five files (`models`, `selectors`, `services`, `serializers`, `views`) and one `include` in `config/urls.py`, plus one card on the page. `Ticket` does not grow comment methods. Auth, pagination, and the theme stay shared.
