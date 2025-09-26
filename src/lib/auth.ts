import { NextAuthOptions } from 'next-auth';
import { Session, DefaultSession } from 'next-auth';
import { JWT } from 'next-auth/jwt';

// Extend the default session type
declare module 'next-auth' {
  interface Session extends DefaultSession {
    user: {
      id: string;
      email: string;
      name?: string;
      role?: string;
    } & DefaultSession['user'];
  }

  interface User {
    id: string;
    email: string;
    name?: string;
    role?: string;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    email: string;
    role?: string;
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    // Configuration des providers d'authentification
    // Pour l'instant, nous utilisons un système d'auth personnalisé
  ],
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      session.user.id = token.id;
      session.user.email = token.email;
      session.user.role = token.role;
      return session;
    },
  },
  pages: {
    signIn: '/auth/login',
    error: '/auth/access-denied',
  },
};