import type { EPositions, MessageType } from "$enums/EMessage";
import type { Message } from "$src/lib/types/Message";
import { store } from "$store";
import { SvelteMap, SvelteSet } from "svelte/reactivity";
export const loading = {
    get: ()=>(store.get('loading')),
    set: (v:boolean)=>(store.set('loading', v))
};

export const initBus = () => {
        if(false == store.has('message-bus')) {
            store.set('message-bus', new SvelteMap<EPositions, SvelteSet<Message>>());
        }
    }
export function pushMessage(message: Message, position: EPositions, timeout: false|number = 3000) {
    initBus();
    let bus = (store.get('message-bus') as SvelteMap<EPositions, SvelteSet<Message>>);
    let posBus = bus.get(position);
    if(!posBus) { bus.set(position, new SvelteSet<Message>()); posBus = bus.get(position); }
    if(!posBus) { console.log(position, 'position bus not defined'); return; }
    posBus.add(message);
    if(timeout) {
        setTimeout(()=>{
            posBus.delete(message);
        }, timeout);
    }
}