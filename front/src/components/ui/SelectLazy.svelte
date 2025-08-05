<script lang="ts">
	import { ChevronRight, Close, Check } from '$icons';
	import type { ISelectLazyProps, IOption } from '$lib/types/IInputProps';
	import { onMount } from 'svelte';
	import { fade } from 'svelte/transition';
	import { twMerge } from 'tailwind-merge';
	import { v7 as uuid } from 'uuid';
	import Tooltip from './Tooltip.svelte';
	import { listToLazyOptions } from '$lib/support/form';
	import Popover from './Popover.svelte';
	import { pushMessage } from '$store/globals';
	import { EPositions, MessageType } from '$enums/EMessage';

	let { value = $bindable(), validation, ...props }: ISelectLazyProps = $props();
	let load = $derived.by(() => (props.load ? props.load : listToLazyOptions(props.options)));

	let isMultiple: boolean = $derived.by(() => Array.isArray(value));
	let options: IOption[] = $state([]);
	let defaultOptions: undefined | IOption[] = $state();
	let customOptions: IOption[] = $state([]);
	let selected: IOption[] = $state([]);
	let selectedValues: string[] = $derived.by(() => selected.map((s) => '' + s.value));
	let firstOfSelectedVal: string = $derived.by(() => (selected.length ? selectedValues[0] : ''));
	let loadTimeout: null | NodeJS.Timeout = $state(null);
	let placeholder = $derived.by(() => {
		let defaultPlaceholder = props.placeholder ? props.placeholder : '';
		if (isMultiple) {
			return selected.length ? selected.map((s) => s.name).join(', ') : defaultPlaceholder;
		} else {
			return selected[0] ? selected[0].name : defaultPlaceholder;
		}
	});
	let isEmpty = $derived.by(() => selected.length == 0);
	let st = $state({
		focused: false,
		filter: '',
		loading: false,
		holder: '',
		defaultOptions: null,
		componentUUID: uuid(),
		showSelected: false
	});
	const flushValue = () => {
		selected = [];
		syncVal();
		st.filter = placeholder;
	};
	const fetchOptions = (useValues = false) => {
		return new Promise((resolve) => {
			if (loadTimeout) {
				clearTimeout(loadTimeout);
			}
			loadTimeout = setTimeout(async () => {
				st.loading = true;
				if (useValues) {
					let r = await load("", Array.isArray(value) ? value : [value]);
					options = r.options;
					selected = r.selected||[];
					defaultOptions = options;
				} else {
					let r = await load(st.filter);
					options = r.options;
				}
				if(!st.focused) {
					st.filter = placeholder;
				}
				st.loading = false;
				
				resolve(true);
			}, 400);
		});
	};
	const syncVal = () => {
		value = isMultiple ? selectedValues : firstOfSelectedVal;
		if (props.onchange) {
			props.onchange(value);
		}
	};
	const setVal = (o: IOption) => {
		selected = [{ name: o.name, value: o.value }];
		syncVal();
		st.focused = false;
		st.showSelected = false;
		st.filter = placeholder;
	};
	const toggleVal = (o: IOption) => {
		if (isSelected(o)) {
			selected.splice(selectedValues.indexOf('' + o.value), 1);
		} else {
			selected.push({ name: o.name, value: o.value });
		}
		syncVal();
	};
	const isSelected = (o: IOption) => {
		return selectedValues.includes('' + o.value);
	};
	const addCustomOption = () => {
		customOptions.push({ name: '', value: uuid() });
	};
	const applyCustomOptions = async (opts: IOption[]) => {
		let _opts: IOption[] = [];

		for (let opt of opts) {
			let _opt = { name: opt.name, value: opt.value };
			_opts.push(_opt);
		}
		if (props.onApplyCustom) {
			_opts = await props.onApplyCustom(_opts);
		}

		let customNames = customOptions.map((o) => o.name);
		for (let opt of _opts.map((o) => o.name)) {
			let i = customNames.indexOf(opt);
			customOptions.splice(i, 1);
			customNames = customOptions.map((o) => o.name);
		}
		options.push(..._opts);
	};

	const blurCheck = async (e) => {
		if (
				(st.focused || st.showSelected) &&
				e.target &&
				e.target instanceof HTMLElement &&
				e.target.closest(`.select[data-uuid="${st.componentUUID}"]`) == null &&
				e.target.closest(`.options-container[data-uuid="${st.componentUUID}"]`) == null
		) {
			st.focused = false;
			st.showSelected = false;
			st.filter = placeholder;
		}
	}

	onMount(async () => {
		st.filter = placeholder;
		document.addEventListener('click', blurCheck);
		fetchOptions(true);
	});
