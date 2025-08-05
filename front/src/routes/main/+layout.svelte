<script lang="ts">
    import type { LayoutData } from "./$types";
    import { type Snippet } from "svelte";
    import Header from "$components/Header.svelte";
    import Sidebar from "$components/aside/Sidebar.svelte";
	import Nav from "$components/ui/Nav.svelte";
	import NavLink from "$components/ui/NavLink.svelte";
	import { getLinks } from "$src/lib/support/menu";

    let { children, data } : { children: Snippet, data: LayoutData } = $props();
</script>

<div class="p-[var(--gap)] flex flex-col gap-[var(--gap)] min-h-[inherit] overflow-hidden dark:bg-[#102A43]">
    <Header />

    <div class="flex gap-[inherit]">
        <Sidebar>
            <Nav links={getLinks(Object.values(data.userPermissions))}/>
        </Sidebar>

        <div class="w-full flex flex-col gap-[inherit] overflow-hidden">
            {@render children()}
        </div>
    </div>
</div>