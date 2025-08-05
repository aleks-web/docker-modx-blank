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
        viewBox="0 0 24 24"
        fill="none"
        {color}
        {...restProps}
        class={twMerge(sizes[size], className)}
        aria-label={ariaLabel}
>
    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width={strokeWidth} d="M7.757 12h8.486M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"/>
</svg>
