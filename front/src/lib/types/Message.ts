import type { MessageType } from "$enums/EMessage";
import type { Component, Snippet } from "svelte";

export type Message = {message: string|Snippet, type: MessageType, icon?: Component};