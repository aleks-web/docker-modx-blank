import { goto as goto_sv } from "$app/navigation";
import { loading } from "$store/globals";
import _ from "lodash";
import type { IOption } from "../types/IInputProps";
import type {Product} from "$entities/Product";
import type {User} from "$entities/User";

type DefaultValue<T> = T extends object ? { [K in keyof T]: DefaultValue<T[K]> } : T;

export function parseUrlParams<T extends Record<string, any>>(
    params: URLSearchParams,
    defaults: DefaultValue<T> = {} as DefaultValue<T>
) {
    const result = { ...(_.cloneDeep(defaults)) };
    for (const [key, value] of params.entries()) {
        const keys = key.match(/[^[?.\]]+|\[\]/g); // Разбираем ключи, например `filter[price][min]` → ['filter', 'price', 'min']
        if (!keys) continue;

        let currentTarget: any = result;
        let currentPath: string[] = [];

        for (let i = 0; i < keys.length; i++) {
            const k = keys[i];

            // Если это последний ключ
            if (i === keys.length - 1) {
                // Проверяем, есть ли такой ключ в defaults
                // console.dir([k, currentTarget]);
                let targetIsArray = Array.isArray(currentTarget);
                if (!(k in currentTarget) && !targetIsArray) break;

                const defaultValue = currentTarget[k];
                const targetType = typeof defaultValue;

                // Приводим значение к нужному типу
                let convertedValue: any;
                
                switch (targetType) {
                    case 'number':
                        convertedValue = parseFloat(value);
                        if (isNaN(convertedValue)) convertedValue = defaultValue;
                        break;
                    case 'boolean':
                        convertedValue = value.toLowerCase() === 'true';
                        break;
                    case 'string':
                        convertedValue = value;
                        break;
                    default:
                        convertedValue = value;
                }
                if(targetIsArray) {
                    currentTarget.push(convertedValue)
                } else {
                    currentTarget[k] = convertedValue;
                }
                
            } else {
                // Переходим глубже по объекту
                currentPath.push(k);

                if (!(k in currentTarget)) {
                    const nextK = keys[i + 1];
                    const isArrayIndex = /^\d+$/.test(nextK) || nextK == '[]'; // Следующий ключ — индекс массива?
                    currentTarget[k] = isArrayIndex ? [] : {};
                }

                currentTarget = currentTarget[k];
            }
        }
    }


    return result;
}
/**
 * Allows you to navigate programmatically to a given route, with options such as keeping the current element focused.
 * Returns a Promise that resolves when SvelteKit navigates (or fails to navigate, in which case the promise rejects) to the specified `url`.
 *
 * For external URLs, use `window.location = url` instead of calling `goto(url)`.
 *
 */
export const goto = async (url: string | URL, opts: {
    replaceState?:boolean,
    noScroll?:boolean,
    keepFocus?:boolean,
    invalidateAll?:boolean,
    invalidate?:Array<string | URL | ((url: URL) => boolean)>,
    state?:App.PageState
} = {})=>{
    // console.log('goto handle');
    loading.set(true);
    await new Promise<void>((resolve)=>{
        setTimeout(async()=>{
            await goto_sv(url, opts);
            resolve();
        }, 10);
    })
    loading.set(false);
}


export const Get_EntityOption_AddHandler = (apiPath: string, invalidateAll: boolean = false) => {
    return async (opts: IOption[])=>{
        let _opts: IOption[] = []; 
        for(let opt of opts) {
            let response = await (await fetch(apiPath, {
                body: JSON.stringify({
                    name: opt.name, 
                }),
                method: "PUT",
            })).json();

            if(response.id) {
                _opts.push({
                    name: response.name,
                    value: response.id,
                })
            }
        }
        if(invalidateAll) { goto("", {invalidateAll: true}); }
        return _opts;
    }
}

export const productToggleActiveAction = async (product: Product | string) => {
    if (typeof product !== 'string') {
        product = product.id;
    }

    const url = '/main/products/edit/' + product + '?/toggle_active';
    let result = await fetch(url, {
        method: 'POST',
        body: JSON.stringify({ productId: product }),
        headers: {
            'x-sveltekit-action': 'true'
        }
    });
    result = await result.json();
    return result as any;
}