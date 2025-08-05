<script lang="ts">
    import { fade } from 'svelte/transition';
    import { onMount, type Snippet } from 'svelte';
    import { twMerge } from 'tailwind-merge';
    import type { TFieldStatus } from "$lib/types/TFieldStatus";
    import _ from 'lodash';

    export type TSelectList = {
        name: string,
        value?: string | number,
        isActive?: boolean,
        isHidden?: boolean,
        isDefault?: boolean,
        isError?: boolean
    };

    type SelectProps = {
        children?: Snippet,
        name?: string,
        label?: string,
        value?: string | number,
        list: TSelectList[],
        defaultItem?: TSelectList,
        class?: string,
        status?: TFieldStatus,
        disabled?: boolean,
        typeAdd?: 'category' | 'brand',
    };

    import { ChevronRight, Close } from "$icons";

    let { children, name, label, status, list, defaultItem, class: classNames, disabled, value = $bindable(), typeAdd }: SelectProps = $props();

    let copyList: TSelectList[] = $state(_.cloneDeep(list));
    let isOpenList = $state(false);

    /*
    * New items state
    * */
    let itemsAddList: TSelectList[] = $state([]);
    let isItemAdd = $state(false);
    let inputItemAddValue = $state('');
    let itemAddError = $state('');

    $effect(() => { // Обновляем value при изменении активного списка
        value = selectedItem.value;
    });


    /*
        Value hidden input
    */
    defaultItem = defaultItem ? defaultItem : { name: 'Ничего не выбрано', isDefault: true } as TSelectList;
    let selectedItem: TSelectList = $state(defaultItem);

    /*
    * Устанавливаем default значение если указано value
    * */
    if (value) {
        for (let item of copyList) {
            if (item.value == value) {
                setItem(item);
            } else {
                item.isActive = false;
            }
        }
    }

    /*
        Methods
    */
    function toggleList() {
        isOpenList = !isOpenList;
    }

    function setItem(item: TSelectList): void {
        selectedItem = item;
        copyList.forEach(item => item.isActive = false);
        item.isActive = true;
    }

    /*
    * Start Управление новыми пунктами меню
    * */
    function addNewItem() {
        if (inputItemAddValue) {

            const isExists  = newItemHasExists();

            if (isExists === false) {
                itemsAddList.push({ name: inputItemAddValue });
                inputItemAddValue = '';
                itemAddError = '';
            }
        }
    }

    function newItemHasExists() {
        let hasItem = itemsAddList.filter((item) => {
            return item.name === inputItemAddValue;
        });

        if (!hasItem.length) {
            itemAddError = '';
            return false;
        } else {
            itemAddError = 'Пункт с таким названием уже существует!';
            return true;
        }
    }

    function removeNewItem(key: number) {
        itemsAddList.splice(key, 1);
        newItemHasExists();
    }

    function convertDataToSelectList(data: Array): TSelectList[] {
        const list: TSelectList[] = [];
        data.forEach((item) => {
            list.push({ name: item.name, value: item?.id });
        });

        return list;
    }

    async function saveNewItems() {
        let url;
        switch (typeAdd) {
            case 'category': {
                url = '/main/categories/new';
                break;
            }
            case 'brand': {
                url = '/main/brands/new';
                break;
            }
        }

        if (!url) {
            return false;
        }

        let request = await fetch(url, {
            method: "POST",
            body: JSON.stringify(itemsAddList)
        });
        const data = await request.json();

        if (data?.success) {
            itemsAddList.splice(0, itemsAddList.length);
            isItemAdd = false;
            copyList.splice(0, copyList.length);
            list.splice(0, list.length);

            for (const d of convertDataToSelectList(data.data)) {
                copyList.push(d);
                list.push(d);
            }

            if (defaultItem) {
                selectedItem = defaultItem;
            }
        }
    }

    function inputHandlerNewItem(e: Event) {
        if (e.type === 'keydown' && e.code === 'Enter') {
            addNewItem();
        }
    }

    function editNewItemInputHandler(e: Event) {
        const input = e.currentTarget as HTMLInputElement;

        function removeEditClass() {
            input.parentElement.classList.remove('edit');
        }

        switch (e.type) {
            case 'blur': {
                removeEditClass();
                break;
            }
            case 'keydown': {

                if (e.code === 'Enter') {
                    removeEditClass();
                }

                break;
            }
        }
    }
    /*
    * End Управление новыми пунктами меню
    * */

    function setItemByClick(item: TSelectList): void {
        setItem(item);
        toggleList();
        status = undefined;
    }


    function search(e: Event) {
        const input = e.target as HTMLInputElement;

        if (input.value) {
            copyList.forEach(item => {
                if (item.name) {
                    const index = item.name.indexOf(input.value);

                    if (index === -1) {
                        item.isHidden = true;
                    } else {
                        item.isHidden = false;
                    }
                }

            });
        } else {
            showAllItems();
        }
    }

    function showAllItems() {
        copyList.forEach(item => {
            item.isHidden = false;
        });
    }

    const textClass  = `text-[14px] s:text-[15px] sm:text-[16px] break-all`;

    const itemClass = `group/item select-item cursor-pointer transition-all px-3 py-2 flex items-center gap-2 w-full justify-between text-left
                       sm:py-3 sm:px-4
                       hover:bg-[var(--clr-2)] hover:text-white
                       [.isActive]:bg-[var(--clr-success)] [.isActive]:text-white ` + textClass;

    const itemAddClass = `group/item transition-all px-3 py-2 flex items-center gap-2 w-full justify-between border-b-[1px] border-[#e8e8e8] text-left
                          sm:py-3 sm:px-4
                          hover:bg-[#e8e8e8] ` + textClass;

    onMount(() => { // Закрытие выпадающего списка
        window.addEventListener('click', (e) => {
            const element = e.target as HTMLElement;

            if (!element.closest('.select-list') && !element.classList.contains('select-view') && !element.classList.contains('select-add') && !element.classList.contains('select-back')) {
                isOpenList = false;
            }
        });
    });
