'use server'

import { z } from 'zod'
import { update } from '@/auth'
import { SettingSchema } from './validations'
import { currentUser } from '@/lib/auth'
import { getUserByEmail, getUserById } from '@/data/user'
import { db } from '@/lib/db'
import { generateVerificationToken } from '@/lib/token'
import { sendVerificationEmail } from '@/lib/mail'
import bcrypt from 'bcryptjs'

export const setting = async (values: z.infer<typeof SettingSchema>) => {
	const user = await currentUser()
	if (!user) {
		return {
			error: 'Unauthorized',
		}
	}

	const dbUser = await getUserById(user.id)

	if (!dbUser) {
		return {
			error: 'Unauthorized',
		}
	}

	if (user.isOAuth) {
		values.email = undefined
		values.password = undefined
		values.newPassword = undefined
		values.isTwoFactorEnabled = undefined
	}

	if (values.email && values.email !== user.email) {
		const existingUser = await getUserByEmail(values.email)

		if (existingUser && existingUser.id !== user.id) {
			return { error: 'Email already in user.' }
		}

		const verificationToken = await generateVerificationToken(values.email)
		await sendVerificationEmail(
			verificationToken.email,
			verificationToken.token
		)

		return { success: 'Verification email sent.' }
	}

	if (values.password && values.newPassword && dbUser.password) {
		const isPasswordMatch = await bcrypt.compare(
			values.password,
			dbUser.password
		)

		if (!isPasswordMatch) {
			return { error: 'Incorrect password' }
		}
		const hashedPassword = await bcrypt.hash(values.newPassword, 10)
		values.password = hashedPassword
		values.newPassword = undefined
	}

	const updatedUser = await db.user.update({
		where: { id: dbUser.id },
		data: { ...values },
	})

	update({
		user: {
			name: updatedUser.name,
			email: updatedUser.email,
			isTwoFactorEnabled: updatedUser.isTwoFactorEnabled,
			role: updatedUser.role,
		},
	})

	return {
		success: 'Setting updated.',
	}
}
