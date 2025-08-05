<script lang="ts">
    import { themeMod, EThemeMod } from "$store/themeMod";
    import { goto } from "$src/lib/support/request";
    import { page } from "$app/state";

    /*
        Components
    */
    import DropList from "$components/dropList.svelte";

    import { User, Sun, Moon, LogoutDoor, MenuTile, Window } from "$icons";

    /**
     * Images
    */
    import logo from "$lib/images/logo.svg";
    import logoWhite from "$lib/images/logo_white.svg";

    /**
     * Animations
    */
    import { blur } from "svelte/transition";

    /**
     * Theme mod toggle list for DropList component
     * */
    const themeDropList = [
        {
            name: 'Светлая тема',
            icon: Sun,
            onpointerdown: () => { $themeMod = EThemeMod.Light }
        },
        {
            name: 'Тёмная тема',
            icon: Moon,
            onpointerdown: () => { $themeMod = EThemeMod.Dark }
        },
    ];

    /**
     * Theme mod toggle list for DropList component
     * */
    const userDropList = [
        {
            name: 'Редактировать профиль',
            onpointerdown: () => { goto('/main/profile') }
        },
        {
            name: 'Выход',
            icon: LogoutDoor,
            onpointerdown: () => { logout() }
        },
    ];

    /**
     * Logout request
    */
    async function logout() {
        const result = await fetch('/api/v1/logout', {
            method: 'POST'
        });

        const hasOldSession  = (await result.json()).hasOldSession;

        if (result.status === 200) {
            if (!hasOldSession) {
                window.open('/main/products', "_self");
            } else {
                window.open('/main/tasks', "_self");
            }
        }
    }

    let isOpenMobileMenu: boolean = $state(false);
</script>

<header class="relative bg-[var(--clr-el-bg)] px-6 rounded-2xl flex flex-col items-center justify-between gap-4 py-4 sm:flex-row h-[var(--header-height)]
            dark:bg-default">

    <div class="max-w-[135px] cursor-pointer" onpointerdown={() => goto('/main/products')}>
        {#if $themeMod === EThemeMod.Dark}
            <img src={ logoWhite } class="w-full" alt="logoWhite" />
        {:else}
            <img src={ logo } class="w-full" alt="logo" />
        {/if}
    </div>

    <div class="flex w-full gap-4 items-center justify-center sm:justify-end">

        <div class="flex items-center justify-between gap-6">
            <DropList Icon={ Window } list={themeDropList} />
            <DropList Icon={ User } text={page?.data.user?.name} list={ userDropList } />
        </div>

        <span class="min-w-max w-[25px] h-[25px] ml-[10px] text-[var(--clr-main)] md:hidden" onpointerdown={() => isOpenMobileMenu ? isOpenMobileMenu = false : isOpenMobileMenu = true}><MenuTile /></span>

    </div>

    {@render mobileMenu()}

</header>

{#snippet mobileMenu()}
    {#if isOpenMobileMenu}
        <div class="absolute top-[calc(100%_+_var(--gap))] right-0 bg-[var(--clr-el-bg)] p-2 rounded-2xl w-full shadow-xl min-h-[var(--mobile-menu-height)] z-10 md:hidden" transition:blur>
            { isOpenMobileMenu }
        </div>
    {/if}
{/snippet}