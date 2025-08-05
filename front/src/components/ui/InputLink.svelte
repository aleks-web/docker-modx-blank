<script lang="ts">
	import { twMerge } from 'tailwind-merge';
	import { ChevronRight } from "$icons";
	import type { TFieldStatus } from "$lib/types/TFieldStatus";

	interface InputTextPropsInterface {
		name?: string;
		placeholder?: string;
		value?: string;
		label?: string;
		type?: "domain";
		class?: string;
		status?: TFieldStatus;
	}

	let { placeholder, name, label, type, value = $bindable(), status = $bindable(), class: classNames } : InputTextPropsInterface = $props();

	status = { name: name ? name : '', status: 'default' }

	let httpScheme = $state('https:');


	function changeScheme(scheme: string) {
		if (scheme === 'https') {
			toggleShemeUrl();
			httpScheme = 'https:';
		} else if (scheme === 'http') {
			toggleShemeUrl();
			httpScheme = 'http:';
		}
	}

	function toggleShemeUrl() {
		if (httpScheme === 'https:' && value) {
			value = value.replace('https:', 'http:');
		}

		if (httpScheme === 'http:' && value) {
			value = value.replace('http:', 'https:');
		}
	}

	function onInput() {
		if (!value) {
			status.status = 'error';
		}

		try {
			let url = new URL(value);

			if (url.protocol === 'https:' || url.protocol === 'http:') {
				httpScheme = url.protocol;
				status.status = 'success';
				status.message = undefined;

				if (type === 'domain') {
					value = url.origin;
				}
			} else {
				status.status = 'error';
			}
		} catch (er) {
			status.status = 'error';
		}
	}

	let btnClasses = 'flex items-center gap-2 transition-all w-full text-left px-2 py-1 text-[var(--clr-text)] cursor-pointer hover:bg-[var(--clr-2)] hover:text-white [.active]:bg-[var(--clr-2)] [.active]:after:block [.active]:text-white after:hidden after:rounded-full after:w-2 after:h-2 after:bg-[var(--clr-success)]';
</script>

<div class={twMerge("group/input flex flex-col", classNames)} class:error={status?.status === 'error'} class:success={status?.status === 'success'}>
	<div>
		{#if label && !status?.message}
			<div class="ui-label">{label}</div>
		{/if}

		{#if status?.message}
			<div class="ui-label">{status?.message}</div>
		{/if}
	</div>

	<div class="flex border-1 border-[#D9D9D9] rounded-full p-[4px] bg-[var(--color-white)] group-[.error]/input:bg-[#fff4f4] group-[.success]/input:bg-[#f7fffa]">

		<div class="group relative min-w-[80px]">
			<div class="flex items-center justify-between bg-[var(--clr-main)] text-white h-full px-3 rounded-full cursor-pointer transition-all gap-2 hover:bg-[var(--clr-2)]">
				<span>{ httpScheme }</span>
				<ChevronRight class="w-[10px] h-[10px] rotate-90 transition-all group-hover:rotate-270" />
			</div>

			<div class="z-10 absolute invisible overflow-hidden top-[calc(100%_+5px)] w-full rounded-sm transition-all opacity-0 bg-white shadow-lg group-hover:opacity-100 group-hover:visible">
				<button type="button" class={ btnClasses } class:active={httpScheme === 'http:'} onclick={() => { changeScheme('http') }}>http</button>
				<button type="button" class={ btnClasses } class:active={httpScheme === 'https:'} onclick={() => { changeScheme('https') }}>https</button>
			</div>
		</div>

		<input class="w-full h-full outline-0 p-[6px] text-[var(--clr-text)]" placeholder={placeholder} bind:value={value} name={name} type="text" oninput={onInput}>
	</div>
</div>