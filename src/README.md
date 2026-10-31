# Auth Backend

A TypeScript and Express backend project for authentication-related functionality. The project includes authentication routes, session and password-reset modules, email delivery, authorization middleware, and MongoDB integration.

> **Documentation scope:** This README is based on the provided `package.json`, `.env.example`, source-folder listing, `app.ts`, and route files. Details that require source not provided—such as exact request and response formats, model fields, and test coverage—are identified as unverified rather than guessed.

## Features and components

The project contains modules and dependencies for:

- User registration, login, and authenticated-user routes.
- Access and refresh token utilities using JSON Web Tokens.
- Password hashing using `bcrypt`.
- Session management.
- Password-reset routes and services.
- Email delivery through Nodemailer.
- Request validation using Zod.
- MongoDB persistence through Mongoose.
- Authentication and role-authorization middleware.
- Security-related dependencies including Helmet and Express rate limiting.

These describe components present in the project materials. Their exact behavior and configuration depend on the implementation.

## Technology stack

| Area | Technology |
|---|---|
| Runtime | Node.js |
| Language | TypeScript with ECMAScript modules |
| HTTP framework | Express 5 |
| Database and ODM | MongoDB and Mongoose |
| Authentication libraries | `jsonwebtoken`, `bcrypt` |
| Validation | Zod |
| Security and request handling | Helmet, `express-rate-limit`, CORS, `cookie-parser` |
| Email | Nodemailer |
| Environment configuration | dotenv |
| Development runner | `tsx` |
| Testing tools | Vitest, Supertest, `mongodb-memory-server` |

The supplied dependencies include Vitest 5, which requires Node.js 22.12 or later. Use a compatible Node.js version to run the test scripts.

## Project structure

```text
.
├── .env.example
├── package.json
├── package-lock.json
└── src/
    ├── app.ts
    ├── server.ts
    ├── test-email.ts
    ├── config/
    │   ├── DB.ts
    │   └── env.ts
    ├── controllers/
    │   ├── auth.controller.ts
    │   └── passwordReset.controller.ts
    ├── middleware/
    │   ├── authenticate.ts
    │   ├── authorize.ts
    │   ├── errorHandler.ts
    │   ├── notFound.ts
    │   └── validate.ts
    ├── models/
    │   ├── Session.ts
    │   └── user.ts
    ├── routes/
    │   ├── admin.routes.ts
    │   └── auth.routes.ts
    ├── schemas/
    │   └── auth.schemas.ts
    ├── services/
    │   ├── auth.service.ts
    │   ├── email.service.ts
    │   ├── passwordReset.service.ts
    │   └── session.service.ts
    └── utils/
        ├── AppError.ts
        ├── cookies.ts
        ├── hash.ts
        ├── jwt.ts
        ├── passwordReset.ts
        └── refreshToken.ts
```

## Requirements

- Node.js compatible with the project dependencies. Node.js 22.12 or later is needed for Vitest 5.
- npm.
- A MongoDB instance and connection URI.
- SMTP credentials if the email functionality is used.

## Installation and local setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Copy the example environment file:

   **PowerShell**
   ```powershell
   Copy-Item .env.example .env
   ```

   **Command Prompt**
   ```cmd
   copy .env.example .env
   ```

3. Edit `.env` with valid local configuration. In particular:
   - Set `MONGO_URI` to a valid MongoDB connection string.
   - Replace the JWT placeholder values with strong, unique secrets.
   - Configure SMTP values if email delivery is required.

   The example `MONGO_URI` is a placeholder and may not be a valid URI for your MongoDB deployment.

4. Start the development server:

   ```bash
   npm run dev
   ```

The development script runs `src/server.ts` using `tsx` watch mode. Check `src/server.ts` and `src/config/env.ts` for startup behavior, port handling, and configuration validation.

## Environment variables

These variable names and example values appear in `.env.example`. Their required/optional status and validation rules should be confirmed in `src/config/env.ts`.

