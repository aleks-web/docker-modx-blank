<script lang="ts">
    import {getForceSubmitFunc, submitGetForm} from "$lib/support/form.js";
    import {entityOptionLoader} from "$lib/support/db.js";

    import InputWrap from "$components/ui/InputWrap.svelte";
    import LazySelect from "$components/ui/SelectLazy.svelte";
    import Label from "$components/ui/Label.svelte";

    const sendFilter = getForceSubmitFunc('form[name="filter"]');

    let { filter }: { filter: any } = $props();
</script>

<form class="flex flex-col gap-4 dark:text-default md:flex-row" method="POST" name="filter" action="?/filter" onsubmit={ submitGetForm }>
    <InputWrap class="w-full">
        <Label class={'flex gap-2'}>Регион</Label>
        <LazySelect
                name="regions[]"
                load={entityOptionLoader('City')}
                options={[]}
                bind:value={filter.regions}
                placeholder="Выберите регион"
                class="w-full"
                clearable={true}
                allowCustom={false}
                onchange={sendFilter}
        />
    </InputWrap>

    <InputWrap class="w-full">
        <Label class={'flex gap-2'}>Наличие</Label>
        <LazySelect
                name="availability"
                options={[{ name: 'В наличии', value: '1' }, { name: 'Не в наличии', value: '0' }]}
                placeholder="Наличие"
                class="w-full"
                bind:value={filter.availability}
                clearable={true}
                allowCustom={false}
                onchange={sendFilter}
        />
    </InputWrap>
</form>