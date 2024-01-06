'use client'

import { useSearchParams } from 'next/navigation'
import { useState, useTransition } from 'react'
import { CardWrapper } from '@/components/auth/card-wrapper'
import FormError from '@/components/form-error'
import FormSuccess from '@/components/form-success'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { NewPasswordSchema } from '@/actions/validations'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import {
	Form,
	FormField,
	FormItem,
	FormLabel,
	FormControl,
	FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { newPassword } from '@/actions/new-password'

export function NewPasswordForm() {
	const [success, setSuccess] = useState<string>()
	const [error, setError] = useState<string>()
	const [isPending, startTransition] = useTransition()

	const searchParams = useSearchParams()
	const token = searchParams.get('token')
	const form = useForm<z.infer<typeof NewPasswordSchema>>({
		resolver: zodResolver(NewPasswordSchema),
		defaultValues: {
			password: '',
		},
	})

	const onSubmit = (values: z.infer<typeof NewPasswordSchema>) => {
		setError('')
		setSuccess('')

		startTransition(() => {
			newPassword(values, token)
				.then((res) => {
					setSuccess(res.success)
					setError(res.error)
				})
				.catch(() => setError('Something went wrong'))
		})
	}

	return (
		<CardWrapper
			headerLabel='Reset password'
			backButtonLabel='Back to login'
			backButtonHref='/auth/login'
		>
			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
					<div className='space-y-4'>
						<FormField
							control={form.control}
							name='password'
							render={({ field }) => (
								<FormItem>
									<FormLabel>New Password</FormLabel>
									<FormControl>
										<Input
											{...field}
											disabled={isPending}
											placeholder='******'
											type='password'
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
					</div>
					<FormError message={error} />
					<FormSuccess message={success} />
					<Button type='submit' className='w-full' disabled={isPending}>
						Reset Password
					</Button>
				</form>
			</Form>
		</CardWrapper>
	)
}
