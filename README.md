## AWS Cognito Integration

This branch extends the [Next.js dashboard app](https://nextjs.org/learn/dashboard-app) by using AWS Cognito as authenticator.

A demo of the dashboard app and Cognito integration can be found [here](https://nextjs-dashboard-two-mocha-74.vercel.app/)

## Create Cognito User Pool

There are many documents on internet that teach you how to create Cognito User Pool. I used [this one](https://evoila.com/blog/secure-user-authentication-with-next-js-nextauth-js-and-aws-cognito-2/).

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

### Auth handler

Create a `route.ts` in `app/api/auth/[...nextauth]/`
```
import NextAuth from "next-auth"
import CognitoProvider from "next-auth/providers/cognito"

const authOptions = {
    providers: [
        CognitoProvider({
            clientId: process.env.COGNITO_CLIENT_ID as string,
            clientSecret: process.env.COGNITO_CLIENT_SECRET as string,
            issuer: process.env.COGNITO_ISSUER as string,
        }),
    ],
}

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
```

You can find `COGNITO_CLIENT_ID` and `COGNITO_CLIENT_SECRET` in AWS Cognito console.

`COGNITO_ISSUER` is in the format of `https://cognito-idp.{region}.amazonaws.com/{PoolId}`. `PoolId` can be found in AWS Cognito console.

Make sure you don't export `authOptions` and `handler`, otherwise `npm run build` will throw error.

### LoginForm

`LoginForm` has been changed. The form now simply checks session. If session exists, show Log Out Button. Otherwise show Log In Button. Log In mechanism is handled by Cognito now. We no longer have to check email/password and get user from database, as in the [Next.js dashboard app](https://nextjs.org/learn/dashboard-app).

Sign Out is still handled by `next-auth`.

![image](https://github.com/konami99/nextjs-dashboard/assets/166879/62690698-2592-4da8-938a-7e96002d6cbf)

### Route Protection

In [Next.js dashboard app](https://nextjs.org/learn/dashboard-app), route protection is handled by `authorized` callback in `auth.config.ts`:

User can only see the contents in `/dashboard` when logged in.

```
import type { NextAuthConfig } from 'next-auth';
 
export const authConfig = {
  pages: {
    signIn: '/login',
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnDashboard = nextUrl.pathname.startsWith('/dashboard');
      if (isOnDashboard) {
        if (isLoggedIn) return true;
        return false; // Redirect unauthenticated users to login page
      } else if (isLoggedIn) {
        return Response.redirect(new URL('/dashboard', nextUrl));
      }
      return true;
    },
  },
  providers: [], // Add providers with an empty array for now
} satisfies NextAuthConfig;
```
However when I downgraded `next-auth` from v5 beta to v4, I couldn't find the [equivalent callback](https://next-auth.js.org/configuration/callbacks) to `authorized`. Therefore I added route protection by creating a new template:

/dashboard
![image](https://github.com/konami99/nextjs-dashboard/assets/166879/a14051f3-6eaf-400a-8e58-8c627a3e88da)

All dashboard pages (customer, invoice, overview) will be rendered inside this Template (which will be rendered inside the Layout). The template checks session:

```
export default async function Template({ children }: { children: React.ReactNode }) {
    const session = await getServerSession()
    if (!session || !session.user) {
        redirect('/login');
    }

    return <>{children}</>;
}
```

If session doesn't exist, redirect use back to login. Meaning user cannot see dashboard pages.

![image](https://github.com/konami99/nextjs-dashboard/assets/166879/7c56d619-1af3-44a3-bad5-60f94fecda98)

![image](https://github.com/konami99/nextjs-dashboard/assets/166879/bde06a6c-8ec3-4228-a073-2ceca8286226)

![image](https://github.com/konami99/nextjs-dashboard/assets/166879/6d2ab2cb-9a27-41aa-97fb-15148952405e)

![image](https://github.com/konami99/nextjs-dashboard/assets/166879/e5229d77-078e-4b41-93df-4cd551942d4e)

![image](https://github.com/konami99/nextjs-dashboard/assets/166879/2f8642ff-4b39-4da6-b13a-4e22060852d5)

![image](https://github.com/konami99/nextjs-dashboard/assets/166879/244a4d82-3fee-416b-949c-8af9b77937c5)





