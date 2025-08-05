<script lang="ts">
	import InputText from '$components/ui/InputText.svelte';
	import InputWrap from '$components/ui/InputWrap.svelte';
	import Label from '$components/ui/Label.svelte';
	import { goto } from '$src/lib/support/request';
	import { loading } from '$store/globals';

	type EntityId = undefined | null | number | string;
	let {
		product_id,
		city_id,
		competitor_id,
		link_id,
		href,
		onsave,
		...props
	}: {
		product_id?: EntityId;
		city_id?: EntityId;
		competitor_id?: EntityId;
		host?: string;
		link_id?: EntityId;
		href?: string;
		onsave?: (result: any) => any;
	} = $props();
	let formNode: undefined | null | HTMLFormElement = $state();
	let isSuccess = $state(false);
</script>

<form action="" bind:this={formNode}>
	<input type="hidden" name="competitor_id" value={competitor_id} />
	<input type="hidden" name="city_id" value={city_id} />
	<input type="hidden" name="product_id" value={product_id} />
	<input type="hidden" name="link_id" value={link_id} />

	<div class="flex items-end gap-3">
		<InputWrap>
			<Label>Ссылка</Label>
			<InputText type="text" name="href" bind:value={href} />
			
		</InputWrap>
		<button
			class="btn !rounded-full"
			type="button"
			onclick={async () => {
				if (formNode) {
					loading.set(true);
					const result = await (
						await fetch('/api/v1/link', {
							method: 'PUT',
							body: JSON.stringify({
								product_id,
								city_id,
								competitor_id,
								link_id,
								href
							})
						})
					).json();
					isSuccess = true;
					if (onsave) { onsave(result); }
					goto(window.location.search, {invalidateAll: true});
				}
			}}>Cохранить</button
		>
	</div>
	{#if isSuccess}<div class="text-center mt-3 text-green-600">Ссылка успешно сохранена</div>{/if}
</form>
