import { cn, popins } from '@/lib/utils'

interface HeaderProps {
	label: string
}

export function Header(props: HeaderProps) {
	return (
		<div className='w-full flex flex-col gap-y-4 items-center justify-center'>
			<h1 className={cn('text-3xl font-semibold', popins.className)}>
				🔐 Auth
			</h1>
			<p className='text-muted-foreground text-sm'>{props.label}</p>
		</div>
	)
}
