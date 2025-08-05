import { verify } from '@node-rs/argon2';
import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { User as UserEntity } from "$entities/User";
import { Role } from "$entities/Role";
import type { TFieldStatus } from '$lib/types/TFieldStatus';


export const load: PageServerLoad = async () => {

};


export const actions: Actions = {
	login: async ({ cookies, request }) => {
		const formData = await request.formData();
		const email = String(formData.get('email'));
		const password = String(formData.get('password'));

		const errors: TFieldStatus[] = [];

		const user = await UserEntity.findOne({ where: { email: email }, relations: {roles:true} });

		if (!user) {
			errors.push({ name: 'email', message: "Пользователь с таким email - не найден", status: 'error'});
		}

		if (!password) {
			errors.push({ name: 'password', message: "Вы не ввели пароль", status: 'error'});
		}

		if (user && password && !await validatePassword(password, user)) {
			errors.push({ name: 'password', message: "Не верный пароль", status: 'error'});
		}

		if (errors.length) {
			return fail(400, { success: false, errors: errors });
		} else if (user) {
			const sessionToken = Auth.generateSessionToken();
			const session = await Auth.createSession(sessionToken, user);
			Auth.setSessionTokenCookie(sessionToken, session.expiresAt);

			const rolesIds = getIdsRoles(user.roles);

			if (rolesIds.includes(1)) {
				return redirect(302, '/main/summary');
			}

			if (rolesIds.includes(2)) {
				return redirect(302, '/main/tasks');
			}
		}

	}
};

async function validatePassword(password: string, user: UserEntity): Promise<boolean> {
	const result =  await verify(user.passwordHash, password, {
		memoryCost: 19456,
		timeCost: 2,
		outputLen: 32,
		parallelism: 1
	});

	return result;
}

function getIdsRoles(roles: Role[]): number[] {
	const rolesIds: number[] = [];

	for (const role of roles) {
		rolesIds.push(Number(role.id))
	}

	return rolesIds;
}