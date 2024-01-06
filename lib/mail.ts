import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)
const domain = process.env.NEXT_PUBLIC_APP_URL

export const sendVerificationEmail = async (email: string, token: string) => {
	const confirmLink = `${domain}/auth/new-verification?token=${token}`

	const htmlTemplate = `<div>
                          <h1>
                            Verification Confirmation Link
                          </h1>
                          <p>
                            Click here: 
                            <a href="${confirmLink}">Link</a>
                          </p>
                        </div>`

	await resend.emails.send({
		from: 'onboarding@resend.dev',
		to: email,
		subject: 'Confirm your email',
		html: htmlTemplate,
	})
}

export const sendPasswordResetEmail = async (email: string, token: string) => {
	const confirmLink = `${domain}/auth/new-password?token=${token}`

	const htmlTemplate = `<div>
                          <h1>
                            Reset Password Link
                          </h1>
                          <p>
                            Click here: 
                            <a href="${confirmLink}">Link</a>
                          </p>
                        </div>`

	await resend.emails.send({
		from: 'onboarding@resend.dev',
		to: email,
		subject: 'Reset your password',
		html: htmlTemplate,
	})
}

export const sendTwoFactorTokenEmail = async (email: string, token: string) => {
	await resend.emails.send({
		from: 'onboarding@resend.dev',
		to: email,
		subject: '2FA Code',
		html: `<p>Your 2FA code: ${token}</p>`,
	})
}
