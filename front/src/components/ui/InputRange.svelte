<script lang="ts">
	import { Close } from '$icons/dist';
	import type { IRangeProps, RangeValue } from '$lib/types/IInputProps';
	import { twMerge } from 'tailwind-merge';
	let { min = $bindable(), max = $bindable(), limits, class: classNames, ...props }: IRangeProps = $props();
	let st: {min:RangeValue, max:RangeValue} = $state({
        min: min,
        max: max,
    })
    const syncVal = () => {
        min = st.min;
        max = st.max;
        props.onchange?.({event: null, min, max});
    }
    $effect(syncVal)
    const onchange = (e: any)=>{
        syncVal();
        props.onchange?.({event: e, min, max});
    }
    const oninput = (e: any)=>{
        syncVal();
        props.oninput?.({event: e, min, max});
    }
    const onfocus = (e: any)=>{
        syncVal();
        props.onfocus?.({event: e, min, max});
    }
    const onblur = (e: any)=>{
        syncVal();
        props.onblur?.({event: e, min, max});
    }
    const inputClass = "border border-[#D9D9D9] px-3 py-2 text-center !outline-none flex-1 pr-5" 
</script>



<div class={twMerge('relative flex min-w-[250px] flex-row bg-white dark:bg-default dark:text-default', classNames)}>
	<div class="flex flex-1 w-[50%] relative">
        <input
            type="number"
            class={twMerge("rounded-l-full ", inputClass)}
            bind:value={st.min}
            step={1}
            placeholder={limits.min ? ""+limits.min : "0"}
            min={limits.min}
            max={limits.max}
            onchange={onchange}
            oninput={oninput}
            onfocus={(e: FocusEvent)=>{
                onfocus(e);
                let target: null|HTMLInputElement = e.target as HTMLInputElement;
                if(target?.value == "") { st.min = limits.min as RangeValue }
            }}
            onblur={(e) => {
                onblur(e);
                let target: null|HTMLInputElement = e.target as HTMLInputElement;
                if(Number(target?.value) == limits.min) { st.min = undefined }
            }}
            name={props.name+"[min]"}
        />
        {#if props.clearable && st.min && Number(st.min) > limits.min}
        <button
            type="button"
            onclick={() => {
                st.min = undefined;
                syncVal();
            }}
            class={twMerge('cursor-pointer rounded-full h-6 w-6 absolute right-1 top-1/2 translate-y-[-50%] flex items-center justify-center transition hover:text-white hover:bg-[var(--clr-main)]', [props.disabled ? 'cursor-not-allowed' : ''])}
            ><Close class="w-3" />
        </button>
        {/if}
    </div>
    <div class="flex flex-1 w-[50%] relative">
        <input
            type="number"
            class={twMerge("rounded-r-full", inputClass)}
            bind:value={st.max}
            step={1}
            placeholder={limits.max ? ""+limits.max : "0"}
            min={limits.min}
            max={limits.max}
            onchange={onchange}
            oninput={oninput}
            onfocus={(e: FocusEvent)=>{
                onfocus(e);
                let target: null|HTMLInputElement = e.target as HTMLInputElement;
                if(target?.value == "") { st.max = limits.max as RangeValue }
            }}
            onblur={(e) => {
                onblur(e);
                let target: null|HTMLInputElement = e.target as HTMLInputElement;
                if(Number(target?.value) == limits.max) { st.max = undefined }
            }}
            name={props.name+"[max]"}
        />
        {#if props.clearable && st.max && Number(st.max) < limits.max}
        <button
            type="button"
            onclick={() => {
                st.max = undefined;
                syncVal();
            }}
            class={twMerge('cursor-pointer rounded-full h-6 w-6 absolute right-1 top-1/2 translate-y-[-50%] flex items-center justify-center transition hover:text-white hover:bg-[var(--clr-main)]', [props.disabled ? 'cursor-not-allowed' : ''])}
            ><Close class="w-3" />
        </button>
        {/if}
    </div>

    {#if props.clearable && ((st.min || st.max) && (st.max != "" || st.min != "") && (Number(st.min) > limits.min || Number(st.max) < limits.max))}
        <button
            type="button"
            onclick={() => {
                st.min = undefined;
                st.max = undefined;
                syncVal();
            }}
            class={twMerge('cursor-pointer border border-[#D9D9D9] rounded-full aspect-square h-10 w-10 ml-2 flex items-center justify-center transition hover:text-white hover:bg-[var(--clr-main)] ', [props.disabled ? 'cursor-not-allowed' : ''])}
            ><Close class="w-3" />
        </button>
    {/if}
</div>

<style>
    input {
        -moz-appearance: textfield;
    }
    input::-webkit-outer-spin-button,input::-webkit-inner-spin-button {
        -webkit-appearance: none;
    }
</style>