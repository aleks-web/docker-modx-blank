<script lang="ts">
    /**
     * Components
     * */
    import LazySelect from "$components/ui/SelectLazy.svelte";
    import Label from "$components/ui/Label.svelte";
    import Search from "$components/ui/Search.svelte";
    import InputWrap from "$components/ui/InputWrap.svelte";

    /**
    * Entities
    * */
    import type { Product } from "$entities/Product";

    /**
     * Helpers
     * */
    import {getForceSubmitFunc, submitGetForm} from "$lib/support/form";
    import {entityOptionLoader} from "$lib/support/db";
	import InputText from "$components/ui/InputText.svelte";

    const sendFilter = getForceSubmitFunc('form[name="filter"]');

    let { filter, products = $bindable() }: { filter: any, products?: Product[] } = $props();

    let hasProducts = $derived.by(() => { if (products && products.length > 0) { return true } return false; });
    let productsOptions = $derived.by(() => {
        if (products && products.length) {
            return products?.map(el => {
                return {
                    name: el.name,
                    value: ""+el.id
                }
            });
        } else {
            return [];
        }
    });
</script>

<div class="bg-[var(--clr-el-bg)] rounded-2xl dark:bg-default dark:text-default">
    <form class="flex flex-col gap-3 p-3 sm:p-4 xl:p-6" method="POST" name="filter" action="?/filter" onsubmit={ submitGetForm }>
        <h1 class="font-bold text-2xl">Фильтры:</h1>
        <div class="w-fit flex flex-col items-center justify-between gap-2 sm:gap-4 sm:flex-row">
            <InputWrap class="w-full">
                <Label class={'flex gap-2'}>название товара</Label>
                <InputText
                    name="search"
                    placeholder="Введите название товара"
                    class="w-fit"
                    bind:value={filter.search}
                    onchange={sendFilter}
                />
            </InputWrap>

            <InputWrap class="w-full">
                <Label class={'flex gap-2'}>Категория</Label>
                <LazySelect
                    name="categories[]"
                    load={entityOptionLoader('Category')}
                    options={[]}
                    placeholder="Выберите категорию"
                    class="w-fit"
                    bind:value={filter.categories}
                    clearable={true}
                    allowCustom={false}
                    onchange={sendFilter}
                />
            </InputWrap>

            <InputWrap class="w-full">
                <Label class={'flex gap-2'}>Бренд</Label>
                <LazySelect
                    name="brands[]"
                    load={entityOptionLoader('Brand')}
                    options={[]}
                    placeholder="Выберите бренд"
                    class="w-fit"
                    bind:value={filter.brands}
                    clearable={true}
                    allowCustom={false}
                    onchange={sendFilter}
                />
            </InputWrap>

            <InputWrap class="w-full">
                <Label class={'flex gap-2'}>Активность</Label>
                <LazySelect
                    name="active"
                    options={[{ name: 'Активные', value: '1' }, { name: 'Не активные', value: '0' }]}
                    placeholder="Выберите значение"
                    class="w-fit"
                    value={filter.active}
                    clearable={true}
                    allowCustom={false}
                    onchange={sendFilter}
                />
            </InputWrap>

            <InputWrap>
                <Label>Товары</Label>
                <LazySelect
                    load={entityOptionLoader('Product')}
                    options={productsOptions}
                    placeholder="Выберите товары"
                    class="w-fit"
                    bind:value={filter.items}
                    name="items[]"
                    allowCustom={false}
                    clearable={true}
                    onchange={sendFilter}
                />
            </InputWrap>

            <InputWrap class="w-full">
                <Label class={'flex gap-2'}>Регион</Label>
                <LazySelect
                    name="regions[]"
                    load={entityOptionLoader('City')}
                    options={[]}
                    placeholder="Выберите регион"
                    class="w-fit"
                    bind:value={filter.regions}
                    clearable={true}
                    allowCustom={false}
                    onchange={sendFilter}
                />
            </InputWrap>
        </div>
    </form>
</div>