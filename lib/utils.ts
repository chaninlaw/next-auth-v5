import { type ClassValue, clsx } from 'clsx'
import { Poppins } from 'next/font/google'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs))
}

export const popins = Poppins({
	subsets: ['latin'],
	weight: ['600'],
})
