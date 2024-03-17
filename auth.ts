import NextAuth, { NextAuthConfig } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

const authConfig: NextAuthConfig = {
    providers : [CredentialsProvider({
        type : 'credentials',
        credentials : {}
        authorize(credentials, request) {

        }
    })]
}
 
export const {auth, handlers : {GET, POST}} = NextAuth(authConfig);
