<script lang="ts">
	import Wrap from './Wrap.svelte';
	import InputText from '$components/ui/InputText.svelte';
	import { type FilterHandler } from '..';
	export { Text };
	let {
		value = $bindable(),
		onSubmit,
		oninput,
	}: {
		value: string;
		onSubmit: FilterHandler;
		oninput?: (e:any)=>void;
	} = $props();
</script>

<Wrap submit={onSubmit}><InputText type="text" class={'bg-transparent'} bind:value {oninput}/></Wrap>
