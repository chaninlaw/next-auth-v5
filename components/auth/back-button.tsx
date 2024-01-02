'use client'

import Link from 'next/link'
import { Button } from '../ui/button'

interface BackButton {
	href: string
	label: string
}

export function BackButton(props: BackButton) {
	return (
		<Button variant='link' className='font-normal w-full' size='sm' asChild>
			<Link href={props.href}>{props.label}</Link>
		</Button>
	)
}
