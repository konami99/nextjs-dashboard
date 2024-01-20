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