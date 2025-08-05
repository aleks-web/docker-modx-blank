<script lang="ts">
	import { getContext } from 'svelte';
	import { twMerge } from 'tailwind-merge';
	import type { OutlineBaseProps, OutlineProps } from './types';

	const ctx: OutlineBaseProps = getContext('iconCtx') ?? {};
	const sizes = {
		xs: 'w-3 h-3',
		sm: 'w-4 h-4',
		md: 'w-5 h-5',
		lg: 'w-6 h-6',
		xl: 'w-8 h-8'
	};

	let {
		size = ctx.size || 'md',
		color = ctx.color || 'currentColor',
		strokeWidth = ctx.strokeWidth || '1',
		class: className,
		ariaLabel = 'Barcode icon',
		...restProps
	}: OutlineProps = $props();
</script>

<svg
	xmlns="http://www.w3.org/2000/svg"
	viewBox="0 0 16 16"
	fill="none"
	{color}
	{...restProps}
	class={twMerge(sizes[size], className)}
	aria-label={ariaLabel}
>

    <path d="M13.334 2.66675H2.66732C2.3137 2.66675 1.97456 2.80722 1.72451 3.05727C1.47446 3.30732 1.33398 3.64646 1.33398 4.00008V12.0001C1.33398 12.3537 1.47446 12.6928 1.72451 12.9429C1.97456 13.1929 2.3137 13.3334 2.66732 13.3334H13.334C13.6876 13.3334 14.0267 13.1929 14.2768 12.9429C14.5268 12.6928 14.6673 12.3537 14.6673 12.0001V4.00008C14.6673 3.64646 14.5268 3.30732 14.2768 3.05727C14.0267 2.80722 13.6876 2.66675 13.334 2.66675ZM2.66732 12.0001V4.00008H13.334V12.0001H2.66732Z" fill="currentColor" />
    <path d="M4 5.33325H5.33333V10.6666H4V5.33325ZM6 5.33325H6.66667V10.6666H6V5.33325ZM11.3333 5.33325H12V10.6666H11.3333V5.33325ZM8.66667 5.33325H10.6667V10.6666H8.66667V5.33325ZM7.33333 5.33325H8V10.6666H7.33333V5.33325Z" fill="currentColor" />
</svg>