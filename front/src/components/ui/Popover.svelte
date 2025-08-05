<script lang="ts">
	import { Move, Play } from '$icons/dist';
	import { onDestroy, onMount, tick } from 'svelte';
	import { fade } from 'svelte/transition';
	import { twMerge } from 'tailwind-merge';
	import Portal from 'svelte-portal';
	let {
		class: classNames,
		children,
		popoverContent,
		trigger,
		opened,
		vertical,
		horizontal,
		popoverClass,
        showArrow,
		skipPortal,
		...rest
	}: {
		class?: string;
		children?: () => any;
		popoverContent: () => any;
        trigger?: "click"|"mouseenter"|"none",
        opened?: boolean,
        showArrow?: boolean
		vertical?: verticalPositions;
		horizontal?: horizontalPositions;
		popoverClass?: string | string[];
		rest?: any[];
		skipPortal?: undefined|boolean
	} = $props();
	let popoverRoot: undefined | HTMLElement = $state();
	let popover: undefined | HTMLElement = $state();
	let portalNode = $state();

    let defaultTrigger = "click";

	let visible = $state(false);
	let isVisible = $derived.by(()=>{
        return opened??visible;
    });
	type horizontalPositions = 'left' | 'right-border' | 'mid' | 'left-border' | 'right';
	type verticalPositions = 'top' | 'top-border' | 'mid' | 'bottom-border' | 'bottom';

	let rootRect: DOMRect|undefined = $state();
	let popoverRect: DOMRect|undefined = $state();

	const refreshRects = ()=>{
		rootRect = popoverRoot?.getBoundingClientRect();
		popoverRect = popover?.getBoundingClientRect();
	};
	$effect(refreshRects);

	const affex = 10;
	const whitespace = 10;
	let horizontalLeft = $derived.by(
		() => Number(rootRect?.left) - Number(popoverRect?.width) - affex
	);
	let horizontalMid = $derived.by(
		() => Number(rootRect?.left) - (Number(popoverRect?.width) / 2 - Number(rootRect?.width) / 2)
	);
	let horizontalRight = $derived.by(() => Number(rootRect?.right) + affex);

	let verticalTop = $derived.by(() => Number(rootRect?.top) - Number(popoverRect?.height) - affex);
	let verticalMid = $derived.by(
		() => Number(rootRect?.top) - (Number(popoverRect?.height) / 2 - Number(rootRect?.height) / 2)
	);
	let verticalBottom = $derived.by(() => Number(rootRect?.bottom) + affex);

	let viewport = $state({ width: 0, height: 0 });

	let leftPos = $derived.by(() => {
		let pos = 'mid';
		if (horizontal) {
			pos = horizontal;
		}

		let allowedPositions: { [key: string]: boolean } = {
			left: horizontalLeft - whitespace >= 0,
			'right-border': Number(rootRect?.right) - Number(popoverRect?.width) - whitespace >= 0,
			mid:
				horizontalMid + Number(popoverRect?.width) + whitespace <= Number(viewport.width) &&
				horizontalMid - whitespace >= 0,
			'left-border':
				Number(rootRect?.left) + Number(popoverRect?.width) + whitespace <= Number(viewport.width),
			right: horizontalRight + Number(popoverRect?.width) + whitespace <= Number(viewport.width)
		};

		let positionsOrder = ['left', 'right-border', 'mid', 'left-border', 'right'];
		if (Number(popoverRect?.width) < Number(rootRect?.width)) {
			positionsOrder = ['left', 'left-border', 'mid', 'right-border', 'right'];
		}
		if (Number(rootRect?.left) + Number(rootRect?.width) / 2 > Number(viewport.width) / 2) {
			positionsOrder = positionsOrder.reverse();
		}

		if (false == allowedPositions[pos]) {
			for (let k of positionsOrder) {
				if (allowedPositions[k]) {
					pos = k;
					break;
				}
			}
		}
		return pos;
	});
	let left = $derived.by(() => {
		switch (leftPos) {
			case 'left':
				return horizontalLeft;
			case 'left-border':
				return Number(rootRect?.left);
			case 'right':
				return horizontalRight;
			case 'right-border':
				return Number(rootRect?.right) - Number(popoverRect?.width);
			default:
				return horizontalMid;
		}
	});

	let topPos = $derived.by(() => {
		let pos = 'bottom';
		if (vertical) {
			pos = vertical;
		}

		let allowedPositions: { [key: string]: boolean } = {
			top: verticalTop - whitespace >= 0,
			'bottom-border': Number(rootRect?.bottom) - Number(popoverRect?.height) >= 0,
			mid:
				['left', 'right'].includes(leftPos) &&
				verticalMid > 0 &&
				verticalMid + Number(popoverRect?.height) <= Number(viewport.height),
			'top-border': Number(rootRect?.top) - whitespace >= 0,
			bottom: verticalBottom + Number(popoverRect?.height) + whitespace <= Number(viewport.height)
		};

		let positionsOrder = ['top', 'bottom-border', 'mid', 'top-border', 'bottom'];
		if (Number(popoverRect?.height) < Number(rootRect?.height)) {
			positionsOrder = ['top', 'top-border', 'mid', 'bottom-border', 'bottom'];
		}
		if (Number(rootRect?.top) + Number(rootRect?.height) / 2 > Number(viewport.height) / 2) {
			positionsOrder = positionsOrder.reverse();
		}

		if (false == allowedPositions[pos]) {
			for (let k of Object.keys(allowedPositions)) {
				if (allowedPositions[k]) {
					pos = k;
					break;
				}
			}
		}
		return pos;
	});
	let top = $derived.by(() => {
		switch (topPos) {
			case 'top':
				return verticalTop;
			case 'top-border':
				return Number(rootRect?.top);
			case 'mid':
				return verticalMid;
			case 'bottom-border':
				return Number(rootRect?.bottom) - Number(popoverRect?.height);
			default:
				return verticalBottom;
		}
	});

	let arrowClass = $derived.by(() => {
		let lp = '';
		let tp = '';
		let r = '';
		switch (leftPos) {
			case 'left':
				lp = 'left-full -ml-[1px] ';
				break;
			case 'right-border':
				lp = 'right-2';
				break;
			case 'mid':
				lp = 'left-1/2 -translate-x-1/2';
				break;
			case 'left-border':
				lp = 'left-2';
				break;
			case 'right':
				lp = 'right-full -mr-[1px] -rotate-180';
				break;
		}
		switch (topPos) {
			case 'top':
				tp = 'top-full -mt-[1px] rotate-90';
				break;
			case 'top-border':
				tp = 'top-2';
				break;
			case 'mid':
				tp = 'top-1/2 -translate-y-1/2';
				break;
			case 'bottom-border':
				tp = 'bottom-2';
				break;
			case 'bottom':
				tp = 'bottom-full -rotate-90 -mb-[1px]';
				break;
		}
		if (leftPos == 'right' && topPos == 'top') {
			r = 'rotate-125';
		}
		if (leftPos == 'left' && topPos == 'bottom') {
			r = '-rotate-45';
		}
		if (leftPos == 'right' && topPos == 'bottom') {
			r = '-rotate-135';
		}
		return twMerge(lp, tp, r);
		// return " bottom-full left-1/2 -rotate-90 mb-[-1px] -translate-x-1/2"
	});

	let observer: null|MutationObserver = null;
	onMount(() => {
		viewport.width = window.innerWidth;
		viewport.height = window.innerHeight;
		if(popoverRoot && popover) {
			const observerConf = { attributes: true, childList: true, subtree: true };
			observer = new MutationObserver(refreshRects);
			let body = document.querySelector("body");
			if(body) { observer.observe(body, observerConf); }
		}
	});
	onDestroy(()=>{
		observer?.disconnect();
		observer = null;
	})

	let isClickTrigger = $derived.by(()=>(!trigger||trigger==='click'));
	let isMouseTrigger = $derived.by(()=>(trigger==='mouseenter'));
	let hideDelay: undefined|NodeJS.Timeout = $state();
	const show = () => {if(hideDelay) {clearTimeout(hideDelay)}; visible = true};
	const hide = () => {if(hideDelay) {clearTimeout(hideDelay)}; hideDelay = setTimeout(()=>{visible=false}, 200)};
