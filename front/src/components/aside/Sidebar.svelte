<script lang="ts">
    const { children }: {children?:()=>any} = $props();
</script>

<aside class="group bg-[var(--clr-el-bg)] rounded-2xl p-4 w-full max-w-max hidden min-h-[var(--aside-height)]
            full [.full]:max-w-[250px]
                md:block md:[.full]:max-w-[200px]
                lg:[.full]:max-w-[250px]
                xl:[.full]:max-w-[300px]

            dark:bg-default">
    {@render children?.()}
</aside>