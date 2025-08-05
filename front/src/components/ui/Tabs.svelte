<script lang="ts">
    import type { Snippet } from "svelte";
    import { setContext } from "svelte";
    import { writable } from "svelte/store";
    import { twMerge } from "tailwind-merge";

    let { children, class: wrapClass, btnsClass, contentClass }: { children: Snippet, class?: string, btnsClass?: string, contentClass?: string } = $props();

    const panelId = `tab-panel-${Math.random().toString(36).substring(2)}`;
    function init(node: HTMLElement) {
        const destroy = ctx.selected.subscribe((x: HTMLElement) => {
            if (x) {
                node.replaceChildren(x);
                x.classList.remove('hidden');
            };
        });
        return { destroy };
    }

    const ctx = {
        selected: writable<HTMLElement>(),
        panelId
    };

    setContext("ctx", ctx);
</script>

<div class={twMerge("flex flex-col gap-2", wrapClass)}>
    <div role="tablist" class={twMerge("flex gap-x-3 gap-y-2 flex-row flex-wrap", btnsClass)} data-panel={panelId}>
        {@render children()}
    </div>

    <div id={panelId} role="tabpanel" aria-labelledby={panelId} class={twMerge("p-2 bg-white rounded-xl sm:p-3 xl:px-4 2xl:px-6 2xl:py-4", contentClass)} use:init></div>
</div>