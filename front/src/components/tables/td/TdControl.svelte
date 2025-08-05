<script lang="ts">
    import { type Snippet } from 'svelte';
    import { twMerge } from "tailwind-merge";

    let { children, class: classes }: { children?: Snippet, class?: string, onclick?: (e: Event) => any } = $props();
</script>

<td class="group/td h-[inherit] text-right">
    <div class={twMerge(`ml-auto max-w-min flex items-center justify-end`, classes)} onclick={(e) => { e.stopPropagation() }}>
        {@render children?.()}
    </div>
</td>