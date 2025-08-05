<script lang="ts">
	import type { PageData, ActionData } from './$types';
	import { page } from '$app/state';
	import { enhance } from '$app/forms';
	import { ESettings } from '$enums/ESettings';
	import { pushMessage } from '$store/globals';
	import { EPositions, MessageType } from '$enums/EMessage';
	import Breadcrumbs from '$components/breadcrumb/Breadcrumbs.svelte';
	import LazySelect from '$components/ui/SelectLazy.svelte';
	import Label from '$components/ui/Label.svelte';
	import InputWrap from '$components/ui/InputWrap.svelte';
	import InputText from '$components/ui/InputText.svelte';
	import Toggle from '$components/ui/Toggle.svelte';
	import { Cart } from '$icons';
	import { entityOptionLoader } from '$lib/support/db';
	import { findObjectByProperty } from '$lib/utils.js';
	import { Get_EntityOption_AddHandler } from '$src/lib/support/request';
	import { goto } from '$lib/support/request';
	import SelectPages from '$components/ui/SelectPages.svelte';
	import Pagination from '$components/ui/Pagination.svelte';
	import ProductLinksTable from '$components/tables/ProductLinksTable.svelte';
	import {URLValidator} from "$lib/support/validation/URL";
	let { form, data }: {
		form: ActionData;
		data: PageData;
	} = $props();

	let active = $state(data.product.active);
	let newLinkCity = $state('');
	const validatorLink = URLValidator.new('Ссылка не верна');
	let isBtnSaveLinksActive = $derived.by(() => newLinkCity && newLinkHref && validatorLink(newLinkHref));
	let newLinkHref: string = $state('');
	let newLinkMess = $state({ mess: '', type: '' });

	async function addNewLink() {
		if (newLinkCity && newLinkHref) {
			try {
				new URL(newLinkHref);

				const competitor = data.user.settings.filter((el: any) => {
					if (el.setting === ESettings.Competitor) {
						return el;
					}
				})[0];

				let response = await (
					await fetch('/api/v1/link', {
						body: JSON.stringify({
							product_id: page.params.product_id,
							city_id: newLinkCity,
							competitor_id: competitor.value,
							href: newLinkHref
						}),
						method: 'PUT'
					})
				).json();

				let mess = response.mess.split('|');

				mess = mess.map((el: any) => {
					return el.trim();
				});

				if (mess.includes('new link')) {
					newLinkMess.mess = 'Ссылка успешно создана';
					pushMessage(
						{ message: 'Ссылка успешно создана', type: MessageType.Success },
						EPositions.MiddleCenter,
						3000
					);
					newLinkMess.type = 'success';
				}

				goto(window.location.search, { invalidateAll: true });
			} catch (e) {
				newLinkMess.mess = 'Ссылка не верна';
				newLinkMess.type = 'error';
			}
		} else {
			newLinkMess.mess = 'Для добавления ссылки выберите регион и вставьте ссылку';
			newLinkMess.type = 'error';
		}
	}

	async function del(productId: number) {
		let response = await (
			await fetch('/api/v1/product', {
				body: JSON.stringify({ id: productId }),
				method: 'DELETE'
			})
		).json();

		if (response.success) {
			goto('/main/products');
		}
	}
	let formNode: undefined | HTMLFormElement = $state();
	// $effect(() => {
	// 	console.trace(active, data);
	// });
</script>

<svelte:head>
	<title>{data.product.name || 'Добавление товара'}</title>
</svelte:head>

<!-- Begin Breadcrumbs -->
<Breadcrumbs
	icon={Cart}
	list={[
		{
			name: 'Главная',
			href: '/'
		},
		{
			name: 'Товары',
			href: '/main/products/'
		},
		{
			name: 'Добавление товара'
		}
	]}>{data.product.name || 'Добавление товара'}</Breadcrumbs
>
<!-- End Breadcrumbs -->

