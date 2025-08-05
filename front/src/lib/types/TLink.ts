import type { Component } from "svelte";

export type TLink = {path: undefined|null|string, name: string, icon?: Component, submenu?: null|undefined|Array<TLink>, sort?: number}