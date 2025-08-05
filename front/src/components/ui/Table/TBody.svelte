<script lang="ts">
	import { twMerge } from 'tailwind-merge';
	import { getColClass, getColIdentity, type Column, type TableRows } from '.';
	import Cell from './Cell.svelte';

	let { class: classNames, columns, onClick, dataset}: {
        class?: string|string[],
        columns: Column[],
        dataset: TableRows,
        onClick?: (e: PointerEvent)=>Promise<void>
    } = $props();
    const trClass = twMerge(`group/tr h-[70px] border-b-1 border-b-[#D9D9D9] cursor-pointer
                             dark:border-b-[#4a6176]
                             last:border-b-0`, classNames);
</script>


<tbody class={twMerge("t-body", classNames)} >
    {#each dataset as row, i }
        <tr class={twMerge("t-row", `row-${i}`, trClass)}>
            {#each columns as col}
                <Cell class={twMerge(col.class, getColClass(col))} {...(col.onClick ? {onclick: (e:any)=>{col.onClick?.(e, col);}} :{})}>
                    {#if col.render} {@render col.render(col, row)} {:else} {row[getColIdentity(col, row)]} {/if}
                </Cell>
            {/each}
        </tr>
    {/each}
</tbody>

<style>
    @reference "$src/app.css";
</style>