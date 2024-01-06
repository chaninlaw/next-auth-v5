'use client'

import { useForm } from 'react-hook-form'
import { CardWrapper } from './card-wrapper'
import { zodResolver } from '@hookform/resolvers/zod'
import { ResetSchema } from '@/actions/validations'
import { z } from 'zod'
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import FormError from '@/components/form-error'
import FormSuccess from '@/components/form-success'
import { resetPassword } from '@/actions/reset-password'
import { useState, useTransition } from 'react'

export function ResetPasswordForm() {
	const [isPending, startTransition] = useTransition()
	const [error, setError] = useState<string>()
	const [success, setSuccess] = useState<string>()

	const form = useForm<z.infer<typeof ResetSchema>>({
		resolver: zodResolver(ResetSchema),
		defaultValues: {
			email: '',
		},
	})

	const onSubmit = (values: z.infer<typeof ResetSchema>) => {
		setError(undefined)
		setSuccess(undefined)

		startTransition(() => {
			resetPassword(values).then((res) => {
				setError(res.error)
				setSuccess(res.success)
			})
		})
	}

	return (
		<CardWrapper
			headerLabel='Forgot your password'
			backButtonLabel='Back to login'
			backButtonHref='/auth/login'
			showSocial
		>
			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
					<div className='space-y-4'>
						<FormField
							control={form.control}
							name='email'
							render={({ field }) => (
								<FormItem>
									<FormLabel>Email</FormLabel>
									<FormControl>
										<Input
											{...field}
											disabled={isPending}
											placeholder='john.doe@example.com'
											type='email'
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
						Send reset email
					</Button>
				</form>
			</Form>
		</CardWrapper>
	)
}