| Variable | Example | Purpose |
|---|---|---|
| `NODE_ENV` | `development` | Environment mode |
| `port` | `5000` | Example server port setting; the example uses lowercase `port` |
| `MONGO_URI` | `mongodb+srv://localhost:27017/auth-backend` | MongoDB connection string; replace with a valid URI |
| `JWT_ACCESS_SECRET` | `CHANGE_THIS_ACCESS_SECRET` | Example access-token signing secret; replace before use |
| `JWT_REFRESH_SECRET` | `CHANGE_THIS_REFRESH_SECRET` | Example refresh-token signing secret; replace before use |
| `ACCESS_TOKEN_EXPIRES_IN` | `15m` | Example access-token lifetime |
| `REFRESH_TOKEN_EXPIRES_IN` | `7d` | Example refresh-token lifetime |
| `CLIENT_URL` | `http://localhost:3000` | Client URL or origin configuration |
| `SMTP_HOST` | *(empty)* | SMTP server host |
| `SMTP_PORT` | `587` | SMTP server port |
| `SMTP_USER` | *(empty)* | SMTP username |
| `SMTP_PASS` | *(empty)* | SMTP password |
| `SMTP_FROM` | *(empty)* | Sender address or label |

Do not commit `.env` files or real credentials. The example JWT values are placeholders, not secure secrets. Confirm the expected variable names and defaults against the environment configuration and its consumers.

## Available scripts

| Command | Description |
|---|---|
| `npm run dev` | Runs `src/server.ts` with `tsx` watch mode. |
| `npm run build` | Runs the TypeScript compiler (`tsc`). |
| `npm start` | Runs `node dist/index.js`. Confirm that the TypeScript build configuration emits this file. |
| `npm run typecheck` | Runs `tsc --noEmit`. |
| `npm test` | Runs Vitest once. |
| `npm run test:watch` | Starts Vitest in watch mode. |

## API

The application mounts authentication routes at `/api/auth`. The following endpoints are defined in `src/routes/auth.routes.ts`.

| Method | Path | Middleware / validation | Purpose |
|---|---|---|---|
| `POST` | `/api/auth/register` | `registerSchema` validation | Register a user. |
| `POST` | `/api/auth/login` | `loginSchema` validation | Log in. |
| `GET` | `/api/auth/me` | `authenticate` | Handle a request for the authenticated user's information. |
| `POST` | `/api/auth/refresh` | No route-level middleware shown | Refresh authentication credentials. |
| `POST` | `/api/auth/logout` | No route-level middleware shown | Handle logout. |
| `POST` | `/api/auth/forget-password` | `forgetPasswordSchema` validation | Start the password-reset process. |
| `POST` | `/api/auth/reset-password` | `resetPasswordSchema` validation | Handle a password-reset request. |

Request and response formats, required fields, and error responses are defined by the controllers and schemas. See `src/controllers/auth.controller.ts`, `src/controllers/passwordReset.controller.ts`, and `src/schemas/auth.schemas.ts` for details.

### Admin route

`src/routes/admin.routes.ts` defines `GET /dashboard`, protected by `authenticate` and `authorize("admin")`.

However, `src/app.ts` mounts the admin router using `app.use("api/admin", adminRoutes)`, without a leading `/`. The conventional intended URL appears to be `/api/admin/dashboard`, but the mount path should be verified and corrected to `/api/admin` before relying on that URL.

## Authentication and security

The project includes JWT, password-hashing, cookie, session, authentication, and authorization components. It also depends on Helmet, CORS, and Express rate limiting. The provided files do not establish how or where every dependency is configured, so verify the implementation before relying on a particular security behavior.

Relevant files include:

- `src/middleware/authenticate.ts` and `src/middleware/authorize.ts`
- `src/utils/jwt.ts`, `src/utils/refreshToken.ts`, `src/utils/hash.ts`, and `src/utils/cookies.ts`
- `src/services/session.service.ts`
- `src/app.ts` and `src/config/env.ts`

For deployment, use strong, distinct secrets; configure CORS and cookies for the intended origins and transport; and keep database and SMTP credentials out of source control.

## Database models

The project includes model files named `Session.ts` and `user.ts`:

- `src/models/Session.ts`
- `src/models/user.ts`

The supplied materials do not include their schemas, indexes, field definitions, or relationships. Consult those files for the authoritative database structure.

## Testing

Run the test suite with:

```bash
npm test
```

Run Vitest in watch mode with:

```bash
npm run test:watch
```

The dependencies include Vitest, Supertest, and `mongodb-memory-server`, but the supplied materials do not include test files or configuration. Therefore, the presence, scope, and coverage of tests cannot be confirmed.

Run the TypeScript type check with:

```bash
npm run typecheck
```

## License

No project license was included in the supplied materials. Add a `LICENSE` file before publishing if you intend to grant reuse rights.