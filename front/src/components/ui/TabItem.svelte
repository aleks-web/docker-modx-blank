<script lang="ts">
    import type {Snippet} from "svelte";
    import { getContext } from "svelte";
    import { writable } from "svelte/store";
    import { twMerge } from 'tailwind-merge';

    const ctx = getContext("ctx");

    let { title, children, titleSlot, open, class: contentClass, btnClass, disabled }: { title?: string, children: Snippet, titleSlot?: Snippet, open?: boolean, class?: string, btnClass?:string, disabled?: boolean } = $props();

    let selected = ctx.selected ?? writable<HTMLElement>();
    const tabId = `tab-${Math.random().toString(36).substring(2)}`;

    function init(node: HTMLElement) {
        selected.set(node);

        const destroy = selected.subscribe((x) => {
            if (x !== node) {
                open = false;
            }
        });

        return { destroy };
    }
</script>

<button type="button" class={twMerge(`bg-[#ddd] px-3 py-1 rounded-full cursor-pointer transition-all text-[#xxx] text-xs
                                      s:text-sm
                                      sm:text-[16px]
                                      hover:bg-[var(--clr-2)] hover:text-white
                                      [.opened]:bg-[var(--clr-2)] [.opened]:pointer-events-none [.opened]:text-white`, btnClass)}
        class:opened={open}
        class:pointer-events-none={disabled}
        class:opacity-60={disabled}
        onclick={() => { open = !open }}
        role="tab"
        id={tabId}
        data-panel={ctx.panelId}>

    {#if titleSlot}
        {@render titleSlot()}
    {:else}
        {title}
    {/if}
</button>

{#if open}
    <div class={twMerge("hidden rounded-xl", contentClass)} use:init>
        {@render children()}
    </div>
{/if}