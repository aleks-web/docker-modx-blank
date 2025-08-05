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
		ariaLabel = 'Summary icon',
		...restProps
	}: OutlineProps = $props();
</script>

<svg
	xmlns="http://www.w3.org/2000/svg"
	viewBox="0 0 14 14"
	fill="none"
	{color}
	{...restProps}
	class={twMerge(sizes[size], className)}
	aria-label={ariaLabel}
	stroke-width={strokeWidth}
>
	<path d="M7.00016 0.333328C3.32416 0.333328 0.333496 3.32399 0.333496 6.99999C0.333496 10.676 3.32416 13.6667 7.00016 13.6667C10.6762 13.6667 13.6668 10.676 13.6668 6.99999C13.6668 3.32399 10.6762 0.333328 7.00016 0.333328ZM12.2875 6.33333H7.66683V1.71266C8.84005 1.86223 9.93039 2.39715 10.7667 3.23346C11.603 4.06977 12.1379 5.16011 12.2875 6.33333ZM1.66683 6.99999C1.66683 4.28533 3.7075 2.04266 6.3335 1.71266V6.99999C6.33547 7.10171 6.36079 7.20162 6.4075 7.29199C6.4175 7.31199 6.42216 7.33399 6.43483 7.35399L9.23616 11.836C8.536 12.1628 7.77284 12.3325 7.00016 12.3333C4.0595 12.3333 1.66683 9.94066 1.66683 6.99999ZM10.3682 11.1307L8.2035 7.66666H12.2875C12.1165 9.02504 11.4292 10.2655 10.3682 11.1307Z" fill="currentColor" />
</svg>