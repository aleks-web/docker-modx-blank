// import { goto } from "$app/navigation";
// import { goto } from "$lib/globals";
import type { IOption, TLazyLoadResult, TLoadResult } from "$lib/types/IInputProps";
import { goto } from "$lib/support/request";

export function listToLazyOptions(list: IOption[]) {
    return async (filter: string, value: any = null): TLazyLoadResult => {
        return new Promise(async (resolve) => {
            let lcf = filter.toLocaleLowerCase();
            let options: IOption[] = list;
            if(filter) { options = options.filter( o => o.name.toLocaleLowerCase().includes(lcf) ); }
            let selected: IOption[] = [];
            if(Array.isArray(value) && value.length) {
                selected = list.filter((c)=>value.includes(c.value));
            }
            resolve({options, selected});
        });
    }
} 

export function getForceSubmitFunc(formSelector: string) {
    return () => {
        let form = document.querySelector(formSelector) as HTMLFormElement
        let e = new SubmitEvent('submit', {submitter: form});
        submitGetForm(e);
    }
}
export function submitGetForm(event: SubmitEvent, delay: number = 200) {
    event.preventDefault();
    let onSubmit = async ()=>{
        let form = (event.submitter ? event.submitter : event.target ) as HTMLFormElement | HTMLButtonElement;
        if(form instanceof HTMLButtonElement) {
            form = form.closest("form") as HTMLFormElement;
        }
        if(!form) {return;}
        const __data = new FormData(form);
        const urlSearchParams: URLSearchParams = new URLSearchParams(__data as any);
        goto("?"+urlSearchParams.toString());
    };
    if(delay < 1) {
        onSubmit();
    }
    setTimeout(onSubmit, delay);
}