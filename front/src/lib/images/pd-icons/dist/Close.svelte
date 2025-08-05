<script lang="ts">
	import { getContext } from 'svelte';
	import { twMerge } from 'tailwind-merge';
	import type { OutlineBaseProps, OutlineProps } from './types';

	const ctx: OutlineBaseProps = getContext('iconCtx') ?? {};
	const sizes = {
		xs: 'w-2 h-2',
		sm: 'w-3 h-3',
		md: 'w-4 h-4',
		lg: 'w-6 h-6',
		xl: 'w-8 h-8'
	};

	let {
		size = ctx.size || 'md',
		color = ctx.color || 'currentColor',
		strokeWidth = ctx.strokeWidth || '1',
		class: className,
		ariaLabel = 'Close icon',
		...restProps
	}: OutlineProps = $props();
</script>

<svg
	xmlns="http://www.w3.org/2000/svg"
	viewBox="0 0 12 12"
	fill="none"
	{color}
	{...restProps}
	class={twMerge(sizes[size], className)}
	aria-label={ariaLabel}
    stroke-width={strokeWidth}
>
    <path d="M10.192 0.343994L5.94897 4.58599L1.70697 0.343994L0.292969 1.75799L4.53497 5.99999L0.292969 10.242L1.70697 11.656L5.94897 7.41399L10.192 11.656L11.606 10.242L7.36397 5.99999L11.606 1.75799L10.192 0.343994Z" fill="currentColor" />
</svg>