<div class="rounded-2xl bg-[var(--clr-el-bg)] dark:bg-default dark:text-default">
	<div class="flex flex-col gap-3 p-3 sm:p-4 md:p-5">
		<h2 class="mb-2 text-2xl font-bold text-[var(--clr-main)] dark:text-default">
			{data.product.id ? 'Редактирование' : 'Добавление'} товара
		</h2>

		<form
			bind:this={formNode}
			method="post"
			name="product_update"
			action="?/product_update"
			class="w-ful"
			use:enhance={() => {
				return async ({ result, update }) => {
					if (result.status === 204) {
						pushMessage(
							{ message: 'Товар успешно сохранён!', type: MessageType.Success },
							EPositions.MiddleCenter,
							3000
						);
					} else if (result.type === 'redirect') {
						goto(result.location, { invalidateAll: true });
						formNode?.setAttribute('action', '?/product_update');
					}
				};
			}}
		>
			<div class="mb-4 flex flex-col gap-2 sm:gap-4 xl:flex-row">
				<InputText
					class="w-full"
					label="Название товара"
					name="product_name"
					placeholder="Введите название товара"
					type="text"
					value={data.product.name}
				/>
				<InputText
					class="w-full"
					label="Артикул товара"
					name="product_article"
					placeholder="Введите артикул товара"
					type="text"
					value={data.product.article}
				/>
			</div>

			<div class="mb-4 flex flex-col gap-2 sm:gap-4 xl:flex-row">
				<InputWrap class="w-full">
					<Label class={'flex gap-2'}>Категория</Label>
					<LazySelect
						name="category"
						load={entityOptionLoader('Category')}
						options={[]}
						placeholder="Выберите категорию"
						class="w-full"
						bind:value={data.product.category_id}
						allowCustom={true}
						onApplyCustom={Get_EntityOption_AddHandler('/api/v1/category/option', false)}
					/>
				</InputWrap>

				<InputWrap class="w-full">
					<Label class={'flex gap-2'}>Бренд</Label>
					<LazySelect
						name="brand"
						load={entityOptionLoader('Brand')}
						options={[]}
						placeholder="Выберите бренд"
						class="w-full"
						bind:value={data.product.brand_id}
						onApplyCustom={Get_EntityOption_AddHandler('/api/v1/brand/option', false)}
						allowCustom={true}
					/>
				</InputWrap>
			</div>

			<Toggle name="active" class="mb-4" bind:checked={active}>Активность</Toggle>

			<div class="flex gap-2">
				<button class="btn w-full" data-name="product_update">Сохранить</button>
				{#if data.product.id}
					<button
						class="cursor-pointer rounded-md bg-[var(--clr-error)] p-2 text-white transition-all hover:bg-[red]"
						type="button"
						data-name="product_delete"
						onclick={() => {
							del(data.product.id);
						}}>Удалить</button
					>
				{/if}
			</div>
		</form>
	</div>
</div>

<div class="rounded-2xl bg-[var(--clr-el-bg)] dark:bg-default dark:text-default">
	<div class="flex flex-col gap-3 p-3 sm:p-4 md:p-5">
		<h2 class="mb-2 text-2xl font-bold text-[var(--clr-main)] dark:text-default">
			Ссылка на сайт
		</h2>

		{#if data.product.id}
			<!-- Start New Link Form -->
			<div class="cursor-auto text-[var(--clr-text)]">
					<div class="">
						<div class="flex gap-4">
							<InputWrap>
								<Label class={'flex gap-2'}>Сайт</Label>
								<LazySelect
									name="competitor"
									load={entityOptionLoader('Competitor')}
									options={[]}
									placeholder="Выберите сайт"
									class="w-full"
									value={data.competitorId || ''}
									allowCustom={false}
									disabled
								/>
							</InputWrap>

							<InputWrap>
								<Label class={'flex gap-2'}>Регион</Label>
								<LazySelect
									name="region"
									load={entityOptionLoader('City')}
									options={[]}
									placeholder="Выберите регион"
									class="w-full"
									bind:value={newLinkCity}
									allowCustom={false}
								/>
							</InputWrap>

							<InputWrap class="w-full">
								<Label class={'flex gap-2'}>Вставьте ссылку</Label>
								<InputText name="link" bind:value={newLinkHref} placeholder="Вставьте ссылку" class="w-full" />
							</InputWrap>
						</div>

						{#if newLinkMess}
							<div
								class="mt-2 text-lg"
								class:text-red-400={newLinkMess.type === 'error'}
								class:text-green-500={newLinkMess.type === 'success'}
							>
								{newLinkMess.mess}
							</div>
						{/if}

						<div class="flex justify-between">
							<button
								type="button"
								class="btn mt-3 flex w-full items-center justify-center lg:w-[auto] [.pointer-events-none]:opacity-50"
								class:pointer-events-none={!isBtnSaveLinksActive}
								onclick={addNewLink}>Сохранить</button
							>
						</div>
					</div>
				</div>
			<!-- End New Link Form -->
		{/if}
	</div>
</div>

<div class="rounded-2xl bg-[var(--clr-el-bg)] dark:bg-default dark:text-default">
	<div class="flex flex-col gap-3 p-3 sm:p-4 md:p-5">
		<h2 class="mb-2 text-2xl font-bold text-[var(--clr-main)] dark:text-default">
			Список ссылок
		</h2>
		{#if data.product.id}
			{#if data.product.links.length}
                <ProductLinksTable
                        product={data.product}
                        competitorId={findObjectByProperty(data.user.settings, 'setting', ESettings.Competitor)
						?.value}
                />
			{:else}
                <div class="mt-3 text-center text-2xl text-[var(--clr-2)]">Ссылок не обнаружено</div>
			{/if}
		{/if}
	</div>
</div>
{#if data.product.id}
	<div class="s:flex-row flex flex-col items-center gap-2 sm:gap-3 lg:gap-4">
		<SelectPages class="s:max-w-max w-full text-center" pagination={data.pagination} />
		<Pagination pagination={data.pagination} />
	</div>
{/if}
