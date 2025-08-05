<script lang="ts">
	import type { TPagination } from '$lib/types/TPagination';
	import { ChevronRight } from '$icons';
	import { goto } from '$lib/support/request';
	import { twMerge } from "tailwind-merge";

	type Props = {
		pagination: TPagination
	};

	let { pagination }: Props = $props();

	function nextPage() {
		if (pagination.nextPage && pagination.totalPages >= pagination.nextPage) {
			goto(getPage(pagination.nextPage));
		}
	}

	function prevPage() {
		if (pagination.prevPage) {
			goto(getPage(pagination.prevPage));
		}
	}

	function getPage(pageNum: number) {
		const url = new URL(window.location.href);
		url.searchParams.set('page', String(pageNum));

		return url.href;
	}

	function goToPage(page: number) {
		goto(getPage(page));
	}

	function getPaginationButtons() {
		const items = [...Array(pagination.totalPages)].map((_, index) => index + 1);
		const buttonsToShow = 3;
		let buttons = [];
		let firstPages = false;

		if (pagination.totalPages <= 7) {
			buttons = items;
			firstPages = true;
		} else {
			if (pagination.currentPage > 3) {
				let centerIndex = items.indexOf(pagination.currentPage);
				const result = items.slice(centerIndex - buttonsToShow, centerIndex + buttonsToShow + 1);

				result.forEach(el => {
					buttons.push(el);
				});
			} else {
				[1, 2, 3, 4, 5, 6, 7].forEach(el => {
					buttons.push(el);
				});
			}
		}

		if (pagination.currentPage > 5 && !firstPages) {
			buttons = [1, '...', ...buttons];
		}

		if (pagination.totalPages - pagination.currentPage >= 5 && !firstPages) {
			buttons = [...buttons, '...', pagination.totalPages];
		}

		return buttons;
	}

	let btnClass = `rounded-md cursor-pointer bg-white transition-all h-[30px] w-[30px] min-w-[30px] flex items-center justify-center text-[13px] leading-0
			        hover:bg-[var(--clr-main)] hover:text-white
			        [.disabled]:pointer-events-none [.disabled]:opacity-60
			        s:w-[35px] s:min-w-[35px] s:h-[35px] s:text-[14px]
			        sm:w-[40px] sm:min-w-[40px] sm:h-[40px] sm:text-[16px]`;
</script>


{#if getPaginationButtons().length}
	<div class={twMerge("flex items-center gap-4 w-full")}>
		<div class="flex gap-1 w-[inherit]">
			<button class={ twMerge(btnClass, "dark:bg-default dark:text-default hover:dark:bg-[#3b5975]") }
							onclick={() => { prevPage(); }}
							class:disabled={pagination.currentPage <= 1}>
				<ChevronRight class="rotate-180" />
			</button>

			{#each getPaginationButtons() as bt}
				{@render btn(bt)}
			{/each}

			<button class={ twMerge(btnClass, "dark:bg-default dark:text-default hover:dark:bg-[#3b5975]") }
							onclick={() => { nextPage(); }}
							class:disabled={pagination.currentPage >= pagination.totalPages}>
				<ChevronRight />
			</button>
		</div>
	</div>
{/if}



{#snippet btn(pgNum: number)}
	<button class={twMerge(btnClass, '[.active]:bg-[var(--clr-main)]! [.active]:text-white [.active]:pointer-events-none [.disabled]:pointer-events-none [.disabled]:opacity-100 [.disabled]:bg-transparent dark:bg-default dark:text-default hover:dark:bg-[#3b5975]')}
			onclick={() => { goToPage(pgNum) }}
			class:active={pagination.currentPage === pgNum}
			class:disabled={ typeof pgNum === 'string' }>
		{pgNum}
	</button>
{/snippet}