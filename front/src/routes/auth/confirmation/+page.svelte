<script lang="ts">
	import type { ActionData } from './$types';
	import { goto } from "$src/lib/support/request";
	import { onMount } from 'svelte';
	import type { PageServerLoad } from '../../../../.svelte-kit/types/src/routes/main/links/$types';
	import type { User } from '$entities/User';

	import { ChevronRight } from "$icons";

	let { form, data }: { form: ActionData, data: PageServerLoad & { user: User, confirmation_success: boolean } } = $props();

	onMount(() => {
		setTimeout(() => {
			goto('/main');
		}, 3000);
	});

</script>

<svelte:head>
  <title>Подтверждение...</title>
  <meta name="description" content="Подтверждение Email" />
</svelte:head>

{#if data.confirmation_success}
	<div class="flex flex-col items-center justify-center h-full bg-white p-4 rounded-xl text-xl">
		<h1 class="mb-[5px] font-bold">Здравствйуте, {data.user.name}!</h1>
		<div>Ваш аккаунт на <span class="text-[var(--clr-main)]">ParsingData</span> успешно подтверждён!</div>
		<a href="/main" class="flex items-center justify-center mt-2 transition-all text-[var(--clr-2)] hover:text-[var(--clr-main)]">
			<span>На главную</span>
			<ChevronRight />
		</a>
	</div>
{:else}
	<div class="flex flex-col items-center justify-center h-full bg-white p-4 rounded-xl text-xl">
		Что-то пошло не так. Подтверждение аккаунта не удалось
	</div>
{/if}