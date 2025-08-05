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
		ariaLabel = 'Barcode icon',
		...restProps
	}: OutlineProps = $props();
</script>

<svg
	xmlns="http://www.w3.org/2000/svg"
	viewBox="0 0 10 10"
	fill="none"
	{color}
	{...restProps}
	class={twMerge(sizes[size], className)}
	aria-label={ariaLabel}
>
    <path fill-rule="evenodd" clip-rule="evenodd" d="M2.28415 0.343368C4.07446 0.143275 5.92524 0.143275 7.71555 0.343368C8.71463 0.455031 9.52066 1.24219 9.63797 2.24522C9.85204 4.0755 9.85204 5.9245 9.63797 7.75478C9.52066 8.75781 8.71464 9.54497 7.71555 9.65663C5.92524 9.85672 4.07446 9.85672 2.28415 9.65663C1.28506 9.54497 0.479037 8.75781 0.361723 7.75478C0.147655 5.92449 0.147655 4.0755 0.361723 2.24522C0.479037 1.24219 1.28506 0.455031 2.28415 0.343368ZM2.9405 2.94064C3.11135 2.76978 3.38836 2.76978 3.55922 2.94064L4.99986 4.38128L6.4405 2.94064C6.61136 2.76979 6.88837 2.76979 7.05922 2.94064C7.23008 3.1115 7.23008 3.38851 7.05922 3.55936L5.61858 5L7.05922 6.44064C7.23007 6.61149 7.23007 6.8885 7.05922 7.05935C6.88836 7.23021 6.61135 7.23021 6.4405 7.05935L4.99986 5.61872L3.55922 7.05936C3.38837 7.23021 3.11136 7.23021 2.9405 7.05936C2.76965 6.8885 2.76965 6.6115 2.9405 6.44064L4.38114 5L2.9405 3.55935C2.76964 3.3885 2.76964 3.11149 2.9405 2.94064Z" fill="currentColor" />
</svg>