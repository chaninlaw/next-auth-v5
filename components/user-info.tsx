import { Session } from 'next-auth/types'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

interface UserInfoProps {
	user?: Session['user']
	label: string
}

export function UserInfo(props: UserInfoProps) {
	return (
		<Card className='w-[600px] shadow-md'>
			<CardHeader>
				<p className='text-2xl font-semibold text-center'>{props.label}</p>
			</CardHeader>
			<CardContent className='space-y-4'>
				<div className='flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm'>
					<p className='text-sm font-medium'>ID</p>
					<p className='truncate text-xs max-w-[180px] font-mono p-1 bg-slate-100 rounded-md'>
						{props.user?.id}
					</p>
				</div>

				<div className='flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm'>
					<p className='text-sm font-medium'>Name</p>
					<p className='truncate text-xs max-w-[180px] font-mono p-1 bg-slate-100 rounded-md'>
						{props.user?.name}
					</p>
				</div>

				<div className='flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm'>
					<p className='text-sm font-medium'>Email</p>
					<p className='truncate text-xs max-w-[180px] font-mono p-1 bg-slate-100 rounded-md'>
						{props.user?.email}
					</p>
				</div>

				<div className='flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm'>
					<p className='text-sm font-medium'>Role</p>
					<p className='truncate text-xs max-w-[180px] font-mono p-1 bg-slate-100 rounded-md'>
						{props.user?.role}
					</p>
				</div>

				<div className='flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm'>
					<p className='text-sm font-medium'>Two Factor Authentication</p>
					<div className='truncate text-xs max-w-[180px] font-mono p-1 bg-slate-100 rounded-md'>
						<Badge
							variant={
								props.user?.isTwoFactorEnabled ? 'success' : 'destructive'
							}
						>
							{props.user?.isTwoFactorEnabled ? 'ON' : 'OFF'}
						</Badge>
					</div>
				</div>
			</CardContent>
		</Card>
	)
}
