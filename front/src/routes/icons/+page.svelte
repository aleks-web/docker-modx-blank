<script lang="ts">
	import * as icons from '$icons';
	let Icons: ArrayLike<any> = $state(Object.entries(icons));
</script>

<div class="grid grid-cols-12 w-fit gap-4 p-4">
	{#each Icons as [k, Icon] }
		<button class="cursor-pointer" onclick={async ()=>{
			await navigator.clipboard.writeText(k);
			alert(k);
		}}><Icon class="w-5 h-5 fill-current"/></button>
	{/each}
</div>