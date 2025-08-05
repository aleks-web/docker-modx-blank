<script lang="ts">
	import { twMerge } from "tailwind-merge";
    let {class: classNames, children, ...rest}: {class?: string, children?: () => any} = $props();
</script>
<div class={twMerge('relative group/select text-[var(--clr-text)] w-fit', classNames)} {...rest}>
    {@render children?.()}
</div>