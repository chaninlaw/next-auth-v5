'use client'

import { logout } from '@/actions/logout'

export function LogoutButton({ children }: React.PropsWithChildren) {
	const onClick = () => {
		logout()
	}
	return (
		<span onClick={onClick} className='cursor-pointer'>
			{children}
		</span>
	)
}
