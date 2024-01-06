import type { DefaultSession, User } from 'next-auth/types'
import { UserRole } from '@prisma/client'

declare module 'next-auth' {
	interface Session {
		user: {
			role: UserRole
			isTwoFactorEnabled: boolean | null
			isOAuth: boolean | null
		} & DefaultSession['user']
	}

	interface User {
		emailVerified: Date | null
	}
}
