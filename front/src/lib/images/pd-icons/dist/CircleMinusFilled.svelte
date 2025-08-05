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
        fill="currentColor"
        {color}
        {...restProps}
        class={twMerge(sizes[size], className)}
        aria-label={ariaLabel}
>
    <path fill-rule="evenodd" d="M2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10S2 17.523 2 12Zm5.757-1a1 1 0 1 0 0 2h8.486a1 1 0 1 0 0-2H7.757Z" clip-rule="evenodd" stroke-width={strokeWidth} />
</svg>