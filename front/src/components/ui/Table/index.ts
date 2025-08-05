import type { Component, Snippet } from "svelte"
import Text from "./Filter/Text.svelte";
import { v7 as uuid } from 'uuid';

export abstract class Filter<D> {
    protected def: D;
    constructor(def: D) { this.def = def; }
    abstract getType(): string;
    getDefault(): D { return this.def; }
    abstract render: Component<any, any, string>
}

// 'text'|'checkbox'|'number'|'range'|'date'
export class TextFilter extends Filter<string> {
    getType(): string { return "text" }
    render = Text;
}

declare const opaqueSym: unique symbol;

export type NonEmptyString = string & { [opaqueSym]: "NonEmptyString" };

export function NonEmptyString(s: string): NonEmptyString {
  if (s.length === 0) {
    throw new Error("NonEmptyString: received an empty string")
  }

  return s as NonEmptyString
}

export type Column<T = any> = {
    render?: Snippet<[Column<T>, any]>|(()=>any)
    renderCap?: Snippet<[Column<T>]>|(()=>any)
    onClick?: (e: PointerEvent, col: Column<T>)=>Promise<void> 
    onCapClick?: (e: PointerEvent, col: Column<T>)=>Promise<void> 
    // filter?: Snippet<[]>|(()=>any)
    label?: string
    index?: number
    class?: string|string[]
    capClass?: string|string[]
    fixed?: boolean
    locked?: boolean
    name: NonEmptyString
    width?: null|number|string
    filter?: Filter<T>
}
export type TableRows = Array<Record<string|number,any>>; 

export type FilterValue = Record<string, string>;
export type TableFilter = Record<string, [string, any]>;
export type FilterHandler = (e: MouseEvent)=>void;


export const getColIdentity = (col:Column, row:any)=> {
    
    return col.index ?? col.name;
};
export const getColClass = (col:Column)=> "col-" + (col.index || col.name);
export const getFilterKey = (col:Column)=> col.name || "col-" + col.index;
