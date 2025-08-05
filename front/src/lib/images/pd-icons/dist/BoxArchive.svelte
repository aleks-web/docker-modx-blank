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
		ariaLabel = 'BoxArchive icon',
		...restProps
	}: OutlineProps = $props();
</script>

<svg
	xmlns="http://www.w3.org/2000/svg"
	viewBox="0 0 25 24"
	fill="none"
	{color}
	{...restProps}
	class={twMerge(sizes[size], className)}
	aria-label={ariaLabel}
>
    <path d="M22.04 5.292L19.041 2.293C18.9483 2.19996 18.8381 2.12617 18.7168 2.07589C18.5954 2.0256 18.4653 1.99981 18.334 2H6.33399C6.20264 1.99981 6.07256 2.0256 5.95122 2.07589C5.82989 2.12617 5.71969 2.19996 5.62699 2.293L2.62799 5.292C2.53455 5.38468 2.46045 5.49498 2.40999 5.61652C2.35952 5.73805 2.33369 5.8684 2.33399 6V19C2.33399 20.103 3.23099 21 4.33399 21H20.334C21.437 21 22.334 20.103 22.334 19V6C22.3343 5.8684 22.3085 5.73805 22.258 5.61652C22.2075 5.49498 22.1334 5.38468 22.04 5.292ZM6.74799 4H17.92L18.92 5H5.74799L6.74799 4ZM4.33399 19V7H20.334L20.336 19H4.33399Z" fill="currentColor" />
    <path d="M14.334 9H10.334V12H7.33398L12.334 17L17.334 12H14.334V9Z" fill="currentColor"/>
</svg>
