# React + TypeScript + Vite + shadcn/ui

This is a template for a new Vite project with React, TypeScript, and shadcn/ui.

## Auth vulnerabilities

The JWT required to send requrests to the API is stored in a plain cookie on the frontend after login.
The user object is stored in local storage.
This exposes the frontend to certain attacks, such as:
- XSS (Cross-Site Scripting): If an attacked manages to inject malicious JavaScript code into the application, 
they can steal the JWT and pretend to be the user whose JWT they stole.
- CSRF (Cross-Site Request Forgery): If another malicious website calls the Expense Tracker API,
the cookie will be automatically sent. This means other sites can access the API on behalf of the user.
- Man-in-the-Middle (MitM) Attacks: The current setup of Expense Tracker does not use HTTPS.

Solutions:
- XSS: Make the cookie HttpOnly, which prevents JavaScript (foreign, malicious scripts) from accessing it.
- CSRF: Enable SameSite=Strict on the cookie, which prevents it from being sent in cross-site requests.
- MitM: Use HTTPS to encrypt the communication between the client and server. 
This requires setting up a reverse proxy with a TLS certificate provider, such as Nginx or Traefik with Let's Encrypt.

This will make the application more secure but still not 100% secure.
Usually I never roll my own auth. In my previous apps I used Clerk.
If I have to roll my own auth, I would use a session-based solution like BetterAuth.
