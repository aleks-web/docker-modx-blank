import type { Snippet } from "svelte";

export interface IInputBaseProps {
    class?: string;
    name?: string;
    disabled?: boolean;
    placeholder?: string;
    clearable?: boolean;
    onchange?: (e: any) => any;
    oninput?: (e: any) => any;
    onfocus?: (e: any) => any;
    onblur?: (e: any) => any;
}

export interface ITextInputProps extends IInputBaseProps {
    value: string;
};

export interface IOption {
    name: string,
    value?: string,
    disabled?: boolean,
    selected?: boolean,
};

export interface ISelectBaseProps extends IInputBaseProps {
    allowCustom?: boolean,
}

export interface ISelectProps extends ISelectBaseProps {
    value: null|number|string | Array<number|string>,
    options: IOption[],
}


export type TLoadResult = {options: Array<IOption>, selected: Array<IOption>};
export type TLazyLoadResult = Promise<TLoadResult>;

export interface ISelectLazyProps extends ISelectProps {
    load?: (filter: string, value?: string[]) => TLazyLoadResult;
    filterValidator?: (filter: string) => Boolean;
    onApplyCustom?: (opts: IOption[])=>Promise<IOption[]>;
    validation?: (value: string)=>boolean;
    addFormPlaceholder?: string; 
    popoverClass?: string; 
}

export type RangeValue = number|""|undefined|null
export interface IRangeProps extends IInputBaseProps {
    min: RangeValue,
    max: RangeValue,
    limits: {
        min: number,
        max: number,
    }
}