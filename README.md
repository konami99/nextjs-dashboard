## AWS Cognito Integration

This branch extends the [official Next.js dashboard app](https://nextjs.org/learn/dashboard-app) by using AWS Cognito as authenticator.

## Implementation

### `next-auth` downgrade

`next-auth` was downgraded from v5.0.0-beta.4 to v4.24.5.

package.json
```
},
  "dependencies": {
    "next-auth": "4.24.5",
```

If using v5 beta, some errors will be thrown and the integration with Cognito will fail.

### LoginForm

`LoginForm` has been changed. The form now simply checks session. If session exists, show Log Out Button. Otherwise show Log In Button. Log In mechanism is handled by Cognito now. We no longer have to check email/password and get user from database, as in the [official Next.js dashboard app](https://nextjs.org/learn/dashboard-app).

Sign Out is still handled by `next-auth`.

![image](https://github.com/konami99/nextjs-dashboard/assets/166879/62690698-2592-4da8-938a-7e96002d6cbf)

### Route Protection
