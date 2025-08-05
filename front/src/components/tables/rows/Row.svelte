<script lang="ts">
    import { type Snippet } from 'svelte';
    import { twMerge } from "tailwind-merge";

    let { children, class: classes, onclick = () => {} }: { children?: Snippet, class?: string, onclick?: (e: Event) => any } = $props();

    const trClass = twMerge(`group/tr h-[70px] border-b-1 border-b-[#D9D9D9] cursor-pointer
                             dark:border-b-[#4a6176]
                             last:border-b-0`, classes);

    /**
     * Row Handler function
     * @param event
     */
    function rowHandler(event: Event) {
        onclick(event);
    }
</script>

<tr class={trClass} onclick={rowHandler}>
    {@render children?.()}
</tr>