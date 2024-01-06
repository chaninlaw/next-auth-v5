'use server'

import { z } from 'zod'
import { RegisterSchema } from './validations'
import { db } from '@/lib/db'
import bcrypt from 'bcryptjs'
import { getUserByEmail } from '@/data/user'
import { generateVerificationToken } from '@/lib/token'
import { sendVerificationEmail } from '@/lib/mail'

export const register = async (values: z.infer<typeof RegisterSchema>) => {
	const validationsFields = RegisterSchema.safeParse(values)

	if (!validationsFields.success) {
		return {
			error: 'Invalid fields.',
		}
	}

	const { email, name, password } = validationsFields.data

	const existingUser = await getUserByEmail(email)

	if (existingUser) return { error: 'Email already exist.' }

	const hashedPassword = await bcrypt.hash(password, 10)

	try {
		await db.user.create({
			data: {
				name,
				email,
				password: hashedPassword,
			},
		})
	} catch (error) {
		console.error('register.error', error)
		return {
			error: 'Something went wrong.',
		}
	}

	// TODO: Send verification token email
	const verificationToken = await generateVerificationToken(email)
	await sendVerificationEmail(verificationToken.email, verificationToken.token)

	return {
		success: 'Confirmation email sent.',
	}
}
