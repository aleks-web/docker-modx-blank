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
		ariaLabel = 'ArrowLeft icon',
		...restProps
	}: OutlineProps = $props();
</script>

<svg
	xmlns="http://www.w3.org/2000/svg"
	viewBox="0 0 18 16"
	fill="none"
	{color}
	{...restProps}
	class={twMerge(sizes[size], className, 'rotate-180')}
	aria-label={ariaLabel}
>

	<path d="M11.3351 3.00604L16.3291 8.00006L11.2446 7.98684C13.1011 7.99174 14.0415 5.75395 12.7388 4.43128L11.3351 3.00604Z" fill="currentColor" />
	<path d="M16.3291 8.00006L12.9997 11.3294L11.3351 12.9941L12.7362 11.5827C14.0559 10.2535 13.1177 7.99174 11.2446 7.98684L16.3291 8.00006Z" fill="currentColor" />
	<path d="M1.79492 8.00006L11.2446 7.98684M16.3291 8.00006L12.9997 11.3294L11.3351 12.9941M16.3291 8.00006L11.3351 3.00604M16.3291 8.00006L11.2446 7.98684M9.67039 14.6588L11.3351 12.9941M9.67039 1.34137L11.3351 3.00604M11.3351 12.9941L12.7362 11.5827C14.0559 10.2535 13.1177 7.99174 11.2446 7.98684V7.98684M11.3351 3.00604L12.7388 4.43128C14.0415 5.75395 13.1011 7.99174 11.2446 7.98684V7.98684" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
</svg>