</script>

<svelte:window
	onresize={(e) => {
		viewport.width = window.innerWidth;
		viewport.height = window.innerHeight;
	}}
	onclick={isClickTrigger ? (e) => {
		if (
			e.target &&
			popoverRoot &&
			popover &&
			!popoverRoot.contains(e.target as HTMLElement) &&
			!popover.contains(e.target as HTMLElement)
		) {
			visible = false;
		}
	} : null}
/>
<div
	bind:this={popoverRoot}
	onclick={isClickTrigger ? () => {visible = !visible;} : null}
	onmouseenter={isMouseTrigger ? show : null}
	onmouseleave={isMouseTrigger ? hide : null}
	class={classNames}
	{...rest}>{@render children?.()}</div
>
{#snippet _popover()}
	<div
		role="tooltip"
		bind:this={popover}
		class={twMerge('popover dark:bg!', popoverClass, [isVisible ? "" : "hidden"])}
		style="top: {top}px; left: {left}px;"
		onmouseenter={isMouseTrigger ? show : null}
		onmouseleave={isMouseTrigger ? hide : null}
		transition:fade
	>
		{@render popoverContent()}
		{#if showArrow??true}
		<Play size="xs" class={twMerge('absolute text-white dark:text-(--clr-el-bg-dark)!', arrowClass)} />
		{/if}
	</div>
{/snippet}

{#if visible}
	{#if skipPortal==false||skipPortal === undefined}
		<Portal>{@render _popover()}</Portal>
	{:else}
		{@render _popover()}
	{/if}
{/if}

<style>
	@reference "$src/app.css";
	.popover {
		box-shadow: 0 2px 6px 4px rgba(0, 0, 0, 0.1);
		@apply fixed z-40 rounded bg-white;
	}
</style>
