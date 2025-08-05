<script lang="ts">
    import { twMerge } from 'tailwind-merge';
    import type { TFieldStatus } from "$lib/types/TFieldStatus";

    interface InputTextPropsInterface {
        name?: string;
        placeholder?: string;
        value?: string;
        class?: string;
        status?: TFieldStatus;
    }

    let { placeholder, name, value = $bindable(), status = $bindable(), class: classNames } : InputTextPropsInterface = $props();

    status = { name: name ? name : '', status: 'default' }

    function onInput(e: Event) {
        const element = e.target as HTMLElement;

        try {
            const url = new URL(element.value);

            if (url.origin !== 'null') {
                value = url.origin;
            } else {
                value = '';
            }
        } catch (e) {
            value = '';
        }
    }

    const classes = {
        input: `border border-[#D9D9D9] outline-0 bg-white py-1 px-2 rounded-[14px] text-[14px] w-full
				placeholder:text-[#D9D9D9]
				focus:text-[var(--clr-main)] focus:border-[var(--clr-main)] focus:placeholder:text-[var(--clr-main)] focus:placeholder:opacity-50

				group-[.error]/input:border-[var(--clr-error)] group-[.error]/input:placeholder:text-[var(--clr-error)] group-[.error]/input:placeholder:opacity-50 group-[.error]/input:text-[var(--clr-error)]
				focus:group-[.error]/input:border-[var(--clr-error)] focus:group-[.error]/input:placeholder:text-[var(--clr-error)] focus:group-[.error]/input:text-[var(--clr-error)]

				group-[.success]/input:border-[var(--clr-success)] group-[.success]/input:placeholder:text-[var(--clr-success)] group-[.success]/input:placeholder:opacity-50 group-[.success]/input:text-[var(--clr-success)]
				focus:group-[.success]/input:border-[var(--clr-success)] focus:group-[.success]/input:placeholder:text-[var(--clr-success)] focus:group-[.success]/input:text-[var(--clr-success)]

				s:py-2 s:px-4 s:text-[15px]
				sm:text-[16px] s:rounded-full`
    }
</script>

<div class={twMerge("group/input flex flex-col", classNames)} class:error={status?.status === 'error'} class:success={status?.status === 'success'}>
    {#if status?.message}
        <div class="ui-label">{status?.message}</div>
    {/if}

    <input class={classes.input} placeholder={placeholder} bind:value={value} name={name} type="text" oninput={onInput}>
</div>