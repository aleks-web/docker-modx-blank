import { sequence } from '@sveltejs/kit/hooks';
import { i18n } from '$lib/i18n';
import type {Handle} from '@sveltejs/kit';
import { redirect } from '@sveltejs/kit';
import AppDataSource from '$lib/server/database/ormconfig';
import UserSettings from '$lib/server/UserSettings';
import { Permission } from '$entities/Permission';
import { EPermissions } from '$lib/enums/EPermissions';
import { Auth as AuthClass } from '$lib/server/auth';

process.on('unhandledRejection', (reason) => {
	console.error('Необработанное отклонение:', reason);
});

const handleDbInit: Handle = async ({ event, resolve }) => {
	if (event.isDataRequest) {
		return resolve(event);
	}

	if (!AppDataSource.isInitialized) {
		await AppDataSource.initialize()
			.then(() => {
				resolve(event);
			})
			.catch((er) => {
				console.log('Initialize Db Error', er);
			});
	}

	return resolve(event);
};
const handleAuth: Handle = async ({ event, resolve }) => {
	globalThis.Auth = new AuthClass(event);
	event.locals.oldSession = await Auth.getOldSession();

	const { session } = await Auth.getSessionData();

	if (!session) {
		/* BEGIN Если пользователь не авторизован - перенаправляем на страницу логина */
		const authRoutes = ['/auth/login', '/auth/register'];
		if (!event.locals.user && !authRoutes.includes(event.route.id ? event.route.id : '')) {
			redirect(302, '/auth/login');
		}
		/* END */

		return resolve(event);
	} else {
		if (event.locals.user) {
			event.locals.userRoles = event.locals.user.roles;
			const permissions: Permission[] = [];
			for (const role of event.locals.userRoles) {
				const rolePermissions = role.permissions;
				for (const permission of rolePermissions) {
					permissions.push(permission);
				}
			}
			event.locals.userPermissions = permissions;
		}
		return resolve(event);
	}
};

const handleHelpersInit: Handle = async ({ event, resolve }) => {
	globalThis.hasPermission = function (permission: string | EPermissions) {
		if (typeof permission === 'string') {
			for (const perm of event.locals.userPermissions) {
				if (perm.code === permission) {
					return true;
				}
			}
			return false;
		} else {
			return false;
		}
	};

	globalThis.UserSettings = new UserSettings(event);
	await globalThis.UserSettings.init();

	return resolve(event);
};
const handleParaglide: Handle = i18n.handle();

export const handle: Handle = sequence(
	handleDbInit,
	handleAuth,
	handleHelpersInit,
	handleParaglide
);
