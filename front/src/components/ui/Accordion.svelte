<script lang="ts">
	import { slide } from 'svelte/transition';
	import { twMerge } from 'tailwind-merge';

	let {
		title,
		class: className,
		showArrow = true,
		open = false,
		children,
		headingClass,
		bodyClass
	}: {
		title: string | (() => any);
		class?: string;
		showArrow?: boolean;
		open?: boolean;
		children?: () => any;
		headingClass?: string;
		bodyClass?: string;
	} = $props();
</script>

<div class={twMerge('accordion', className)}>
	<!-- svelte-ignore a11y_click_events_have_key_events -->
	<div
		role="tab"
		tabindex="0"
		class={twMerge('heading', headingClass)}
		onclick={() => {
			open = !open;
		}}
	>
		{#if showArrow}<div class="arrow"></div>{/if}
		{#if typeof title == 'string'}
			<div class="title">{title}</div>
		{:else}
			{@render title()}
		{/if}
	</div>
	{#if open}
		<div transition:slide class={twMerge('body', bodyClass)}>
			{@render children?.()}
		</div>
	{/if}
</div>

<style>
	@reference "$src/app.css";
	.accordion {
		@apply flex flex-col overflow-hidden;
	}
	.accordion > .heading {
		@apply flex cursor-pointer flex-row transition;
	}
	.accordion > .heading > .arrow {
	}
	.accordion > .heading > .title {
	}
	.accordion > .body {
	}
</style>
