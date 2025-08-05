<script lang="ts">
	import { i18n } from '$lib/i18n';
	import { ParaglideJS } from '@inlang/paraglide-sveltekit';
	import { themeMod, EThemeMod } from '$store/themeMod';
	import type { LayoutProps } from './$types';

	import '$lib/fonts/Roboto/stylesheet.css';
	import '$src/app.css';
	import MessageBus from '$components/ui/MessageBus.svelte';
	import LoadingScreen from "$components/ui/LoadingScreen.svelte";

	let { children, data }: LayoutProps = $props();

	$effect(() => {
		const body = document.querySelector('body')?.classList;

		// eslint-disable-next-line @typescript-eslint/no-unused-expressions
		$themeMod === EThemeMod.Dark ? body?.add('dark') : body?.remove('dark');
	});

</script>

<ParaglideJS {i18n}>
	<div class:dark={$themeMod === EThemeMod.Dark} class="min-h-[100svh]">
		{@render children()}
	</div>
	<MessageBus/>
	<LoadingScreen/>
</ParaglideJS>