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
		ariaLabel = 'Move icon',
		...restProps
	}: OutlineProps = $props();
</script>

<svg
	xmlns="http://www.w3.org/2000/svg"
	viewBox="0 0 17 17"
	fill="none"
	{color}
	{...restProps}
	class={twMerge(sizes[size], className)}
	aria-label={ariaLabel}
    stroke-width={strokeWidth}
>
    <path d="M16.0901 6.38303C16.1658 6.20026 16.1856 5.99913 16.147 5.80511C16.1084 5.61108 16.0131 5.43287 15.8731 5.29303L10.8731 0.29303L9.45913 1.70703L12.7521 5.00003H0.166131V7.00003H15.1661C15.3639 7.00008 15.5572 6.94149 15.7217 6.83166C15.8862 6.72184 16.0144 6.56572 16.0901 6.38303ZM0.242132 9.61703C0.166427 9.7998 0.146636 10.0009 0.185263 10.195C0.22389 10.389 0.319199 10.5672 0.459132 10.707L5.45913 15.707L6.87313 14.293L3.58013 11H16.1661V9.00003H1.16613C0.968336 8.99985 0.774938 9.05839 0.610444 9.16823C0.44595 9.27807 0.317765 9.43427 0.242132 9.61703Z" fill="currentColor" />
</svg>