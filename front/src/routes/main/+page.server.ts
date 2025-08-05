import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

import { EPermissions } from "$lib/enums/EPermissions";

export const load: PageServerLoad = async (event) => {
	if (hasPermission(EPermissions.TaskAll)) {
		redirect(303, '/main/tasks');
	}

	if (hasPermission(EPermissions.ProductAll)) {
		redirect(303, '/main/products');
	}
};