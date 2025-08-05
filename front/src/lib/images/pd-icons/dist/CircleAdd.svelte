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
		ariaLabel = 'CircleAdd icon',
		...restProps
	}: OutlineProps = $props();
</script>

<svg
	xmlns="http://www.w3.org/2000/svg"
	viewBox="0 0 40 40"
	fill="none"
	{color}
	{...restProps}
	class={twMerge(sizes[size], className)}
	aria-label={ariaLabel}
    stroke-width={strokeWidth}
>
    <rect x="1" y="1" width="38" height="38" rx="19" stroke="currentColor" stroke-width={strokeWidth} />
    <path d="M20.75 15C20.75 14.5858 20.4142 14.25 20 14.25C19.5858 14.25 19.25 14.5858 19.25 15V19.25H15C14.5858 19.25 14.25 19.5858 14.25 20C14.25 20.4142 14.5858 20.75 15 20.75H19.25V25C19.25 25.4142 19.5858 25.75 20 25.75C20.4142 25.75 20.75 25.4142 20.75 25V20.75H25C25.4142 20.75 25.75 20.4142 25.75 20C25.75 19.5858 25.4142 19.25 25 19.25H20.75V15Z" fill="currentColor" />
</svg>