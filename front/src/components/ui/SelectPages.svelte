<script lang="ts">
	import { goto } from '$lib/support/request';
	import { fade } from 'svelte/transition';
	import { onMount } from 'svelte';
	import { twMerge } from 'tailwind-merge';
	import type { TPagination } from '$lib/types/TPagination';

	type Props = {
		value?: number,
		sizes?: number[],
		class?: string,
		pagination: TPagination
	};

	import { ChevronRight } from "$icons";

	let { sizes, class: classNames, pagination }: Props = $props();

	let isOpenList = $state(false);

	if (!sizes) {
		sizes = [10, 20, 50, 100];
	}

	/*
			Methods
	*/
	function toggleList() { isOpenList = !isOpenList; }

	function setItem(size: number): void {
		const url = new URL(window.location.href);
		url.searchParams.set('size', String(size));

		if (url.searchParams.get('page')) {
			url.searchParams.set('page', '1');
		}

		goto(url.href);
	}

	function setItemByClick(size: number): void {
		setItem(size);
		toggleList();
	}

	const textClass  = `text-[14px] s:text-[15px] sm:text-[16px] break-all`;

	const itemClass = `group/item select-item cursor-pointer transition-all px-2 py-1 flex items-center gap-2 w-full justify-between text-left
                       hover:bg-[var(--clr-2)] hover:text-white
                       [.isActive]:bg-[var(--clr-2)] [.isActive]:text-white ` + textClass;



	let optionsList: undefined | HTMLDivElement = $state();
	let componentRoot: undefined | HTMLButtonElement = $state();
	let minWidth = $derived.by(()=>{
		if(componentRoot) {
			let rootRect = componentRoot.getBoundingClientRect();
			return rootRect.width;
		}
		return 0;
	});
	let position = $state("top: 0;");
	const refreshPosition = ()=>{
		if(optionsList && componentRoot) {
			let affix = 10;
			let rootRect = componentRoot.getBoundingClientRect();
			let listRect = optionsList.getBoundingClientRect();
			if (rootRect.bottom + listRect.height + affix > window.innerHeight) {
				position = "top: " + (rootRect.top - listRect.height - affix) + "px;";
			} else {
				position = "top: " + (rootRect.bottom + affix) + "px;";
			}
		}
	};

	function openListEventHandler(e: CustomEvent) {
		refreshPosition();
	}

	function windowResizeHnadler() {
		refreshPosition();
	}
	onMount(windowResizeHnadler);
</script>
<svelte:window onresize={windowResizeHnadler} onclick={() => { // Закрытие выпадающего списка
		window.addEventListener('click', (e) => {
			if (componentRoot && !componentRoot.contains(e.target as HTMLElement)) {
				isOpenList = false;
			}
		});
	}} />
<button bind:this={componentRoot}   type="button" class={twMerge("cursor-pointer select-pages relative text-[var(--clr-text)] dark:text-default h-[40px] s:h-[35px] sm:h-[40px]", textClass, classNames)} onclick={() => { toggleList() }}>
	<input type="hidden" value={pagination.pageSize} name='size'>

	<div class="relative flex items-center bg-[var(--clr-el-bg)] overflow-hidden rounded-md h-[inherit] dark:bg-default">

		<div class="select-pages-view flex outline-0 px-3 pr-10 text-left leading-4 w-full transition-all min-w-max cursor-pointer text-[13px] s:text-[14px] sm:text-[16px]">
			{ pagination.pageSize }
		</div>

		<div class="absolute top-0 right-0 h-full flex items-center justify-center min-w-[30px] bg-[var(--clr-el-bg)] dark:bg-default s:min-w-[40px]">
			<div class="transition-all" class:rotate-180={ isOpenList } class:text-[var(--clr-main)]={ isOpenList } class:dark:text-[var(--clr-2)]={ isOpenList }>
				<ChevronRight class="rotate-90 w-3 h-3" />
			</div>
		</div>
	</div>

	{#if isOpenList}
		<div bind:this={optionsList} transition:fade={{ duration: 200 }} onintrostart={openListEventHandler}
				 class="select-list fixed bg-[white] shadow-lg w-fit rounded-md flex-col overflow-hidden max-h-[300px] overflow-y-auto z-100 dark:bg-default" style={`width: ${minWidth}px; ${position}`}>

			<div class="w-full">
				{#each sizes as size}
					<div class:isActive={pagination.pageSize === size} class={ itemClass } onpointerdown={() => setItemByClick(size)}>
						{ size }
					</div>
				{/each}
			</div>

		</div>
	{/if}
</button>