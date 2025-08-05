import { error } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import {filter as filterHandler} from "$lib/server/filteresHandlers/productsFillterHandler";

/**
 * Enums
 * */
import { EPermissions } from "$lib/enums/EPermissions";


export const load: PageServerLoad = async (event) => {
    if (!hasPermission(EPermissions.ProductCreate) || !hasPermission(EPermissions.ProductAll)) {
        error(403, {message: 'Недостаточно прав на просмотр'});
    }

	return actions.filter(event);
};


export const actions: Actions = {
	filter: async (event) => {
		const competitor = (await UserSettings.getCompetitor());
		const result = await filterHandler(event, {competitors:  competitor ? [competitor.id] : []});

		return result;
	}
};