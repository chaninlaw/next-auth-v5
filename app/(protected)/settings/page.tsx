'use client'

import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { setting } from '@/actions/setting'
import { useSession } from 'next-auth/react'
import { useState, useTransition } from 'react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select'
import { SettingSchema } from '@/actions/validations'
import { zodResolver } from '@hookform/resolvers/zod'
import { useCurrentUser } from '@/hooks/use-current-user'
import FormSuccess from '@/components/form-success'
import FormError from '@/components/form-error'
import { UserRole } from '@prisma/client'

export default function SettingPage() {
	const user = useCurrentUser()
	const { update } = useSession()
	const [isPending, startTransition] = useTransition()
	const [success, setSuccess] = useState<string>()
	const [error, setError] = useState<string>()
	const form = useForm<z.infer<typeof SettingSchema>>({
		resolver: zodResolver(SettingSchema),
		defaultValues: {
			name: user?.name ?? undefined,
			email: user?.email ?? undefined,
			isTwoFactorEnabled: user?.isTwoFactorEnabled ?? undefined,
			role: user?.role ?? undefined,
			password: undefined,
			newPassword: undefined,
		},
	})

	const onSubmit = (values: z.infer<typeof SettingSchema>) => {
		setSuccess(undefined)
		setError(undefined)
		startTransition(() => {
			setting(values)
				.then((res) => {
					if (res?.error) {
						setError(res.error)
					} else {
						// update()
						setSuccess(res.success)
					}
				})
				.catch(() => setError('Something went wrong!'))
		})
	}
	return (
		<Card className='w-[600px]'>
			<CardHeader>
				<p className='text-2xl font-semibold text-center'>🕹️ Settings</p>
			</CardHeader>
			<CardContent>
				<Form {...form}>
					<form className='space-y-6' onSubmit={form.handleSubmit(onSubmit)}>
						<div className='space-y-4'>
							<FormField
								control={form.control}
								name='name'
								render={({ field }) => (
									<FormItem>
										<FormLabel>Name</FormLabel>
										<FormControl>
											<Input
												{...field}
												placeholder='John Doe'
												disabled={isPending}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							{user?.isOAuth === false && (
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
														placeholder='john.doe@email.com'
														type='email'
														autoComplete='current-user'
														disabled={isPending}
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
														placeholder='******'
														type='password'
														autoComplete='password'
														disabled={isPending}
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
									<FormField
										control={form.control}
										name='newPassword'
										render={({ field }) => (
											<FormItem>
												<FormLabel>New Password</FormLabel>
												<FormControl>
													<Input
														{...field}
														placeholder='******'
														type='password'
														autoComplete='password'
														disabled={isPending}
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
								</>
							)}
							<FormField
								control={form.control}
								name='role'
								render={({ field }) => (
									<FormItem>
										<FormLabel>Role</FormLabel>

										<Select
											disabled={isPending}
											onValueChange={field.onChange}
											defaultValue={field.value}
										>
											<FormControl>
												<SelectTrigger>
													<SelectValue placeholder='Select a role' />
												</SelectTrigger>
											</FormControl>
											<FormMessage />
											<SelectContent>
												<SelectItem value={UserRole.ADMIN}>Admin</SelectItem>
												<SelectItem value={UserRole.USER}>User</SelectItem>
											</SelectContent>
										</Select>
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name='isTwoFactorEnabled'
								render={({ field }) => (
									<FormItem className='flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm'>
										<div className='space-y-0.5'>
											<FormLabel>Two Factor Authentication</FormLabel>
											<FormDescription>
												Enable two factor authentication for your account
											</FormDescription>
											<FormMessage />
										</div>
										<FormControl>
											<Switch
												disabled={isPending}
												checked={field.value}
												onCheckedChange={field.onChange}
											/>
										</FormControl>
									</FormItem>
								)}
							/>
							<FormSuccess message={success} />
							<FormError message={error} />
							<Button type='submit'>Save</Button>
						</div>
					</form>
				</Form>
			</CardContent>
		</Card>
	)
}
