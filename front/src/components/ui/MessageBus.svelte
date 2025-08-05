<script lang="ts">
	import Portal from 'svelte-portal';
    import { store } from "$store";
	import type { Component } from 'svelte';
	import { EPositions } from '$enums/EMessage';
	import { SvelteMap, SvelteSet } from 'svelte/reactivity';
	import { Close, Warning } from '$icons/dist';
	import { fly } from 'svelte/transition';
	import { twMerge } from 'tailwind-merge';
	import { initBus } from '$store/globals';
	import type { Message } from '$src/lib/types/Message';
    
    
    
    
    initBus()
    
    
    const getPositionBusMethod = (pos:EPositions): ()=>SvelteSet<Message> => {
        return ()=>{
            if(store.get('message-bus')) {
                return (store.get('message-bus') as SvelteMap<EPositions, SvelteSet<Message>>).get(pos) as SvelteSet<Message>;
            }
            return new SvelteSet<Message>();
        }
    }
    let tl = $derived.by(getPositionBusMethod(EPositions.TopLeft));
    let tc = $derived.by(getPositionBusMethod(EPositions.TopCenter));
    let tr = $derived.by(getPositionBusMethod(EPositions.TopRight));    
    
    let ml = $derived.by(getPositionBusMethod(EPositions.MiddleLeft));
    let mc = $derived.by(getPositionBusMethod(EPositions.MiddleCenter));
    let mr = $derived.by(getPositionBusMethod(EPositions.MiddleRight));

    let bl = $derived.by(getPositionBusMethod(EPositions.BottomLeft));
    let bc = $derived.by(getPositionBusMethod(EPositions.BottomCenter));
    let br = $derived.by(getPositionBusMethod(EPositions.BottomRight));

    let st: {[k:string]: SvelteSet<Message>} = $derived.by(()=>({tl, tc, tr, ml, mc, mr, bl, bc, br}));

    const getPosTransitionConfig = (pos: string): {x: any, y:any} => {
        if(pos.includes("Right")) {
            return {x:'100%', y:0};
        }
        if(pos.includes("Left")) {
            return {x:'-100%', y:0};
        }
        if(pos.includes("Center")) {
            return {x:0, y:'100%'};
        }
        return {x:0, y:0};
    } 

</script>

{#snippet message(Icon: Component, message: Message, position: string, cls: string = "")}
    <div class={twMerge("message flex flex-row gap-3 shadow-lg px-3 py-2", message.type, cls)} transition:fly={getPosTransitionConfig(position)}>
        {#if message.icon}<message.icon />{:else}<Icon/>{/if}
        {#if typeof message.message == 'string'}
            <div>{message.message}</div>
        {:else}
            {@render message.message()}
        {/if}
        <button class="cursor-pointer ml-3 w-3" onclick={()=>{
            let k = position.replace(/([a-z])/g, '').toLowerCase();
            (st[k] as SvelteSet<Message>).delete(message);
        }}><Close class="w-full"/></button>
    </div>
{/snippet}


<Portal>
    {#each Object.entries(EPositions) as [k, v] }
        <div class={twMerge("message-bus", k.replace(/([a-z])([A-Z])/g, '$1 $2').toLocaleLowerCase())}>
            {#each st[v] as mess}
                {@render message(Warning, mess, k)}
            {/each}
        </div>
    {/each}
</Portal>

<style>
	@reference "$src/app.css";
    .message-bus { @apply flex flex-col gap-3 fixed z-[100]; }

    .message-bus.top { @apply top-2; }
    .message-bus.middle { @apply top-1/2 -translate-y-1/2; }
    .message-bus.bottom { @apply bottom-2; }

    .message-bus.left { @apply left-2; }
    .message-bus.center { @apply left-1/2 -translate-x-1/2; }
    .message-bus.right { @apply right-2; }

    .message { @apply rounded; }
    .message.success { @apply bg-lime-100; }
    .message.info { @apply bg-white; }
    .message.error { @apply bg-red-100; }
    .message.warning { @apply bg-amber-100; }

    /* .y {@apply fixed h-screen w-[1px] bg-red-400 left-1/2 top-0;} */
    /* .x {@apply fixed w-screen h-[1px] bg-red-400 left-0 top-1/2;} */
</style>
