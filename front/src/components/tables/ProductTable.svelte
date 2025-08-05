<script lang="ts">
    import {goto} from "$app/navigation";
    import {page} from "$app/stores";
    import { loading } from "$store/globals";
    import type { TPagination } from "$lib/types/TPagination";
    import { productToggleActiveAction} from "$lib/support/request";

    /**
     * Components
     * */
    import Toggle from "$components/ui/Toggle.svelte";
    import RoundBtn from "$components/ui/RoundBtn.svelte";

    /**
     * Entities
     * */
    import type { Product } from '$entities/Product';
    import type { Link } from '$entities/Link';

    /**
     * Icons
     */
    import { Barcode, Plus, Close, Edit, ChevronRight } from '$icons';

    /**
     * Helpers
     * */
    import { formatPrice } from "$lib/support/string";
    import {findObjectByProperty} from "$lib/utils";
    import {ESettings} from "$enums/ESettings";
	import ProductLinksTable from "$components/tables/ProductLinksTable.svelte";

    /*
    * New Types
    * */
    export type ProductsTableExtendedType = Product & {
        category_name: string;
        brand_name: string;
        min_price_site: number;
        max_price_site: number;
        links: Link[];
        links_pagination: TPagination
    };

    let { products = $bindable(), urlPrefixProductEdit = '/main/products/edit/', pageType = "products", competitorId = findObjectByProperty($page.data.user.settings, 'setting', ESettings.Competitor)?.value }: {
        products: ProductsTableExtendedType[],
        pageType?: "products" | "competitors" | "categories" | "brands",
        competitorId?: string | number,
        urlPrefixProductEdit?: string
    } = $props();

    products = products as ProductsTableExtendedType[];

    const lastProduct = $derived.by(() => { return products[products.length - 1] });
    const isOurPrice = $derived.by(() => { return products[0]?.min_price_site });


    /**
     * Product delete method
     * @param e
     * @param productId
     */
    async function productDelete(e: Event, productId: number) {
        loading.set(true);

        let response = await (await fetch("/api/v1/product", {
            body: JSON.stringify({ id: productId }),
            method: "DELETE",
        })).json();

        if (response.success) {
            goto(window.location.search, { invalidateAll: true });
        }
    }

    /**
     * @param product
     */
    async function toggleActive(product: Product): Promise<boolean> {
        const result = await productToggleActiveAction(product);

        if (result.type === 'success') {
            return !product.active;
        }

        return product.active;
    }

    /**
     * @param e
     * @param product
     */
    function rowToggle(e: PointerEvent, product: Product) {
        let element = e.target as HTMLElement;
        let trsLink = document.querySelector(`.tr-link[data-id="${product.id}"]`) as HTMLElement;
        let mainTr = document.querySelector(`.tr-product[data-id="${product.id}"]`) as HTMLElement;

        function close() {
            trsLink?.classList.add('hidden');
            mainTr?.classList.remove('opened');
        }

        function open() {
            trsLink?.classList.remove('hidden');
            mainTr?.classList.add('opened');
        }

        if (!product?.links?.length) {
            close();
            return;
        }

        if (element.closest('.noclick')) {
            return;
        }

        trsLink?.classList.contains('hidden') ? open() : close();
    }
</script>

