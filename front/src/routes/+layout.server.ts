import type { LayoutServerLoad } from './$types';
import { EThemeMod, themeMod, themeModCookieName } from '$store/themeMod';

export const load: LayoutServerLoad = async (event) => {

    /*
        Set default themeMod
    */
    (!event.cookies.get(themeModCookieName) || event.cookies.get(themeModCookieName) === EThemeMod.Light) ? themeMod.set(EThemeMod.Light) : themeMod.set(EThemeMod.Dark);

    const roles = event.locals.userRoles?.map(role => {
        return role.toPlain()
    })

    const permissions = event.locals.userPermissions?.map(permission => {
        return permission.toPlain();
    });

    return {
        user: event.locals.user?.toPlain(),
        userRoles: roles,
        userPermissions: permissions
    }
};