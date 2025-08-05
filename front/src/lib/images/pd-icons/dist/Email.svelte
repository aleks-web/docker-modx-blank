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
		ariaLabel = 'Email icon',
		...restProps
	}: OutlineProps = $props();
</script>

<svg
	xmlns="http://www.w3.org/2000/svg"
	viewBox="0 0 20 16"
	fill="none"
	{color}
	{...restProps}
	class={twMerge(sizes[size], className)}
	aria-label={ariaLabel}
    stroke-width={strokeWidth}
>
    <path d="M5.28949 0.907613C8.42413 0.635125 11.5765 0.635125 14.7111 0.907613L16.2214 1.03889C17.2267 1.12629 18.0878 1.72596 18.534 2.58374C18.591 2.69347 18.5483 2.82633 18.4431 2.89144L12.1771 6.77037C10.8333 7.60229 9.13874 7.61974 7.77802 6.81568L1.4702 3.08833C1.36829 3.02811 1.32151 2.90415 1.36744 2.79505C1.77559 1.82548 2.69322 1.1333 3.77925 1.0389L5.28949 0.907613Z" fill="currentColor" />
    <path d="M1.3623 4.76688C1.20634 4.67472 1.00734 4.7739 0.989156 4.95414C0.735421 7.46977 0.796831 10.0092 1.17339 12.5133C1.3719 13.8334 2.44931 14.8455 3.77926 14.9611L5.28949 15.0924C8.42413 15.3649 11.5765 15.3649 14.7111 15.0924L16.2214 14.9611C17.5513 14.8455 18.6287 13.8334 18.8272 12.5133C19.2148 9.93625 19.2685 7.32174 18.9885 4.73428C18.9688 4.55276 18.7665 4.45541 18.6112 4.55151L12.9667 8.04576C11.1485 9.1713 8.8559 9.19492 7.01493 8.10707L1.3623 4.76688Z" fill="currentColor" />
</svg>