<!-- Start Products Table -->
<div class="bg-[var(--clr-el-bg)] dark:bg-default dark:text-default rounded-2xl overflow-x-hidden">
    {#if products?.length}
        <table class="main-product-table w-full">
            <thead class="h-[60px] bg-white dark:bg-default">
                <tr>
                    <th class="text-left w-[240px] pl-11">Название</th>
                    <th class="text-left w-[120px]">Категория</th>
                    <th class="text-left w-[120px]">Бренд/производитель</th>
                    <th class="text-center w-[200px]" class:hidden={!isOurPrice}>{ pageType === 'products' ? 'Наша цена' : 'Цена конкурента'}</th>
                    <th class="text-center w-[105px]">Активность</th>
                    <th class="text-right w-[35px]"></th>
                </tr>
            </thead>

            <tbody>
                {#each products as product}
                    {@render productSnippet(product)}
                {/each}
            </tbody>
        </table>
    {:else}
        <div class="bg-[var(--clr-el-bg)] rounded-2xl dark:bg-default dark:text-default">
            <div class="my-2 text-md text-center s:text-lg sm:text-xl xl:text-2xl xl:my-6">
                <div class="font-bold text-[var(--clr-2)]">Товары отсутствуют</div>
                <RoundBtn class="m-auto mt-3 w-full justify-center items-center sm:w-auto" icon={Plus} onclick={() => goto('/main/products/edit')}>Создать</RoundBtn>
            </div>
        </div>
    {/if}
</div>
<!-- End Products Table -->

{#snippet productSnippet(product: ProductsTableExtendedType)}
    <tr class="group/productTr peer tr-product h-[80px] border-b-1 border-b-[#D9D9D9] last:border-b-0 transition-all rounded-2xl overflow-hidden
                dark:border-b-[#4a6176]
               hover:bg-slate-50
               hover:dark:bg-[#3b5975]
                [.opened]:bg-slate-100
                dark:[.opened]:bg-slate-600"
        class:cursor-pointer={product.links.length}
        class:border-b-transparent={lastProduct.id === product.id}
        data-id={product.id}
        onclick={(e) => { rowToggle(e, product) }}>

        <td class="pl-3">
            <div class="flex items-center gap-4">

                <div class="flex items-start justify-start h-full group-[.opened]/productTr:text-[var(--clr-2)]" class:opacity-20={!product.links.length}>
                    <ChevronRight class="group-[.opened]/productTr:rotate-90 transition-transform" />
                </div>

                <div class="flex flex-col max-w-max">
                    <div class="flex gap-1 items-center">
                        <a href={urlPrefixProductEdit + product.id} class="text-[var(--clr-main)] transition-all hover:text-sky-300 dark:text-default max-w-max">
                            { product.name }
                        </a>
                    </div>

                    <span class="flex items-center gap-1">
                        <Barcode />
                        <span class="text-[13px] font-bold mt-[1px] noclick">{ product.article ? product.article : '-'}</span>
                    </span>
                </div>
            </div>
        </td>

        <td class="text-left"><span class="noclick">{product.category_name ? product.category_name : '-'}</span></td>
        <td class="text-left"><span class="noclick">{product.brand_name ? product.brand_name : '-'}</span></td>

        <td class="text-center" class:hidden={!isOurPrice}><span class="noclick">{formatPrice(product.min_price_site)} / {formatPrice(product.max_price_site)}</span></td>

        <td class="text-left cursor-auto noclick">
            <div class="flex gap-2 justify-center">
                <Toggle bind:checked={ product.active } onclick={async () => { return await toggleActive(product); } } name="active" />
            </div>
        </td>

        <td class="noclick text-right pr-6 cursor-auto">
            <div class="flex gap-2 justify-end items-center">
                <Edit size="lg" class="cursor-pointer transition-all hover:text-[var(--clr-2)]" onclick={() => { goto('/main/products/edit/' + product.id); }} />

                <button type="button" onclick={async (e) => { await productDelete(e, product.id) }}>
                    <Close class="text-[var(--clr-error)] opacity-70 p-2 box-content cursor-pointer hover:opacity-100 transition-all ml-auto" />
                </button>
            </div>
        </td>
    </tr>


    <tr class="tr-link h-[50px] border-b-1 border-b-[#D9D9D9] hidden" data-id={product.id}>
        <td colspan="8">
            <ProductLinksTable product={product} {competitorId} editPagePath={urlPrefixProductEdit}/>
        </td>
    </tr>
{/snippet}

<style>
    :global(.main-product-table .link-row td:first-child) {
        padding-left: 25px;
    }

    :global(.main-product-table .link-row td:last-child) {
        padding-right: 25px;
    }
</style>