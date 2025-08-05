<script lang="ts">
	import { twMerge } from "tailwind-merge";
    let {class: classNames, text, children, tooltipClass, ...rest}: {class?: string, text: string, tooltipClass?: string|string[], children?: () => any} = $props();
    let isHovered = $state(false);
    let {x,y} = $state({x: 0, y: 0})
    let offset = $state(10);
    function mouseOver(event: MouseEvent) {
		isHovered = true;
		x = event.pageX + offset;
		y = event.pageY + offset;
	}
	function mouseMove(event: MouseEvent) {
		x = event.pageX + offset;
		y = event.pageY + offset;
	}
	function mouseLeave() {
		isHovered = false;
	}
</script>
<div class={twMerge('relative cursor-help', classNames)} {...rest} onmouseover={mouseOver} onmouseleave={mouseLeave} onmousemove={mouseMove}>
    {@render children?.()}
    {#if isHovered}<div class={twMerge('fixed bg-[var(--clr-main)] px-2 py-1 rounded text-white mt-1 text-base z-100', tooltipClass)} style="top: {y}px; left: {x}px;">{text}</div>{/if}
</div>