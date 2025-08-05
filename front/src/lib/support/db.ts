import type { TLazyLoadResult, TLoadResult } from "$lib/types/IInputProps";

export function entityOptionLoader(entity: string) {
    return async (filter: string, value: any = null): TLazyLoadResult => {
        return new Promise(async (resolve) => {
            let r: TLoadResult = await (await fetch(`/api/v1/load-options`, {
                method: "POST",
                body: JSON.stringify({
                    entity: entity,
                    filter,
                    value
                })
            })).json();
            resolve(r);
        });
    }
} 