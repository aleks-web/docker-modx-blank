<script lang="ts">
    import { twMerge } from "tailwind-merge";
	import { formatPrice } from "$src/lib/support/string";
	import Toggle from "$components/ui/Toggle.svelte";
	import Edit from "$icons/dist/Edit.svelte";
	import Close from "$icons/dist/Close.svelte";
	import ChevronRight from "$icons/dist/ChevronRight.svelte";
    import Modal from "$components/Modal.svelte";
    import AddLinkForm from "$components/forms/AddLinkForm.svelte";
	import { loading } from "$store/globals";
	import { goto } from "$src/lib/support/request";
	import type { Product } from "$entities/Product";
    let {product, editPagePath, competitorId, class:className, onLinkDeleteAfter}: {product:Product, editPagePath:string, competitorId: string|number, class?:string|string[], }&any = $props();


    let showAddLinkForm = $state(false);
    let addLinkForm = $state({
        competitor_id: competitorId,
        city_id: "",
        product_id: "",
        link_id: "",
        href: "",
        host: "",
    });

    const _showAddLinkForm = (competitor_id: any, product_id: any, link?: any) => {
        addLinkForm.competitor_id = competitor_id;
        addLinkForm.city_id = link.city_id;
        addLinkForm.product_id = product_id;
        if(link) {
            addLinkForm.link_id = link.id;
            addLinkForm.href = link.href;
        }
        showAddLinkForm = true;
    }

    /**
     * Link delete method
    * */
    async function linkDelete(e: Event, link_id: string|number, product_id: string|number) {
        loading.set(true);

        let response = await (await fetch("/api/v1/link", {
            body: JSON.stringify({
                link_id: link_id,
                product_id: product_id
            }),
            method: "DELETE",
        })).json();

        loading.set(false);

        if (response === 'success') {
            goto(window.location.search, { invalidateAll: true });
        }

        onLinkDeleteAfter?.(e, link_id, product_id);
    }
</script>

<div class="group/tableLinksWrapper table-links-wrapper relative max-h-[600px] overflow-y-auto">
    <table class="w-full bg-slate-50 group-[.loading]/tableLinksWrapper:opacity-30">
        <thead class="sticky top-0 bg-white z-10 shadow-sm dark:bg-default">
            <tr class="h-[40px]">
                <th class="text-left w-[200px] pl-6">Сайт</th>
                <th class="text-left pl-2">Город</th>
                <th class="text-left min-w-max">Ссылка</th>
                <th class="text-center">Цена</th>
                <th class="text-center">Старая цена</th>
                <th class="text-center">Наличие</th>
                <th class="text-center w-[170px]">Активность</th>
                <th class="w-[100px]"></th>
            </tr>
        </thead>

        <tbody>
            {#each product?.links as link}
                <!-- <LinkRow link={link} productId={product.id} competitorId={Number(competitorId)} onLinkDeleteAfter={(e) => { rowToggle(e, product) }} /> -->


                <tr class={twMerge("group/linkRow link-row h-[55px] border-b-1 border-b-[#D9D9D9] transition-all rounded-2xl overflow-hidden last:border-b-0 bg-[var(--clr-el-bg)] dark:bg-default hover:dark:bg-[#3b5975] hover:bg-slate-50", className)}>
                    <td class="text-left pl-2">
                        {link.competitor_name}
                    </td>
                    <td class="text-left pl-2">{ link.city_address }</td>
                    <td class="text-left pl-2">
                        <a href={ link.href } target="_blank" class="transition-colors hover:text-[var(--clr-2)]">{ link.href }</a>
                    </td>
                    <td class="text-center">{ formatPrice(link.price) }</td>
                    <td class="text-center">{ formatPrice(link.old_price) }</td>
                    
                    <td class="text-center">
                        {#if link.availability}
                            <i class="inline-block aspect-square w-[10px] rounded-full bg-lime-600"></i>
                        {:else}
                            <i class="inline-block aspect-square w-[10px] rounded-full bg-red-400"></i>
                        {/if}
                    </td>
                    
                    <td class="text-center">
                        <Toggle checked={ false } name="active" />
                    </td>
                    <td class="text-right pr-2">

                        <div class="flex justify-end gap-1">
                            <button type="button">
                                <Edit size="lg" class="cursor-pointer transition-all hover:text-[var(--clr-2)]" onclick={() => { _showAddLinkForm(competitorId, product.id, link); }} />
                            </button>

                            <button type="button" onclick={async (e) => { await linkDelete(e, link.id, product.id) }}>
                                <Close class="text-[var(--clr-error)] opacity-70 p-2 box-content cursor-pointer hover:opacity-100 transition-all ml-auto" />
                            </button>
                        </div>

                    </td>
                </tr>
            {/each}
        </tbody>
    </table>
</div>
{#if editPagePath}
<div class="flex justify-start items-center gap-4 px-6 py-3 border-t-1 border-[#D9D9D9] shadow-md">
    <a href={editPagePath + product.id}
        class="group/linksMore flex items-center gap-1 transition-all border-1 border-[#ccc] rounded-md px-2 py-1 min-w-max hover:text-[var(--clr-2)] hover:border-[var(--clr-2)]">
        <span>Все ссылки</span>
        <ChevronRight size="sm" class="group-hover/linksMore:translate-x-[1px] transition-transform" />

    </a>
</div>
{/if}
<Modal bind:isOpen={showAddLinkForm}>
    <AddLinkForm {...addLinkForm} onsave={() => { showAddLinkForm = false; }} />
</Modal>