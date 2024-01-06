'use server'

import { z } from 'zod'
import { ResetSchema } from './validations'
import { getUserByEmail } from '@/data/user'
import { generateResetPasswordToken } from '@/lib/token'
import { sendPasswordResetEmail } from '@/lib/mail'

export const resetPassword = async (values: z.infer<typeof ResetSchema>) => {
	const validationsFields = ResetSchema.safeParse(values)

	if (!validationsFields.success) {
		return {
			error: 'Invalid email.',
		}
	}

	const { email } = validationsFields.data

	const existingUser = await getUserByEmail(email)

	if (!existingUser) {
		return {
			error: 'Email not found.',
		}
	}

	const passwordResetToken = await generateResetPasswordToken(email)
	await sendPasswordResetEmail(
		passwordResetToken.email,
		passwordResetToken.token
	)

	return {
		success: 'Reset password link sent.',
	}
}
