<script lang="ts">
	import { twMerge } from "tailwind-merge";
    let {class: classNames, children, required=false, ...rest}: {class?: string, required?: boolean, children?: () => any} = $props();
</script>
<div class={twMerge('ui-label', classNames)} {...rest}>
    {@render children?.()}
    {#if required} <i class="text-red-400">*</i> {/if}
</div>