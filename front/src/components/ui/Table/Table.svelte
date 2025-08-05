<script lang="ts">
	import { onDestroy, onMount, type Snippet } from 'svelte';
	import { twMerge } from 'tailwind-merge';
	import THead from './THead.svelte';
	import TBody from './TBody.svelte';
	import type { Column, FilterValue, TableFilter, TableRows } from '.';
	import { fade } from 'svelte/transition';
	import { submitGetForm } from '$src/lib/support/form';
    
	let { class: classNames, columns, dataset, filterValue = {}}: {
        class?: string|string[],
        columns: Column[],
        dataset: TableRows,
        headRenderer?: Snippet<Column[]>,
        filterValue?: FilterValue,
    } = $props();

    let cellMap = $derived.by(()=>{
        let f: Column[] = [], d: Column[] = [];
        for(let i = 0; i<columns.length; i++) {
            (columns[i].fixed ? f : d).push(columns[i]);
        }
        return {fixed:f, dynamic:d};
    })

    let tableNode: undefined|HTMLDivElement = $state();
    const alignRefresh = ()=>{
        if(tableNode && dataset.length>0) {
            let headings = tableNode.querySelectorAll(".t-head .t-cell");
            let cells = tableNode.querySelectorAll(".row-0 .t-cell");
            let maxWidth:number; 
            for(let i=0; i<headings.length; i++) {
                maxWidth = Math.max(headings[i].clientWidth, cells[i].clientWidth);
                (headings[i] as HTMLElement).style.minWidth = maxWidth+'px';
                (headings[i] as HTMLElement).style.width = maxWidth+'px';
                (headings[i] as HTMLElement).style.maxWidth = maxWidth+'px';
                (cells[i] as HTMLElement).style.minWidth = maxWidth+'px';
                (cells[i] as HTMLElement).style.width = maxWidth+'px';
                (cells[i] as HTMLElement).style.maxWidth = maxWidth+'px';
            }
        }
    } 

    let observer: null|MutationObserver = null;
    let redyToView = $state(false);
	onMount(() => {        
		if(tableNode) {
			const observerConf = { attributes: true, childList: true, subtree: true };
            observer = new MutationObserver(alignRefresh); 
			observer.observe(tableNode, observerConf);
		}
        redyToView = true;
	});
	onDestroy(()=>{
		observer?.disconnect();
		observer = null;
	})
    // $effect(alignRefresh);

    const theadClass = "dark:bg-default";
    const tbodyClass = "";

    let filter: TableFilter = $state({});
    const refreshFilter = () => {
        filter = {};
        for(let col of columns) {
            if(col.filter) {
                let k = col?.name||"col-"+col.index;
                filter[k] = [col.filter.getType(), filterValue[k] || col.filter.getDefault()];
            }
        }
    }
    refreshFilter();
    let filterForm: HTMLFormElement|undefined = $state();
    const submit = ()=>{ 
        (filterForm?.querySelector("button[type=\"submit\"]") as HTMLButtonElement)?.click(); 
    }
</script>
{#if Object.entries(filter).length > 0}
<form bind:this={filterForm} method="GET"  action="?" onsubmit={submitGetForm} class="hidden">
	<div class="flex flex-wrap gap-3 items-end z-20">
        {#each Object.entries(filter) as [fieldKey, [fieldType, fieldValue]]} 
            <input class="" type={fieldType} name={fieldKey} bind:value={filter[fieldKey][1]}>
        {/each}
		<button class="btn !rounded-full !px-5" type="submit">Применить</button>
	</div>
</form>
{/if}

<div bind:this={tableNode} class={twMerge("tbl relative", classNames)}>
    <div class={twMerge("flex")}>
        <table><THead columns={cellMap.fixed} class={theadClass} {filterValue} {filter} onSubmitFilter={submit}/></table>
        <table class="w-full"><THead columns={cellMap.dynamic} class={theadClass} {filterValue} {filter} onSubmitFilter={submit}/></table>
    </div>
    <div class={twMerge("flex")}>
        <table><TBody {...{columns:cellMap.fixed, dataset}} class={tbodyClass}/></table>
        <table class="w-full"><TBody {...{columns:cellMap.dynamic, dataset}} class={tbodyClass}/></table>
    </div>
    {#if !redyToView}
    <div class=" absolute top-0 right-0 bottom-0 left-0 bg-slate-200 z-10 rounded" transition:fade></div>
    {/if}
</div>

<style>
    @reference "$src/app.css";
    .tbl {
    }
    :global(.tbl .t-cell) {
        @apply pr-4;
    }
</style>