</script>

<div class={twMerge("relative group/select text-[var(--clr-text)]", classNames)} class:disabled={disabled} class:error={status?.status === 'error'} class:success={status?.status === 'success'}>
    <input type="hidden" value={value} name={name}>

    {#if label && !status?.message}
        <div class="ui-label">{label}</div>
    {/if}

    {#if status?.message}
        <div class="ui-label">{status?.message}</div>
    {/if}

    <div class="relative flex rounded-[10px] border border-[#D9D9D9] bg-white overflow-hidden
                group-[.disabled]/select:pointer-events-none group-[.disabled]/select:opacity-60 group-[.disabled]/select:select-none
                s:rounded-[18px]
    ">
        <button type="button" class="select-view flex outline-0 py-3 px-3 pr-8 text-[13px] text-left leading-4 w-full transition-all min-w-max cursor-pointer
                    s:py-5 s:px-4 s:pr-10 s:text-[15px]
                    sm:text-[16px]
                    [.isDefault]:text-[#D9D9D9] [.isDefault]:hover:text-[#c2c2c2]
                    group-[.error]/select:bg-[#fff4f4]" class:isDefault={selectedItem.isDefault} onclick={() => { toggleList() }}>

            {#if selectedItem}
                {selectedItem.name}
            {/if}
        </button>

        <div class="absolute top-0 right-0 h-full flex items-center justify-center min-w-[30px] bg-white s:min-w-[40px] group-[.error]/select:bg-[#fff4f4]">
            <div class="transition-all" class:rotate-180={ isOpenList } class:text-[var(--clr-main)]={ isOpenList }>
                <ChevronRight class="rotate-90 w-2 h-2 s:w-3 s:h-3" />
            </div>
        </div>
    </div>

    {#if isOpenList}
        <div class="select-list absolute top-[calc(100%_+_10px)] left-0 bg-[white] shadow-lg w-full rounded-2xl flex flex-col overflow-hidden max-h-[300px] min-w-max overflow-y-auto z-10 group-[.error]/select:bg-[#fff4f4]" transition:fade={{ duration: 200 }}>

            {#if !isItemAdd}
                <div class="w-full">
                    <div class="p-2 sticky top-0 flex flex-col bg-white gap-3 z-10 sm:flex-row">
                        <input class="select-search shadow-lg w-full border-none p-1 px-2 text-[14px] rounded-xl bg-white focus:ring-0 focus:outline-none placeholder:text-[#D9D9D9] s:text-[15px] s:p-2 s:px-3 sm:p-3 sm:text-[16px]" type="text" placeholder="Поиск..." oninput={(e) => search(e)} />

                        {#if typeAdd}
                            <button class="select-add w-full rounded-lg p-1 px-2 bg-[var(--clr-main)] text-white cursor-pointer transition-all text-[14px] hover:bg-[var(--clr-2)] s:text-[15px] s:p-2 sm:max-w-max sm:px-6 sm:text-[16px]" type="button" onclick={() => { isItemAdd = true }}>Создать</button>
                        {/if}
                    </div>

                    <button type="button" class={ itemClass } onclick={() => setItemByClick(defaultItem)}>{ defaultItem.name }</button>

                    {#each copyList as item}
                            {#if !item.isHidden}
                                <button type="button" class={ itemClass } class:isActive={item.isActive} onclick={() => setItemByClick(item)}>
                                    { item.name }
                                </button>
                            {/if}
                    {/each}
                </div>
            {/if}

            {#if isItemAdd}
                <div class={twMerge("w-full", textClass)}>

                    <div class="flex flex-col gap-2 p-2 pb-2 sticky top-0 bg-white shadow-md justify-between s:flex-row sm:p-4">
                        <button type="button" class="select-back flex gap-2 items-center justify-start cursor-pointer transition-all py-2 hover:text-[var(--clr-main)]" onclick={(e) => { e.stopPropagation(); isItemAdd = false }}>
                            <ChevronRight class="rotate-180" />
                            <span>Назад</span>
                        </button>

                        {#if itemsAddList.length}
                            <button class="rounded-lg w-full px-4 py-2 bg-[var(--clr-main)] text-white cursor-pointer transition-all hover:bg-[var(--clr-2)] s:max-w-max" type="button" onclick={saveNewItems}>Сохранить</button>
                        {/if}
                    </div>

                    {#if itemAddError}
                        <div class="flex m-4 mb-2 px-3 py-2 text-sm rounded-md gap-2 border-[#ffb4b8] border-[1px] text-[var(--clr-error)]">
                            { itemAddError }
                        </div>
                    {/if}

                    <div class="group/addTop flex flex-col p-2 gap-2 s:flex-row sm:p-4" class:pt-0={itemAddError} class:addError={itemAddError}>
                        <input class="select-input-add shadow-lg w-full border-none p-2 px-4 rounded-lg bg-white focus:ring-0 focus:outline-none placeholder:text-[#D9D9D9] group-[.addError]/addTop:bg-[#fff9f9]" onkeydown={inputHandlerNewItem} bind:value={ inputItemAddValue } placeholder="Введите название" />
                        <button class="px-4 py-2 w-full bg-[var(--clr-main)] text-white cursor-pointer transition-all rounded-lg hover:bg-[var(--clr-2)] s:max-w-max" type="button" onclick={addNewItem}>Добавить</button>
                    </div>

                    {#if itemsAddList.length}
                        <div class="flex flex-col mt-2">
                            <div class="px-4 mb-2">Список к сохранению:</div>

                            {#each itemsAddList as item, key}
                                <div class={ itemAddClass }>
                                    <button type="button" class="group/addItemName w-full flex" ondblclick={ (e) => { e.currentTarget.classList.add('edit') } }>
                                        <span class="group-[.edit]/addItemName:hidden">{ item.name }</span>
                                        <input class="w-full -ml-[9px] outline-0 border-1 border-[var(--clr-2)] px-2 py-[2px] rounded-md hidden group-[.edit]/addItemName:block" type="text" bind:value={ item.name } onblur={editNewItemInputHandler} onkeydown={editNewItemInputHandler} />
                                    </button>
                                    <button type="button" class="flex items-center transition-all hover:text-[var(--clr-error)] cursor-pointer min-w-max" onclick={(e) => { e.stopPropagation(); removeNewItem(key) }}>Удалить<Close class="p-2 box-content" /></button>
                                </div>
                            {/each}
                        </div>
                    {:else}
                        <div class="px-4 py-2">Добавьте пункты и сохраните</div>
                    {/if}
                </div>
            {/if}
        </div>
    {/if}
</div>