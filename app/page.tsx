import { Poppins } from 'next/font/google'
import { Button } from '@/components/ui/button'
import { cn, popins } from '@/lib/utils'
import { LoginButton } from '@/components/auth/login-button'

export default function Home() {
	return (
		<main className='flex min-h-screen flex-col items-center justify-center bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-sky-400 to-blue-800'>
			<div className='space-y-6 text-center'>
				<h1
					className={cn(
						'text-6xl font-semibold text-white drop-shadow-md',
						popins.className
					)}
				>
					🔐 Auth
				</h1>
				<p className='text-white text-lg'>A simple authentication service</p>
				<div className=''>
					<LoginButton mode='modal'>
						<Button variant='secondary' size='lg'>
							Sign in
						</Button>
					</LoginButton>
				</div>
			</div>
		</main>
	)
}
