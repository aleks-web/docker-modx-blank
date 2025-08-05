<script lang="ts">
	import { Check } from "$icons/dist";

	let {  submit, children, ...rest}: {submit?: (e: MouseEvent)=>void, children?: ()=>any} = $props();
    let form: HTMLFormElement|undefined = $state();
</script>

<form bind:this={form} class="flex relative items-center" {...rest} onsubmit={(e)=>{e.preventDefault(); (form?.querySelector("button") as HTMLButtonElement)?.click()}}>
    {@render children?.()}
    <button type="button" onclick={submit} class="absolute right-2 w-fit px-1 py-1 rounded-full cursor-pointer hover:bg-[var(--clr-main)] hover:text-white"><Check/></button>
</form>
