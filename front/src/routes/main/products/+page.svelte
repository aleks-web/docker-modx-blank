<script lang="ts">
    /**
     * Main
    */
    import type { PageData, ActionData } from './$types';

    import type { TPagination } from '$lib/types/TPagination';
    import { goto } from "$src/lib/support/request";

    /**
    * Components
    * */
    import Breadcrumbs from "$components/breadcrumb/Breadcrumbs.svelte";
    import RoundBtn from "$components/ui/RoundBtn.svelte";
    import Pagination from "$components/ui/Pagination.svelte";
    import SelectPages from '$components/ui/SelectPages.svelte';
    import ProductTable from "$components/tables/ProductTable.svelte";
    import MainProductFilter from "$components/filteres/MainProductFilter.svelte";


    /**
    * Entities
    * */
    import type { Product } from '$entities/Product';
    import type { Link } from '$entities/Link';
    import type { Setting } from '$entities/Setting';

    /**
    * Icons
    */
    import { Plus, Cart} from '$icons';

    let { form, data }: {
        form: ActionData &
          { searchResult: Product[], searchText: string},
        data: PageData &
          { products: Product[], links: Link[], pagination: TPagination, settings: Setting[] }
    } = $props();
</script>

<svelte:head>
	<title>Товары</title>
</svelte:head>

<!-- Begin Breadcrumbs -->
<Breadcrumbs icon={ Cart } list={
    [
        {
            name: 'Главная',
            href: '/'
        },
        {
            name: 'Товары'
        }
    ]
}>Товары</Breadcrumbs>
<!-- End Breadcrumbs -->

<RoundBtn class="w-full min-w-max max-w-max justify-center sm:w-auto" icon={ Plus } onclick={() => goto('/main/products/edit')}>Создать товар</RoundBtn>

<!-- Start Products Filter -->
<MainProductFilter filter={data.filter} bind:products={data.products} />
<!-- End Products Filter -->

<!-- Start Products Table -->
<ProductTable products={data.products} />
<!-- End Products Table -->

<div class="flex flex-col items-center gap-2 s:flex-row sm:gap-3 lg:gap-4">
    <SelectPages class="w-full text-center s:max-w-max" pagination={ data.pagination } />
    <Pagination pagination={ data.pagination } />
</div>