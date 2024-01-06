'use client'

import { newVerification } from '@/actions/new-verification'
import { CardWrapper } from '@/components/auth/card-wrapper'
import { useSearchParams } from 'next/navigation'
import { useCallback, useEffect, useState } from 'react'
import { BeatLoader } from 'react-spinners'
import FormError from '../form-error'
import FormSuccess from '../form-success'

export function NewVerificationForm() {
	const [error, setError] = useState<string>()
	const [success, setSuccess] = useState<string>()
	const [mount, setMount] = useState(false)

	const searchParams = useSearchParams()
	const token = searchParams.get('token')

	const onSubmit = useCallback(() => {
		if (!token) return setError('Missing token.')
		newVerification(token)
			.then((res) => {
				setSuccess(res.success)
				setError(res.error)
			})
			.catch(() => setError('Something went wrong.'))
	}, [token])

	useEffect(() => {
		setMount(true)
		if (mount) {
			onSubmit()
		}

		return () => setMount(false)
	}, [onSubmit, mount])

	return (
		<CardWrapper
			headerLabel='Cofirming your verification'
			backButtonLabel='Back to login'
			backButtonHref='/auth/login'
		>
			<div className='flex items-center justify-center'>
				{!error && !success && <BeatLoader />}
				<FormError message={error} />
				<FormSuccess message={success} />
			</div>
		</CardWrapper>
	)
}
