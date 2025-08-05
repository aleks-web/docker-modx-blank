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
	<path d="M1.00102 6.91827C2.91742 11.0922 6.32743 14.4107 10.567 16.2097L11.2466 16.5125C12.8014 17.2052 14.6291 16.6789 15.5775 15.2654L16.4655 13.9417C16.7543 13.5113 16.6664 12.9317 16.263 12.6063L13.2512 10.1765C12.8088 9.81958 12.1583 9.9027 11.8199 10.3594L10.8881 11.6166C8.49732 10.4373 6.55626 8.49623 5.37692 6.10542L6.63417 5.1737C7.09083 4.83528 7.17396 4.18476 6.81707 3.74238L4.3872 0.730437C4.06186 0.327156 3.48235 0.239189 3.05199 0.527757L1.71915 1.42145C0.296801 2.37516 -0.22658 4.21801 0.482152 5.77696L1.00024 6.91657L1.00102 6.91827Z" fill="currentColor"/>
</svg>