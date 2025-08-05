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
		ariaLabel = 'FixDeedle icon',
		...restProps
	}: OutlineProps = $props();
</script>

<svg
	xmlns="http://www.w3.org/2000/svg"
	viewBox="0 0 20 20"
	fill="none"
	{color}
	{...restProps}
	class={twMerge(sizes[size], className)}
	aria-label={ariaLabel}
    stroke-width={strokeWidth}
>
    <path d="M7 20L8 18V15H13C13.2652 15 13.5196 14.8946 13.7071 14.7071C13.8946 14.5196 14 14.2652 14 14V12.414C14 11.888 13.786 11.372 13.414 11L12 9.586V6C12.2652 6 12.5196 5.89464 12.7071 5.70711C12.8946 5.51957 13 5.26522 13 5V2C13 0.897 12.103 0 11 0H3C1.897 0 1 0.897 1 2V5C1 5.26522 1.10536 5.51957 1.29289 5.70711C1.48043 5.89464 1.73478 6 2 6V9.586L0.586 11C0.211827 11.3756 0.00120523 11.8838 0 12.414V14C0 14.2652 0.105357 14.5196 0.292893 14.7071C0.48043 14.8946 0.734784 15 1 15H6V18L7 20ZM3 2H11V4H3V2ZM2 12.414L3.707 10.707C3.80004 10.6143 3.87383 10.5041 3.92412 10.3828C3.9744 10.2614 4.00019 10.1313 4 10V6H10V10C10 10.266 10.105 10.52 10.293 10.707L12 12.414V13H2V12.414Z" fill="currentColor" />
</svg>