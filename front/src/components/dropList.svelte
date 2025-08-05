<script lang="ts">
	import { ChevronRight } from '$icons';
	import Portal from 'svelte-portal';
	import Popover from './ui/Popover.svelte';

	export type TDropListItem = {
		name?: string;
		icon?: any;
		onpointerdown?: Function;
	};

	let {
		Icon = null,
		text = null,
		list
	}: { Icon?: any | null; text?: string | null; list: TDropListItem[] } = $props();

	function onClickItem(itemCallback: Function | null | undefined) {
		if (!itemCallback) {
			return;
		}

		itemCallback();
	}
</script>

<Popover trigger="mouseenter" vertical="bottom" horizontal="right-border" showArrow={false}>
	<div class="flex cursor-pointer items-center gap-3 transition-all hover:text-[var(--clr-2)]">
		{#if Icon}
			<div class="flex text-[var(--clr-2)]">
				<i class="h-[20px] min-w-max dark:text-default"><Icon /></i>
			</div>
		{/if}

		{#if text}
			<div class="hidden text-[13px] dark:text-default s:text-[14px] sm:flex">{ text }</div>
		{/if}

		<div class="w-[6px] rotate-90 dark:text-default"><ChevronRight size="xs" /></div>
	</div>
	{#snippet popoverContent()}
		<ul class="min-w-max overflow-hidden rounded bg-[var(--clr-2)] text-white transition-all ">
			{#each list as item}
				{@const ComponentIcon = item.icon}

				<li class="flex cursor-pointer items-center gap-2 p-3 pr-6 transition-all hover:bg-[#5696ee]" onpointerdown={(e) => onClickItem(item.onpointerdown)}>
					{#if item.icon}
						<span class="block h-[25px] w-[25px]"><ComponentIcon /></span>
					{/if}

					<span>{item.name}</span>
				</li>
			{/each}
		</ul>		
	{/snippet}
</Popover>
