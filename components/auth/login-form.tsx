'use client'

import { useForm } from 'react-hook-form'
import { CardWrapper } from './card-wrapper'
import { zodResolver } from '@hookform/resolvers/zod'
import { LoginSchema } from '@/actions/validations'
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
import { login } from '@/actions/login'
import { useState, useTransition } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'

export function LoginForm() {
	const searchParams = useSearchParams()
	const callbackUrl = searchParams.get('callbackUrl')
	const urlError =
		searchParams.get('error') === 'OAuthAccountNotLinked'
			? 'Email already in use with different provider!'
			: ''

	const [isPending, startTransition] = useTransition()
	const [error, setError] = useState<string>()
	const [success, setSuccess] = useState<string>()
	const [showTwoFactor, setShowTwoFactor] = useState(false)

	const form = useForm<z.infer<typeof LoginSchema>>({
		resolver: zodResolver(LoginSchema),
		defaultValues: {
			email: '',
			password: '',
			code: '',
		},
	})

	const onSubmit = (values: z.infer<typeof LoginSchema>) => {
		setError(undefined)
		setSuccess(undefined)

		startTransition(() => {
			login(values, callbackUrl)
				.then((res) => {
					if (res?.error) {
						form.reset()
						setError(res.error)
					}

					if (res?.success) {
						form.reset()
						setSuccess(res.success)
					}

					if (res?.twoFactor) {
						setShowTwoFactor(true)
					}
				})
				.catch((error) => {
					console.log('error', error)
					setError('Something went wrong.')
				})
		})
	}

	return (
		<CardWrapper
			headerLabel='Welcome back'
			backButtonLabel="Don't have an account"
			backButtonHref='/auth/register'
			showSocial
		>
			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
					<div className='space-y-4'>
						{showTwoFactor && (
							<FormField
								control={form.control}
								name='code'
								render={({ field }) => (
									<FormItem>
										<FormLabel>Two Factor Code</FormLabel>
										<FormControl>
											<Input
												{...field}
												disabled={isPending}
												placeholder='123456'
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						)}
						{!showTwoFactor && (
							<>
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
													autoComplete='username'
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
								<FormField
									control={form.control}
									name='password'
									render={({ field }) => (
										<FormItem>
											<FormLabel>Password</FormLabel>
											<FormControl>
												<Input
													{...field}
													disabled={isPending}
													placeholder='******'
													type='password'
													autoComplete='current-password'
												/>
											</FormControl>
											<Button
												size='sm'
												variant='link'
												asChild
												className='px-0 font-normal ml-auto'
											>
												<Link href='/auth/reset-password'>
													Forgot password?
												</Link>
											</Button>
											<FormMessage />
										</FormItem>
									)}
								/>
							</>
						)}
					</div>
					<FormError message={error || urlError} />
					<FormSuccess message={success} />
					<Button type='submit' className='w-full' disabled={isPending}>
						{showTwoFactor ? 'Confirm' : 'Login'}
					</Button>
				</form>
			</Form>
		</CardWrapper>
	)
}
