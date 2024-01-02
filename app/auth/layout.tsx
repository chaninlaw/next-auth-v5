export default function AuthLayout({ children }: React.PropsWithChildren) {
	return (
		<div className='h-full flex items-center justify-center bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-sky-400 to-blue-800 text-white'>
			{children}
		</div>
	)
}
