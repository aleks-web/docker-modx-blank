import type { Permission } from "$entities/Permission";
import { EPermissions } from "$enums/EPermissions";
import { BezierCurve, Cart, ClipboardList, Cube, Planet, Settings, Summary, User } from "$icons/dist";
import type { TLink } from "$lib/types/TLink";

export function getLinks(perms: Permission[]) {
        
        let links:TLink[] = [];
        for (const perm of perms) {
            
            if (EPermissions.ProductAll === perm.code) {
                links.push({ path: "/main/products", name: "Товары", icon: Cart, sort: 10 })
                links.push({ path: "/main/summary", name: "Сводка", icon: Summary, sort: 1 })
                // links.push({ path: "/main/settings", name: "Настройки", icon: Settings, sort: 80 })
            }

            if (EPermissions.CategoryAll === perm.code) {
                links.push({ path: "/main/categories", name: "Категории", icon: BezierCurve, sort: 20 })
            }

            if (EPermissions.TaskAll === perm.code) {
                links.push({ path: "/main/tasks", name: "Задачи", icon: ClipboardList, sort: 30 })
            }

            if (EPermissions.UserSwitch === perm.code) {
                links.push({ path: "/main/user-switch", name: "Смена пользователя", icon: User, sort: 40 })
            }

            if (EPermissions.CompetitorAll === perm.code) {
                links.push({ path: "/main/competitors", name: "Сайты", icon: Planet, sort: 50 })
            }

            if (EPermissions.BrandAll === perm.code) {
                links.push({ path: "/main/brands", name: "Бренды/производители", icon: Cube, sort: 60 })
            }

            if (EPermissions.SitesControlAll === perm.code) {
                links.push({ path: "/main/links", name: "Сайты в парсинге", icon: Cube, sort: 70 })
            }

           
        }
        if(true) {
            const adminPath = "/admin";
            links.push(
                { path: adminPath + "", name: "Администрирование", icon: Settings, sort: 90, submenu: [
                { path: adminPath + "/sites", name: "Сайты" },
                { path: adminPath + "/roles", name: "Роли" },
                { path: adminPath + "/users", name: "Пользователи" },
                { path: adminPath + "/routes", name: "Обработка адресов" },
            ]})
        }

        links.sort((a, b) => Number(a.sort) - Number(b.sort));
        return links;
    }