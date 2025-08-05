<script lang="ts">
	import { ChevronRight, Close, Check } from '$icons';
	import { StrLen } from '$lib/support/validation/StrLen';
	import type { ISelectLazyProps, IOption } from '$lib/types/IInputProps';
	import { onMount } from 'svelte';
	import { fade } from 'svelte/transition';
	import { twMerge } from 'tailwind-merge';
	import { v7 as uuid } from 'uuid';
	import Tooltip from './Tooltip.svelte';

	let {value = $bindable(), ...props }: ISelectLazyProps = $props();
	let isMultiple: boolean = $derived.by(()=>(Array.isArray(value)));
	let options: IOption[] = $state([]);
	let customOptions: IOption[] = $state([]);
	let selected: IOption[] = $state([]);
	let selectedValues: string[] = $derived.by(()=>(selected.map(s=>""+s.value)));
	let firstOfSelectedVal: string = $derived.by(()=>(selected.length ? selectedValues[0] : ""))
	let loadTimeout: null | NodeJS.Timeout = $state(null);
	let placeholder = $derived.by(()=>{
		let defaultPlaceholder = props.placeholder ? props.placeholder : "";
		if(isMultiple) {
			return selected.length ? selected.map((s)=>s.name).join(', ') : defaultPlaceholder;
		} else {
			return selected[0] ? selected[0].name : defaultPlaceholder;
		}
	})
	let isEmpty = $derived.by(()=>(selected.length == 0));
	let st = $state({
		focused: false,
		filter: '',
		loading: false,
		holder: '',
		defaultOptions: null,
		componentUUID: uuid(),
        showSelected: false,
	});
	const flushValue = () => {
		selected = [];
		syncVal();
		st.filter = placeholder;
	}
	const fetchOptions = (useValues = false) => {
		return new Promise((resolve)=>{
			if(loadTimeout) {clearTimeout(loadTimeout);}
			loadTimeout = setTimeout(async ()=>{
				st.loading = true;
				if(useValues) {
					let r = await props.load('', Array.isArray(value) ? value : [value]);
					options = r.options;
					selected = r.selected;
				} else {
					let r = await props.load(st.filter);
					options = r.options;
				}
				st.loading = false;
				resolve(true);
			}, 400)
		})
	}
	const syncVal = () => {value = isMultiple ? selectedValues : firstOfSelectedVal; if(props.onchange) {props.onchange(value);}}
	const setVal = (o: IOption) => {
		selected = [{name: o.name, value: o.value}];
		syncVal();
		st.focused = false;
		st.showSelected = false;
		st.filter = placeholder;
	}
	const toggleVal = (o: IOption) => {
		if (isSelected(o)) {
			selected.splice(selectedValues.indexOf(""+o.value), 1);
		} else {
			selected.push({name: o.name, value: o.value});
		}
		syncVal();
	}
	const isSelected = (o: IOption) => {
		return selectedValues.includes(""+o.value);
	}
	const addCustomOption = () => {
		customOptions.push({name: "", value: uuid()});
	}
	const applyCustomOptions = (opts: IOption[]) => {
		console.log(opts);
		let _opts: IOption[] = [];

		for(let opt of opts) {
			let _opt = {name: opt.name, value: opt.value};
			_opts.push(_opt);
		}
		if(props.onApplyCustom) {
			_opts = props.onApplyCustom(_opts);
		}

		let customNames = customOptions.map(o=>o.name);
		for(let opt of _opts.map(o=>o.name)) {
			let i = customNames.indexOf(opt);
			customOptions.splice(i, 1);
			customNames.splice(i, 1);
		}
		options.push(..._opts);
	}

	onMount(async ()=>{
	    await fetchOptions(true);
		st.filter = placeholder;
	    document.addEventListener("click", async (e)=>{
	       if((st.focused || st.showSelected) && e.target && e.target instanceof HTMLElement && e.target.closest(`.select[data-uuid="${st.componentUUID}"]`) == null) {
	            st.focused = false;
	            st.showSelected = false;
				st.filter = placeholder;
	       }
	    });
	});
</script>

