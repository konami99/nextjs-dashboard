## AWS Cognito Integration

This branch extends the [official Next.js dashboard app](https://nextjs.org/learn/dashboard-app) by using AWS Cognito as authenticator.

## Implementation

The most important change is `next-auth` being downgraded from v5.0.0-beta.4 to v4.24.5.

package.json
```
},
  "dependencies": {
    "next-auth": "4.24.5",
```

If using v5 beta, some errors will be thrown and the integration will fail.
