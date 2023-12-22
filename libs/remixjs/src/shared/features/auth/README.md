# Overview

This module handles user authentication, including login, logout, session management, and authentication checking, using cookie sessions with Remix and Axios.

# Usage

### SessionStorage Class

The `SessionStorage` class implements `ISessionStorage` and provides methods to manage user sessions.

##### Methods

- **login({ email, password, request })**: Attempts to log the user in and sets user information and authentication token in the session.
- **logout({ request })**: Logs the user out by destroying the session.
- **getSession({ request })**: Retrieves the current session data.
- **checkedAuthentication({ request })**: Checks if the user is authenticated and redirects to the login page if not.

###### Configure

Environment Variables

- **SESSION_SECRET**: Secret key(s) used for signing the session cookie.

# Examples

```typescript
import { storage } from "...";

// Login
const loginResult = await storage.login({
  email: "user@example.com",
  password: "password",
  request: requestObject,
});

// Logout
await storage.logout({ request: requestObject });

// Get Session
const sessionData = await storage.getSession({ request: requestObject });

// Check Authentication
await storage.checkedAuthentication({ request: requestObject });
```
