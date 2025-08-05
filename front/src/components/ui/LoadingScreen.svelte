<script lang="ts">
    import { loading } from "$store/globals";
	import DoubleDotsSpinner from "$icons/dist/DoubleDotsSpinner.svelte";
    import Portal from 'svelte-portal';
</script>

{#if loading.get()}
<Portal>
    <div class="loading-plate bg-gray-400/[.25] fixed left-0 top-0 w-screen h-screen z-100 flex justify-center items-center text-5xl text-[var(--clr-main)] flex-col gap-5 select-none">
        <DoubleDotsSpinner class="w-32 fill-current"/>
        Загрузка
    </div>
</Portal>
{/if}