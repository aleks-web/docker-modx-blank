import { writable } from 'svelte/store';

export enum EThemeMod {
    Light = 'light',
    Dark = 'dark'
}

export const themeMod = writable(EThemeMod.Light);
export const themeModCookieName = 'themeMod';

if (!import.meta.env.SSR) {
	function getCookie(name: string) {
		let matches = document.cookie.match(new RegExp(
			"(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
		));

		return matches ? decodeURIComponent(matches[1]) : undefined;
	}

	function setCookie(name: string, value: string) {
		let expires = "";
		document.cookie = name + "=" + (value || "") + expires + "; path=/";
	}

	const mod = getCookie(themeModCookieName);

	if (mod === EThemeMod.Light || !mod) {
		themeMod.set(EThemeMod.Light);
		setCookie(themeModCookieName, EThemeMod.Light);
	} else {
		themeMod.set(EThemeMod.Dark);
		setCookie(themeModCookieName, EThemeMod.Dark);
	}

	themeMod.subscribe((newValue) => {
		setCookie(themeModCookieName, newValue);
	})
}