</script>

<Popover opened={st.focused && !props.disabled && !st.showSelected && (props.allowCustom || options.length > 0)} horizontal="left-border" popoverClass={twMerge("!rounded-[10px]", props.popoverClass)} showArrow={false}>
	<div
		class={twMerge(
			'select relative flex w-fit flex-col gap-3',
			[props.disabled ? 'cursor-not-allowed opacity-65' : ''],
			props.class
		)}
		data-uuid={st.componentUUID}
	>
		<select class="hidden" name={props.name} multiple={isMultiple}>
			{#each selected as o}
				<option value={o.value} selected></option>
			{/each}
		</select>
		<div
			class={twMerge(
				'flex cursor-pointer items-center gap-3 rounded-full border border-[#D9D9D9] dark:border-[#ddd] bg-transparent text-inherit px-2 py-1 pr-4',
				[props.disabled ? 'cursor-not-allowed' : '']
			)}
		>
			{#if isMultiple && selected.length}
				<button
					type="button"
					class={twMerge(
						'flex cursor-pointer items-center gap-2 rounded-full bg-[var(--clr-main)] px-2 text-inherit whitespace-nowrap',
						[props.disabled ? 'cursor-not-allowed' : '']
					)}
					onclick={() => {
						st.showSelected = !st.showSelected;
						st.focused = false;
					}}>Выбрано: {selected.length}</button
				>
			{/if}
			{#if isMultiple && selected.length && st.showSelected}
				<div
					class="absolute top-full left-0 z-10 mt-2 flex w-full flex-wrap gap-1 rounded-[20px] border border-[#D9D9D9] bg-white p-2 shadow-lg"
				>
					{#each selected as v}
						<div class="flex items-center gap-2 rounded-full bg-[var(--clr-main)] px-2 text-inherit">
							{v.name}
							{#if !props.disabled && (props.clearable || selected.length > 1)}<button
									type="button"
									onclick={() => {
										toggleVal(v);
									}}
									class={twMerge('cursor-pointer', [props.disabled ? 'cursor-not-allowed' : ''])}
									><Close class="w-3" /></button
								>{/if}
						</div>
					{/each}
				</div>
			{/if}

			<input
				type="text"
				bind:value={st.filter}
				class={twMerge('!border-none px-2 py-1 flex-1 !outline-none', [
					props.disabled ? 'cursor-not-allowed' : ''
				])}
				disabled={props.disabled}
				onfocus={() => {
					st.focused = true;
					st.showSelected = false;
					st.filter = '';
					if(!st.loading) {
						if(defaultOptions == undefined) {
							fetchOptions(true).then(()=>{
								if(defaultOptions !== undefined) {
									options = defaultOptions;
								}
							})
						} else {
							options = defaultOptions;
						}
					}
				}}
				onblur={blurCheck}
				{placeholder}
				oninput={(e) => {
					fetchOptions();
				}}
			/>

			{#if props.clearable && !props.disabled && !isEmpty}
				<button
					type="button"
					onclick={flushValue}
					class={twMerge(
						'aspect-sqare flex h-auto w-6 cursor-pointer items-center justify-center rounded-full p-1 transition hover:bg-[var(--clr-main)] hover:text-inherit',
						[props.disabled ? 'cursor-not-allowed' : '']
					)}><Close class="w-3 text-current" /></button
				>
			{/if}

			<button
				type="button"
				onclick={() => {
					if (!props.disabled) {
						st.focused = !st.focused;
					}
				}}
				class={props.disabled ? 'cursor-not-allowed' : 'cursor-pointer'}
				><ChevronRight
					class={twMerge(['w-2', 'transition', st.focused ? '-rotate-90' : 'rotate-90'])}
				/></button
			>
		</div>	
	</div>
	{#snippet popoverContent()}
		<div
			data-uuid={st.componentUUID}
			transition:fade
			class="options-container z-10 w-full overflow-auto rounded-[10px] bg-white dark:bg shadow-lg"
		>
			{#if st.loading}
				<div class="px-3 py-2">loading ...</div>
			{:else}
				<div class="options max-h-[250px] overflow-auto">
					{#each options as option}
						<button
							type="button"
							class={twMerge(
								[
									'option block w-full cursor-pointer px-3 py-2 text-left transition-all hover:bg-[var(--clr-2)] hover:text-inherit'
								],
								[isSelected(option) ? 'bg-[var(--clr-2)]/25 ' : '']
							)}
							onclick={() => {
								isMultiple ? toggleVal(option) : setVal(option);
							}}>{option.name}</button
						>
					{/each}
				</div>
				{#if customOptions.length}
					<div
						class="options options-custom flex max-h-[250px] flex-col gap-1 overflow-auto border-t-2 border-gray-200 pt-1"
					>
						{#each customOptions as option, i}
							<div class="grid w-full grid-cols-[1fr_auto] gap-2 border-b-2 border-gray-200 pb-1">
								<div class="flex items-end">
									<input
										type="text"
										bind:value={option.name}
										placeholder={props.addFormPlaceholder ?? "Введите название"}
										class="h-full flex-1 pl-3 !outline-none"
									/>
								</div>
								<div class="grid grid-cols-2 gap-1">
									<Tooltip text="Сохранить пункт">
										<button
											type="button"
											class="flex aspect-square cursor-pointer items-center justify-center rounded-full p-1 transition hover:bg-[var(--clr-main)] hover:text-inherit"
											onclick={() => {
												try {
													if(validation ) {
														validation(""+option.name)
													}
													applyCustomOptions([option]);
												} catch(e) {
													pushMessage({message: ""+e, type: MessageType.Error}, EPositions.MiddleCenter);
												}
											}}><Check /></button
										>
									</Tooltip>
									<Tooltip text="Удалить пункт">
										<button
											type="button"
											class="flex aspect-square cursor-pointer items-center justify-center rounded-full p-1 transition hover:border hover:border-red-500 hover:text-red-500"
											onclick={() => {
												customOptions.splice(i, 1);
											}}><Close /></button
										>
									</Tooltip>
								</div>
							</div>
						{/each}
					</div>
				{/if}
				{#if props.allowCustom}
					<div class="grid w-full grid-cols-[1fr_auto]">
						<button
							type="button"
							class="option sticky bottom-0 block w-full cursor-pointer px-3 py-2 text-center transition hover:bg-[var(--clr-main)] hover:text-inherit"
							onclick={addCustomOption}>Добавить
						</button>
						{#if customOptions.length}
							<div class="grid grid-cols-2">
								<Tooltip class="flex aspect-square items-center" text="Сохранить все новые пункты">
									<button
										type="button"
										class="flex aspect-square h-full cursor-pointer items-center justify-center p-1 transition hover:bg-[var(--clr-main)] hover:text-inherit"
										onclick={async () => {
											try {
												for(let option of customOptions) {
													if(validation ) { validation(""+option.value) }
												}
												await applyCustomOptions(customOptions);
											} catch(e) {
												pushMessage({message: ""+e, type: MessageType.Error}, EPositions.MiddleCenter);
											}

											// applyCustomOptions(customOptions);
										}}><Check /></button
									>
								</Tooltip>
								<Tooltip class="flex aspect-square items-center" text="Удалить все новые пункты">
									<button
										type="button"
										class="flex aspect-square h-full cursor-pointer items-center justify-center p-1 transition hover:bg-red-500 hover:text-inherit"
										onclick={() => {
											customOptions = [];
										}}><Close /></button
									>
								</Tooltip>
							</div>
						{/if}
					</div>
				{/if}
			{/if}
		</div>
	{/snippet}
</Popover>
<style>
	.options-custom input {
		width: calc(100% - var(--spacing) * 3);
	}
</style>
