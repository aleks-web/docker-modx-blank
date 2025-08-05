<script lang="ts">
    /**
    * Main
    * */
    import { Close } from '$icons';
    import { fade } from 'svelte/transition';
    import { twMerge } from 'tailwind-merge';
	import Portal from 'svelte-portal';
    import { onMount } from "svelte";

    let { children, isOpen = $bindable(), class: classes, onclose }: { children?: () => any, isOpen: boolean, class?: string, onclose?: (...any) => any } = $props();

    onMount(() => {
        document.addEventListener('keydown', (e) => {
            if (isOpen && e.key === 'Escape') {
                isOpen = false;
            }
        });
    });

    function closeModal() {
        isOpen = false;
    }

    $effect(() => {
        if (!isOpen) {
            onclose?.();
        }
    });
</script>

{#if isOpen}
    <Portal>
        <div class="fixed z-50 w-full h-full top-0 left-0 bg-[#83838347] flex items-center justify-center p-2 s:p-3 sm:p-8" class:opened={ isOpen } transition:fade={{ duration: 150 }}>
            <div class="relative rounded-xl">
                <button type="button"
                    class="text-[var(--clr-text)] transition-all p-[3px] box-content w-5 h-5 cursor-pointer flex items-center justify-center absolute top-0 right-0 rounded-bl-sm rounded-tr-xl sm:p-[5px] 
                            hover:bg-[var(--clr-error)] hover:text-white" onclick={ closeModal }>
                    <Close class="w-[12px] h-[12px] dark:text-default sm:w-[15px] sm:h-[15px]" />
                </button>

                <div class={twMerge("p-3 pt-5 bg-white rounded-xl s:p-5 sm:p-6 lg:px-10 lg:pt-8 dark:bg-default", classes)}>
                    {@render children?.()}
                </div>
            </div>
        </div>
    </Portal>
{/if}