<div class={twMerge("select relative flex w-fit flex-col gap-3", [props.disabled?"opacity-65 cursor-not-allowed":""], props.class)} data-uuid={st.componentUUID}>
	<div class={twMerge("flex cursor-pointer items-center gap-3 rounded-full border border-[#D9D9D9] bg-white px-2 py-1 pr-4", [props.disabled?"cursor-not-allowed":""])}>
		{#if isMultiple && selected.length }
            <button type="button" class={twMerge("bg-[var(--clr-main)] text-white px-2 rounded-full flex items-center gap-2 cursor-pointer", [props.disabled?"cursor-not-allowed":""])} onclick={()=>{st.showSelected = !st.showSelected; st.focused = false;}}>Выбрано: {selected.length}</button>
        {/if}
        {#if isMultiple && selected.length && st.showSelected }
			<div class="absolute flex flex-wrap gap-1 top-full left-0 mt-2 border border-[#D9D9D9] shadow-lg rounded-[20px] w-full bg-white z-10 p-2">
				{#each selected as v}
					<div class="bg-[var(--clr-main)] text-white px-2 rounded-full flex items-center gap-2">{v.name} {#if !props.disabled && (props.clearable || selected.length>1)}<button type="button" onclick={()=>{toggleVal(v)}} class={twMerge("cursor-pointer", [props.disabled?"cursor-not-allowed":""])}><Close class="w-3"/></button>{/if}</div>
				{/each}
			</div>
        {/if}

        <input type="text" bind:value={st.filter} class={twMerge("px-2 py-1 !outline-none !border-none", [props.disabled?"cursor-not-allowed":""])} disabled={props.disabled}
                onfocus={() => { st.focused = true; st.showSelected = false; st.filter = "";}}
                placeholder={placeholder}
                oninput={(e)=> { fetchOptions() }}
            />

		{#if props.clearable && !props.disabled && !isEmpty}
			<button type="button" onclick={flushValue} class={twMerge("cursor-pointer rounded-full hover:bg-[var(--clr-main)] transition p-1 w-6 aspect-sqare h-auto flex justify-center items-center hover:text-white", [props.disabled?"cursor-not-allowed":""])}><Close class="w-3 text-current"/></button>
        {/if}

		<button type="button" onclick={()=>{if(!props.disabled){st.focused = !st.focused;}}} class={props.disabled?"cursor-not-allowed":"cursor-pointer"}><ChevronRight class={twMerge(["w-2", "transition", st.focused? "-rotate-90" : "rotate-90"])} /></button>
	</div>
	{#if (st.focused) && !props.disabled && !st.showSelected}
		<div transition:fade class="options-container absolute top-[calc(100%+10px)] z-10 w-full overflow-auto rounded-[10px] bg-white shadow-lg">
            {#if st.loading}
                <div class="px-3 py-2">loading ...</div>
            {:else}
                <div class="options max-h-[250px] overflow-auto">
                    {#each options as option}
                        <button
                            type="button"
                            class={
                                twMerge(["option block w-full cursor-pointer transition-all px-3 py-2 text-left hover:bg-[var(--clr-2)] hover:text-white"], [isSelected(option)?"bg-[var(--clr-2)]/25 ":""])
                            }
                            onclick={() => {
                                isMultiple ? toggleVal(option) : setVal(option);
                            }}>{option.name}</button
                        >
                    {/each}
					
                </div>
				{#if customOptions.length }
				<div class="options options-custom max-h-[250px] overflow-auto border-t-2 border-gray-200 pt-1 flex flex-col gap-1">
					{#each customOptions as option, i}
						<div class="grid grid-cols-[1fr_auto] gap-2 w-full border-b-2 pb-1 border-gray-200 ">
							<div class="flex items-end ">
								<input type="text" bind:value={option.name} placeholder="Введите название" class="!outline-none flex-1 pl-3 h-full">
							</div>
							<div class="grid grid-cols-2 gap-1">
								<Tooltip text="Сохранить пункт">
									<button type="button" class="flex items-center justify-center cursor-pointer aspect-square hover:bg-[var(--clr-main)] hover:text-white transition rounded-full p-1" onclick={()=>{applyCustomOptions([option]);}}><Check/></button>
								</Tooltip>
								<Tooltip text="Удалить пункт">
									<button type="button" class="flex items-center justify-center cursor-pointer aspect-square hover:border hover:border-red-500 hover:text-red-500 transition rounded-full p-1" onclick={()=>{customOptions.splice(i, 1)}}><Close/></button>
								</Tooltip>
							</div>
						</div>
					{/each}
				</div>
				{/if}
                {#if props.allowCustom}
                    <div class="grid grid-cols-[1fr_auto] w-full">
						<button type="button" class="option sticky bottom-0 block w-full cursor-pointer px-3 py-2 text-center hover:text-white hover:bg-[var(--clr-main)] transition" onclick={addCustomOption}>Добавить</button>
						{#if customOptions.length }
						<div class="grid grid-cols-2">
							<Tooltip class="flex items-center aspect-square" text="Сохранить все новые пункты">
								<button type="button" class="flex items-center justify-center h-full cursor-pointer aspect-square hover:bg-[var(--clr-main)] hover:text-white transition p-1" onclick={()=>{applyCustomOptions(customOptions);}}><Check/></button>
							</Tooltip>
							<Tooltip class="flex items-center aspect-square" text="Удалить все новые пункты">
								<button type="button" class="flex items-center justify-center h-full cursor-pointer aspect-square hover:bg-red-500 hover:text-white transition p-1" onclick={()=>{customOptions = [];}}><Close/></button>
							</Tooltip>
						</div>
						{/if}
					</div>
                {/if}
			{/if}
		</div>
	{/if}
</div>
<style>
	.options-custom input {
		width: calc(100% - var(--spacing) * 3);
	}
</style>