<script lang="ts">
	import { enhance } from '$app/forms';
	import type { ActionData } from './$types';
	import { goto } from "$src/lib/support/request";

	/*
        For Inputs
    */
    import type { TFieldStatus } from '$lib/types/TFieldStatus';
    import { findObjectByProperty } from "$lib/utils";


	/**
	 * Components
	*/
	import InputText from "$components/ui/InputText.svelte"

	/**
	 * Icons and images
	*/
	import { ArrowRight } from '$icons';
	import octopus from "$lib/images/octopus.png";

	let { form }: { form: ActionData & { errors: TFieldStatus[] } } = $props();

	let btn = `group p-2 flex flex-wrap rounded-full bg-[var(--clr-2)] font-bold text-white text-[10px] uppercase flex items-center justify-center gap-2 hover:bg-[var(--clr-main)] cursor-pointer transition-all
				dark:text-default dark:bg-[var(--clr-main)] dark:hover:bg-[var(--clr-2)]

				s:text-[14px] s:flex-row
				sm:text-[16px]
				md:text-[18px]
				lg:text-[20px]
	           `;
	let btnSvg = `w-[15px] min-w-[15px] transition-transform group-hover:translate-x-1
				  s:w-[18px] s:min-w-[18px]
				  lg:w-[20px] lg:min-w-[20px]
				 `;

	let h1 = `flex items-center overflow-hidden relative max-w-max italic font-bold uppercase rounded-[20px] leading-10 text-[18px] px-4 py-1 s:text-[22px] sm:text-[30px] sm:py-2 sm:px-4 md:text-[40px] md:px-6 md:py-3 lg:text-[45px] lg:px-7 lg:py-4`;
	let h1Blue = `bg-[var(--clr-main)] text-gray-50 ` + h1;
	let h1White = `bg-white text-gray-500 dark:bg-default dark:text-default ` + h1;

	// $page.url.searchParams.get('page')
</script>

<svelte:head>
	<title>Вход</title>
	<meta name="description" content="Вход в систему" />
</svelte:head>

<div class="flex flex-col justify-center items-center gap-4">

	<div class="relative">
		<img src={octopus} class="absolute -top-[2px] -right-[18%] z-10 w-[130px] sm:-top-[99%] sm:-right-[10%] sm:w-[145px] md:w-auto md:-top-[123%] lg:-top-[110%] lg:-right-[9.5%]" alt="octopus" />

		<h1 class="flex flex-col sm:flex-row">
			<span class={h1White}>Войдите</span>
			<span class={h1Blue}><span class="relative z-30">в ваш аккаунт</span><span class="block w-[88%] h-[99%] bg-[var(--clr-main)] absolute left-0 bottom-0 z-20"></span></span>
		</h1>
	</div>

</div>

<form method="post" action='?/login' class="flex flex-col gap-3 max-w-[675px] w-full bg-white rounded-[15px] p-3 s:gap-4 s:p-4 s:rounded-[20px] sm:rounded-[25px] sm:p-6 dark:bg-default" use:enhance>
	<InputText placeholder="Ваш Email" label="Введите вашу почту" name="email" type="text" value="dok.go@yandex.ru" status={findObjectByProperty(form?.errors, 'name', 'email')} />
	<InputText placeholder="Ваш пароль" label="Введите пароль" name="password" type="password" value="amatorGo43go" status={findObjectByProperty(form?.errors, 'name', 'password')} />

	<div class="flex flex-col gap-2 mt-2 text-white">
		<button class={btn}>
			<span class="relative top-[1px]">Войти</span>
			<div class={btnSvg}><ArrowRight /></div>
		</button>
		<button type="button" onpointerdown={() => goto('/auth/register')} class="text-[var(--clr-2)] text-[14px] max-w-min m-auto cursor-pointer transition-all hover:text-blue-500 mt-4 s:text-[16px]">Регистрация</button>
	</div>
</form>