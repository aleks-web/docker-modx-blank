<script lang="ts">
    // import {goto} from "$app/navigation";
    import type { Component, Snippet } from "svelte";

    let { children, list, icon: Icon} : { children: Snippet, list: TBreadcrumbLayoutItemsList[], icon?: Component } = $props();

    import { ChevronRight } from '$icons';
	import { goto } from "$src/lib/support/request";

    type TBreadcrumbLayoutItemsList = {
        name: string,
        href?: string,
        icon?: string,
        active?: boolean
    }

    function back() {
        window.history.back();
    }
</script>

<div class="rounded-2xl bg-[var(--clr-el-bg)] p-4 dark:bg-default">
    <div class="flex items-center gap-4">

        <i class="block h-[18px] rotate-180 text-[var(--clr-main)] cursor-pointer box-content py-4 px-4 -mx-4 transition-all hover:text-[var(--clr-2)] dark:text-default" onpointerdown={back}>
            <svg width="100%" height="100%" viewBox="0 0 4 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path fill-rule="evenodd" clip-rule="evenodd" d="M0.815641 0.357328C0.986495 0.186473 1.2635 0.186473 1.43436 0.357328L3.76769 2.69066C3.93855 2.86152 3.93855 3.13853 3.76769 3.30938L1.43436 5.64271C1.2635 5.81357 0.986495 5.81357 0.815641 5.64271C0.644786 5.47186 0.644786 5.19485 0.815641 5.02399L2.83961 3.00002L0.815641 0.976046C0.644786 0.805192 0.644786 0.528182 0.815641 0.357328Z" fill="currentColor" />
            </svg>
        </i>

        <div class="flex flex-col">
            <div class="text-[var(--clr-main)] font-bold flex items-center justify-start gap-1 mb-2">
                {#if Icon}
                    <Icon class="dark:text-default" />
                {/if}
                <div class="leading-[normal] text-[14px] s:text-[16px] sm:text-[18px] dark:text-default">{@render children()}</div>
            </div>

            <div class="flex flex-wrap">
                {#each list as item}
                    <div class="mr-2 flex items-center gap-1 s:gap-2 s:mr-2 sm:mr-3 sm:gap-3">
                        {#if item.href}
                            <span class="cursor-pointer text-[12px] transition-all dark:text-default hover:text-[var(--clr-main)] hover:dark:text-[var(--clr-2)] s:text-[14px] sm:text-[16px]"
                                  onpointerdown={() => { goto(item.href, {invalidateAll: true}) }} data-href={item.href}>
                                { item.name }
                            </span>

                            <ChevronRight size="xs" class="dark:text-default" />
                        {:else}
                            <span class="s:text-[14px] cursor-default text-[12px] dark:text-default sm:text-[16px]">{@render children()}</span>
                        {/if}
                    </div>
                {/each}
            </div>
        </div>

    </div>
</div>