import NextAuth from 'next-auth'
import authConfig from '@/auth.config'
import { PrismaAdapter } from '@auth/prisma-adapter'
import { db } from './lib/db'
import { getUserById } from './data/user'

import type { UserRole } from '@prisma/client'
import { getTwoFactorConfirmationByUserId } from './data/two-factor-confirmation'
import { getAccountByUserId } from './data/account'

export const {
	handlers: { GET, POST },
	auth,
	signIn,
	signOut,
	update,
} = NextAuth({
	adapter: PrismaAdapter(db),
	session: { strategy: 'jwt' },
	pages: {
		signIn: '/auth/login',
		error: '/auth/error',
	},
	callbacks: {
		session: async ({ token, session }) => {
			if (token.sub && session.user) {
				session.user.id = token.sub
			}

			if (token.role && session.user) {
				session.user.role = token.role as UserRole
			}

			if (token.isTwoFactorEnabled && session.user) {
				session.user.isTwoFactorEnabled = token.isTwoFactorEnabled as boolean
			}

			if (session.user) {
				session.user.name = token.name
				session.user.email = token.email
				session.user.isOAuth = token.isOAuth as boolean
			}

			return session
		},
		jwt: async ({ token }) => {
			if (!token.sub) return token
			const existingUser = await getUserById(token.sub)

			if (!existingUser) return token

			const existingAccount = await getAccountByUserId(token.sub)

			token.name = existingUser.name
			token.email = existingUser.email
			token.role = existingUser.role
			token.isTwoFactorEnabled = existingUser.isTwoFactorEnabled
			token.isOAuth = !!existingAccount

			return token
		},
		signIn: async ({ user, account }) => {
			// Allow OAuth withour email verification
			if (account?.provider !== 'credentials') return true

			const existingUser = await getUserById(user.id)
			if (!existingUser?.emailVerified) return false

			// 2FA check
			if (existingUser.isTwoFactorEnabled) {
				const twoFactorConfirmation = await getTwoFactorConfirmationByUserId(
					existingUser.id
				)

				if (!twoFactorConfirmation) return false

				// Delete two factor confirmation for next sign-in
				await db.twoFactorConfirmation.delete({
					where: { id: twoFactorConfirmation.id },
				})
			}

			return true
		},
	},
	events: {
		linkAccount: async ({ user }) => {
			await db.user.update({
				where: { id: user.id },
				data: { emailVerified: new Date() },
			})
		},
	},
	...authConfig,
})
