<script lang="ts">
	import { twMerge } from 'tailwind-merge';

	type InputHiddenProps = {
		name?: string;
		value?: string;
		class?: string;
	}

	let { name, value = $bindable(), class: classNames } : InputHiddenProps = $props();

</script>

<input class={twMerge("hidden", classNames)} bind:value={value} name={name} type="hidden">