import NextAuth from "next-auth"
import CognitoProvider from "next-auth/providers/cognito"

export const authOptions = {
    providers: [
        CognitoProvider({
            clientId: '3tlf8529arluoht7v5cquou8i9',
            clientSecret: '184sicauoglqskj96amola9l49ggetnoj2sd8qbipbth31k3rprp',
            issuer: 'https://cognito-idp.us-west-2.amazonaws.com/us-west-2_Ag7vIqPLy',
        }),
    ],
}

export const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };