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
		ariaLabel = 'ChevronRight icon',
		...restProps
	}: OutlineProps = $props();
</script>

<svg
	xmlns="http://www.w3.org/2000/svg"
	viewBox="0 0 4 6"
	fill="none"
	{color}
	{...restProps}
	class={twMerge(sizes[size], className)}
	aria-label={ariaLabel}
>
	<path
		fill-rule="evenodd"
		clip-rule="evenodd"
		d="M0.815641 0.357328C0.986495 0.186473 1.2635 0.186473 1.43436 0.357328L3.76769 2.69066C3.93855 2.86152 3.93855 3.13853 3.76769 3.30938L1.43436 5.64271C1.2635 5.81357 0.986495 5.81357 0.815641 5.64271C0.644786 5.47186 0.644786 5.19485 0.815641 5.02399L2.83961 3.00002L0.815641 0.976046C0.644786 0.805192 0.644786 0.528182 0.815641 0.357328Z"
		fill="currentColor"
	/>
</svg>
