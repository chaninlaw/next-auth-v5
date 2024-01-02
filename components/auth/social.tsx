'use client'
import { FcGoogle } from 'react-icons/fc'
import { FaGithub } from 'react-icons/fa'
import { Button } from '../ui/button'

export function Social() {
	const googleLogin = () => {}

	const githubLogin = () => {}

	return (
		<div className='flex items-center w-full gap-x-2'>
			<Button
				size='lg'
				className='w-full'
				variant='outline'
				onClick={googleLogin}
			>
				<FcGoogle />
			</Button>

			<Button
				size='lg'
				className='w-full'
				variant='outline'
				onClick={githubLogin}
			>
				<FaGithub />
			</Button>
		</div>
	)
}
