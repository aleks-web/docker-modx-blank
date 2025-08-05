// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
	namespace App {
		interface Locals {
			user: import('$lib/server/auth').SessionValidationResultAuth['user'];
			session: import('$lib/server/auth').SessionValidationResultAuth['session'];
			userRoles: import('$entities/Role').Role[];
			userPermissions: import('$entities/Permission').Premission[];
			oldSession: import('$lib/server/entities/Session').Session | null;
		}
		// interface Error {
		// 	httpStatus: number,
		// 	message?: string
		// }
	}
}

export {};
