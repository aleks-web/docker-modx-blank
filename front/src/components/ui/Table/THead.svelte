<script lang="ts">
	import { twMerge } from 'tailwind-merge';
	import { getFilterKey, type Column, type FilterHandler, type FilterValue, type TableFilter } from '.';
	import Cell from './Cell.svelte';
	import Popover from '../Popover.svelte';
	import Filter from '$icons/dist/Filter.svelte';

	let {
		class: classNames,
		columns,
		filter = $bindable(),
		filterValue,
		onSubmitFilter
	}: {
		class?: string | string[];
		columns: Column[];
		filterValue?: FilterValue;
		filter?: TableFilter;
		onSubmitFilter?: FilterHandler;
	} = $props();

	const isFilterApplyed = (col: Column) =>
        filter?.[getFilterKey(col)] &&
		filterValue?.[getFilterKey(col)] &&
		filterValue?.[getFilterKey(col)] == filter?.[getFilterKey(col)][1];

	const isFilterChanged = (col: Column) =>
		col.filter &&
		filterValue?.[getFilterKey(col)] != filter?.[getFilterKey(col)][1] &&
		filter?.[getFilterKey(col)][1] != col.filter.getDefault();
</script>

<thead class={twMerge('t-head', classNames)}>
	<tr>
		{#each columns as col}
			<Cell
				class={twMerge('font-bold', col.capClass, `col-${col.index}`)}
				{...col.onClick
					? {
							onclick: (e: any) => {
								col.onClick?.(e, col);
							}
						}
					: {}}
			>
				<div class="bold flex items-center gap-[10px] text-lg">
					{#if col.renderCap}
						{@render col.renderCap(col)}
					{:else}
						{col.label || col.name}
					{/if}

					{#if col.filter}
						<Popover popoverClass={'!bg-transparent !shadow-none'}>
							{#snippet popoverContent()}
								{#if col.filter}
									{@const FilterComponent = col.filter.render}
									{@const filterKey = getFilterKey(col)}
									<FilterComponent
										value={filter?.[filterKey][1] || col.filter.getDefault()}
										oninput={(e: any) => {
											if (filter?.[filterKey]) {
												filter[filterKey][1] = e.target.value;
											}
										}}
										onSubmit={onSubmitFilter}
									/>
								{/if}
							{/snippet}

							<div class="relative cursor-pointer">
								<Filter class={'w-4'}></Filter>
								{#if isFilterChanged(col)}
                                    <div class="absolute top-[-2px] right-[-3px] h-2 w-2 rounded-full bg-amber-400"></div>
								{:else if isFilterApplyed(col)}
									<div class="absolute top-[-2px] right-[-3px] h-2 w-2 rounded-full bg-lime-400"></div>
								{/if}
							</div>
						</Popover>
					{/if}
				</div>
			</Cell>
		{/each}
	</tr>
</thead>

<style>
	@reference "$src/app.css";
	.t-head {
		@apply flex;
	}
	.t-head .t-cell:not(:first-child) {
		@apply px-3;
	}
</style>
