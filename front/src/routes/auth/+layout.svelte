<script lang="ts">
	let { children } = $props();

    /*
        Icons
    */
    import { WhatsApp, Phone, Email, Moon, Sun, Window } from "$icons";


    /*
        Images
    */
    import logo from "$lib/images/logo.svg";
    import logoWhite from "$lib/images/logo_white.svg";

    /*
        ThemeMod
    */
    import { themeMod, EThemeMod } from "$store/themeMod";

    let themeBtn = " flex items-center gap-2 cursor-pointer text-sm font-bold transition-all sm:text-lg hover:opacity-[0.8] dark:text-[#B8C0CC] [.active]:text-[var(--clr-main)] ";
    let themeBtnWidth = " max-w-[18px] sm:max-w-[24px] ";

    /*
        Env variables
    */
    import { PUBLIC_PHONE, PUBLIC_EMAIL, PUBLIC_WHATSAPP } from '$env/static/public';

    function setStandartTheme(e: PointerEvent) {
        const isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;

        if (isDarkMode) {
            $themeMod = EThemeMod.Dark;
        } else {
            $themeMod = EThemeMod.Light;
        }
    }

</script>

<div class="h-[100svh] w-full dark:bg-[var(--clr-bg-dark)]">

    <div class="flex gap-[20px] items-center justify-between mx-auto px-[15px] h-[50px] lg:h-[80px] xl:h-[90px] fixed w-full top-0 left-0">
        {#if $themeMod === EThemeMod.Dark}
            <img src={ logoWhite } alt="logo" class="max-w-[200px] m-auto lg:max-w-[300px] xl:max-w-[350px]" />
        {:else}
            <img src={ logo } alt="logo" class="max-w-[200px] m-auto lg:max-w-[300px] xl:max-w-[350px]" />
        {/if}

        <div class="hidden w-full items-center justify-end gap-3 s:flex sm:gap-6 md:gap-4 lg:gap-8">
            <a href="tel:{ PUBLIC_PHONE.replace(/[-() /\\]/g, '') }" class="flex gap-2 items-center justify-center leading-[normal] text-[var(--clr-text)] dark:text-default hover:text-[var(--clr-2)]! transition-colors">
                <span class="min-w-[18px] w-[18px] sm:w-[22px]"><Phone /></span>
                <span class="hidden text-[13px] md:flex lg:text-[15px] xl:text-[18px]">{ PUBLIC_PHONE }</span>
            </a>
            <a href="https://wa.me/{ PUBLIC_WHATSAPP.replace(/[-() /\\]/g, '') }" class="flex gap-2 items-center justify-center leading-[normal] text-[var(--clr-text)] dark:text-default hover:text-[var(--clr-2)]! transition-colors">
                <span class="min-w-[18px] w-[18px] sm:w-[22px]"><WhatsApp /></span>
                <span class="hidden text-[13px] md:flex lg:text-[15px] xl:text-[18px]">Написать в WhatsApp</span>
            </a>
            <a href="mailto:{ PUBLIC_EMAIL }" class="flex gap-2 items-center justify-center leading-[normal] text-[var(--clr-text)] dark:text-default hover:text-[var(--clr-2)]! transition-colors">
                <span class="min-w-[18px] w-[18px] sm:w-[22px]"><Email /></span>
                <span class="hidden text-[13px] md:flex lg:text-[15px] xl:text-[18px]">{ PUBLIC_EMAIL }</span>
            </a>
        </div>

    </div>

    <div class="flex flex-col items-center justify-center gap-8 w-full px-1 h-[100%] s:px-2 sm:px-4">
        <div class="flex flex-col w-full items-center gap-6 mt-10">
            {@render children()}

            <div class="flex gap-4 justify-center text-[var(--clr-2)] items-center mb-10 s:gap-6 sm:gap-12">
                <div class={themeBtn + themeBtnWidth} class:active={$themeMod === EThemeMod.Light} onpointerdown={() => $themeMod = EThemeMod.Light}><Sun size="lg" /></div>
                <div class={themeBtn + themeBtnWidth} class:active={$themeMod === EThemeMod.Dark} onpointerdown={() => $themeMod = EThemeMod.Dark}><Moon size="lg" /></div>
                <!-- div class={themeBtn} onpointerdown={setStandartTheme}><div class={ themeBtnWidth }><Window size="lg" /></div><span>Системная тема</span></!-->
            </div>
        </div>
    </div>
</div>