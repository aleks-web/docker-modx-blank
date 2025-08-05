<script lang="ts">
    import type { Snippet, Component } from 'svelte';
    import type { HTMLButtonAttributes } from 'svelte/elements';
    import { twMerge } from 'tailwind-merge';

    type Props = {
        children: Snippet,
        icon?: Component,
        class?: string
    } & HTMLButtonAttributes;

	  let { children, class: className, icon: Icon, ...restProps }: Props = $props();

    let mainClasses = `rounded-full box-border px-4 h-[33px] text-[13px] font-bold flex gap-2 items-center leading-[12px] cursor-pointer transition-all bg-[#E7EAEE] text-[#5D5A62] hover:bg-[var(--clr-2)] hover:text-white
                    dark:bg-[#2b4054] dark:text-default
                    s:text-[14px] s:h-[35px]
                    sm:text-[16px] sm:px-5 sm:h-[40px]
                    lg:text-[18px] lg:px-6 lg:h-[50px]
                    disabled:pointer-events-none`;
</script>

<button class={twMerge(mainClasses, className)} {...restProps}>
    {#if Icon}<Icon />{/if}

    <span>
        {@render children()}
    </span>
</button>