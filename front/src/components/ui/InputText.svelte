<script lang="ts">
	import type { Component } from 'svelte';
	import type { TFieldStatus } from "$lib/types/TFieldStatus";
	import { twMerge } from 'tailwind-merge';

	import { Eye, EyeSlash } from "$icons";

	interface InputTextPropsInterface {
		type?: 'number' | 'password' | 'text';
		name?: string;
		placeholder?: string;
		value?: string;
		label?: string;
		class?: string;
		status?: TFieldStatus;
		onchange?: any;
		oninput?: any;
	}

	let { placeholder, label, name, type = 'text', value = $bindable(), status, class: classNames, onchange, oninput} : InputTextPropsInterface = $props();

	const classes = {
		label: `ui-label`,
		message: "py-1 px-2 text-[#6F6F6F] text-[10px] s:text-[11px] sm:text-[12px] md:text-[13px] lg:text-[14px] leading-[13px] italic group-[.error]/input:text-[var(--clr-error)] group-[.success]/input:text-[var(--clr-success)] dark:text-default",
		input: `border border-[#D9D9D9] outline-0 bg-transparent py-1 px-2 rounded-[14px] text-[14px] w-full
				placeholder:text-[#D9D9D9]
				focus:text-[var(--clr-main)] focus:border-[var(--clr-main)] focus:placeholder:text-[var(--clr-main)] focus:placeholder:opacity-50

				group-[.error]/input:border-[var(--clr-error)] group-[.error]/input:placeholder:text-[var(--clr-error)] group-[.error]/input:placeholder:opacity-50 group-[.error]/input:text-[var(--clr-error)]
				focus:group-[.error]/input:border-[var(--clr-error)] focus:group-[.error]/input:placeholder:text-[var(--clr-error)] focus:group-[.error]/input:text-[var(--clr-error)]

				group-[.success]/input:border-[var(--clr-success)] group-[.success]/input:placeholder:text-[var(--clr-success)] group-[.success]/input:placeholder:opacity-50 group-[.success]/input:text-[var(--clr-success)]
				focus:group-[.success]/input:border-[var(--clr-success)] focus:group-[.success]/input:placeholder:text-[var(--clr-success)] focus:group-[.success]/input:text-[var(--clr-success)]

				dark:text-default dark:placeholder:opacity-50 dark:focus:placeholder:text-white dark:focus:border-(--clr-2)

				s:py-2 s:px-4 s:text-[15px]
				sm:text-[16px] s:rounded-full`
	}

	function setDefaultStatus() {
		if (status) {
			status.status = 'default'
		}
	}

	let isPasswordHidden = $state(type === 'password' ? false : false);
	function togglePassword() {
		isPasswordHidden = !isPasswordHidden;
	}
</script>

<div class={twMerge("group/input flex flex-col error", classNames)} class:error={status?.status === 'error'} class:success={status?.status === 'success'}>
	{#if label || status?.message}
		<div class="flex flex-col mb-1">
			{#if label}
				<span class={classes.label}>{label}</span>
			{/if}
			{#if status?.message}
				<div class={classes.message}>{status?.message}</div>
			{/if}
		</div>
	{/if}

	<div class="relative w-full">
		<input class={classes.input} autocomplete={"off"} placeholder={placeholder} bind:value={value} name={name} type={isPasswordHidden ? 'password' : 'text'} onfocusout={setDefaultStatus} onchange={onchange?onchange:()=>{}} oninput={oninput?oninput:()=>{}}>

		{#if type === 'password'}

			<button type="button" onclick={togglePassword} class="absolute top-0 right-[5px] p-2 h-full flex items-center justify-center cursor-pointer transition-all hover:text-[var(--clr-main)]">
				{#if isPasswordHidden}
					{@render icon(Eye)}
				{:else}
					{@render icon(EyeSlash)}
				{/if}
			</button>

		{/if}
	</div>
</div>

{#snippet icon(Icon: Component)}
	<Icon />
{/snippet}