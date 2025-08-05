<script lang="ts">
	import { twMerge } from 'tailwind-merge';
	let { class: classNames, children, ...attributes}: {class?: string|string[]} & any = $props();
</script>

<td class={twMerge("t-cell", classNames)} {...attributes}>
    {@render children?.()}
</td>