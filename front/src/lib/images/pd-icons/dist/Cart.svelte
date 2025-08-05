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
		ariaLabel = 'Cart icon',
		...restProps
	}: OutlineProps = $props();
</script>

<svg
	xmlns="http://www.w3.org/2000/svg"
	viewBox="0 0 16 16"
	fill="none"
	{color}
	{...restProps}
	class={twMerge(sizes[size], className)}
	aria-label={ariaLabel}
>
    <path d="M14.0007 2.6667H1.33398V4.00004H2.86732L5.05398 10C5.19153 10.3891 5.44603 10.726 5.78261 10.9647C6.11918 11.2035 6.52135 11.3322 6.93398 11.3334H12.6673V10H6.93398C6.79698 9.99998 6.66331 9.95771 6.55118 9.87898C6.43905 9.80025 6.3539 9.68888 6.30732 9.56004L6.00065 8.6667H12.1873C12.4767 8.66629 12.758 8.57175 12.9889 8.39737C13.2198 8.22299 13.3877 7.97823 13.4673 7.70004L14.6673 3.51337C14.6944 3.42583 14.7032 3.33363 14.693 3.24255C14.6829 3.15147 14.6541 3.06346 14.6085 2.984C14.5628 2.90455 14.5012 2.83537 14.4276 2.78077C14.354 2.72618 14.2699 2.68735 14.1807 2.6667C14.121 2.657 14.0603 2.657 14.0007 2.6667ZM12.1673 7.33337H5.50065L4.28732 4.00004H13.114L12.1673 7.33337Z" fill="currentColor" />
    <path d="M7 14C7.55228 14 8 13.5523 8 13C8 12.4477 7.55228 12 7 12C6.44772 12 6 12.4477 6 13C6 13.5523 6.44772 14 7 14Z" fill="currentColor" />
    <path d="M11 14C11.5523 14 12 13.5523 12 13C12 12.4477 11.5523 12 11 12C10.4477 12 10 12.4477 10 13C10 13.5523 10.4477 14 11 14Z" fill="currentColor" />
</svg>