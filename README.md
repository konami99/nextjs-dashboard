## AWS Cognito Integration

This branch extends the [official Next.js dashboard app](https://nextjs.org/learn/dashboard-app) by using AWS Cognito as authenticator.

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

### LoginForm

`LoginForm` has been changed. The form now simply checks session. If session exists, show Log Out Button. Otherwise show Log In Button. Log In mechanism is handled by Cognito now. We no longer have to check email/password and get user from database, as in the [official Next.js dashboard app](https://nextjs.org/learn/dashboard-app).

Sign Out is still handled by `next-auth`.

![image](https://github.com/konami99/nextjs-dashboard/assets/166879/62690698-2592-4da8-938a-7e96002d6cbf)

### Route Protection

In [official Next.js dashboard app](https://nextjs.org/learn/dashboard-app), route protection is handled by `authorized` callback in `auth.config.ts`:

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

All dashboard pages (customer, invoice, overview) will be rendered inside this template. And the template checks session:

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

