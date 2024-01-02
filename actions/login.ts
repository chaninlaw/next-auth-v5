'use server'

import { z } from 'zod'
import { LoginSchema } from './validations'
import { signIn } from '@/auth'
import { DEFAULT_LOGIN_REDIRECT } from '@/routes'
import { AuthError } from 'next-auth'

export const login = async (values: z.infer<typeof LoginSchema>) => {
	const validationsFields = LoginSchema.safeParse(values)

	if (!validationsFields.success) {
		return {
			error: 'Invalid fields.',
		}
	}

	const { email, password } = validationsFields.data

	try {
		await signIn('credentials', {
			email,
			password,
			redirectTo: DEFAULT_LOGIN_REDIRECT,
		})
	} catch (error) {
		if (error instanceof AuthError) {
			switch (error.type) {
				case 'CredentialsSignin':
					return {
						error: 'Invalid Credentials.',
					}
				default:
					return {
						error: 'Something went wrong.',
					}
			}
		}

		throw error
	}
}
