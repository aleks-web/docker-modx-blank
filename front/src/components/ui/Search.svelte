<script lang="ts">
	/*
	* Main
	* */
	import { type Component } from 'svelte';
	import { twMerge } from 'tailwind-merge';
	import { Search, Close } from "$icons";

	let inputSearch: HTMLInputElement;

	let { value = $bindable(), class: classes, icon: Icon, name, placeholder, onkeydown, onclean }: { value?: string, icon?: Component, class?: string, name?: string, placeholder?: string, onkeydown?: (e: KeyboardEvent) => any, onclean?: (e: Event) => any } = $props();
	let loading = $state(false);

	if (!Icon) {
		Icon = Search;
	}

	function inputHandler(event: KeyboardEvent) {
		if (event.key === 'Enter' && onkeydown) {
			onkeydown(event);
		}
	}

	function closeClick(e: Event) {
		value = '';
		onclean?.(e);
		inputSearch.focus();
	}

	let formClasses = 'flex relative h-[35px] sm:h-[40px] text-[var(--clr-text)]';
</script>

<div class={twMerge(formClasses, classes)} class:loading={loading}>

	<div class="h-full bg-[#f8f8f8] rounded-lg px-2 w-full flex items-center gap-2 overflow-hidden dark:bg-default dark:text-default dark:border-1 dark:border-[#889caf]">

		{#if loading}
			<div role="status">
				<svg aria-hidden="true" class="w-4 h-4 text-gray-200 animate-spin dark:text-gray-600 fill-[var(--clr-main)] xl:w-5 xl:h-5" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
					<path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
					<path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
				</svg>
			</div>
		{:else}
			<Icon />
		{/if}

		<input bind:this={inputSearch} name={ name ? name : 'search' } class="h-full outline-0 border-0 w-full bg-transparent pt-[2px]" placeholder={ placeholder ? placeholder : 'Поиск...' } bind:value={ value } onkeydown={inputHandler} />

		<button type="button" class="cursor-pointer h-full px-2 hover:text-[var(--clr-error)]" onclick={closeClick}>
			<Close size="sm" class="transition-all" />
		</button>

	</div>

</div>