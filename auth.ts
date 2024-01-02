import NextAuth from 'next-auth'
import authConfig from '@/auth.config'
import { PrismaAdapter } from '@auth/prisma-adapter'
import { db } from './lib/db'
import { getUserById } from './data/user'

import type { UserRole } from '@prisma/client'

export const {
	handlers: { GET, POST },
	auth,
	signIn,
	signOut,
} = NextAuth({
	adapter: PrismaAdapter(db),
	session: { strategy: 'jwt' },
	callbacks: {
		session: async ({ token, session }) => {
			if (token.sub && session.user) {
				session.user.id = token.sub
				session.user.role = token.role as UserRole
			}
			return session
		},
		jwt: async ({ token, user }) => {
			if (!token.sub) return token
			const existingUser = await getUserById(token.sub)
			token.role = existingUser?.role
			return token
		},
	},
	...authConfig,
})
