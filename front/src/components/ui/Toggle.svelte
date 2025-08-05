<script lang="ts">
    import {type Snippet} from 'svelte';
    import {twMerge} from 'tailwind-merge';

    let {children, checked = $bindable(), onclick = defaultOnClickFn, name, class: toggleClass}: {
        children?: Snippet,
        checked: boolean,
        oninput?: () => any,
        onclick?: (e: Event) => Promise<boolean>,
        name?: string,
        class?: string
    } = $props();

    let isLoading: boolean = $state(false);

    async function defaultOnClickFn(e: Event): Promise<boolean> {
        return !checked;
    }

    function onclickHandler(e: Event) {
        isLoading = true;
        setTimeout(() => {
            onclick(e).then((result) => {
                checked = result;
                isLoading = false;
            }).catch(() => isLoading = false);
        }, 300);
    }
</script>

<div role="button" tabindex="0" onkeyup={() => {}} onkeydown={() => {}}
        class={twMerge("group/toggle toggle relative inline-flex flex-wrap items-center cursor-pointer max-w-max transition-all [.loading]:cursor-auto [.loading]:opacity-80 [.loading]:pointer-events-none", toggleClass)}
        class:loading={isLoading}
        onclick={(e) => onclickHandler(e) }>
    <input type="checkbox" bind:checked={checked} value={Number(checked)} name={name} class="sr-only peer">
    <div class="relative min-w-8 w-8 min-h-5 max-h-5 h-full bg-gray-200 rounded-full peer transition-colors
                peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white peer-checked:after:start-[-2px] peer-checked:hover:bg-[var(--clr-2)]
                after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-[16px] after:w-[16px] after:transition-all
                hover:bg-gray-300
                dark:border-gray-600 peer-checked:bg-blue-600 dark:peer-checked:bg-blue-600"></div>

    {#if children}
        <span class="ms-2 text-[13px] leading-0 s:text-[14px] sm:text-[15px] dark:text-[white]">{@render children()}</span>
    {/if}
</div>