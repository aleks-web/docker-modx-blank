import { hash } from '@node-rs/argon2';
import { fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import type { TFieldStatus } from '$lib/types/TFieldStatus';
import { mailer }  from "$lib/server/mailer";
import { User as UserEntity } from "$lib/server/entities/User";

import AppDataSource from "$lib/server/database/ormconfig";

import { validateUserName, validateEmail } from '$lib/utils';
import { Role } from '$entities/Role';


export const load: PageServerLoad = async () => {

};


export const actions: Actions = {
	register: async (event) => {
		const formData = await event.request.formData();
		const username = String(formData.get('username'));
		const email = String(formData.get('email'));
		const password = String(formData.get('password'));

		let errors: TFieldStatus[] = [];

		if (!validateUserName(username)) {
			errors.push({ name: 'username', message: "Неверное имя пользователя", status: 'error'});
		}
		if (!validatePassword(password)) {
			errors.push({ name: 'password', message: "Не правильный пароль", status: 'error'});
		}
		if (!validateEmail(email)) {
			errors.push({ name: 'email', message: "Не верный email", status: 'error'});
		}
		if (await findUserByEmail(email)) {
			errors.push({ name: 'email', message: "Пользователь с таким Email уже существует", status: 'error'});
		}

		if (errors.length) {
			return fail(400, { success: false, errors: errors });
		}

		const passwordHash = await hash(password, {
			memoryCost: 19456,
			timeCost: 2,
			outputLen: 32,
			parallelism: 1
		});

		try {
			let r = await Role.findOne({
				where: {id:1}
			});

			const newUser = new UserEntity();
			newUser.email = email;
			newUser.name = username;
			newUser.passwordHash = passwordHash;
			if(r) { newUser.roles = [r]; }
			await newUser.save();
			// await AppDataSource.query("INSERT INTO users_roles (user_id, role_id) VALUES ($1, $2)", [newUser.id, 1]);

			const sessionToken = Auth.generateSessionToken();
			const session = await Auth.createSession(sessionToken, newUser);
			Auth.setSessionTokenCookie(sessionToken, session.expiresAt);

			const readyLink = event.url.origin + '/auth/confirmation?confirmation_token=' + btoa(email + '|' + password);
			await mailer('Подтвердите аккаунт ParsingData', `
					<div><b>Ссылка для подтверждения:</b> ${readyLink}</div>
			`);

			return {success: true, message: 'Необходимо подтвердить Email. Проверьте свою почту, которую указали при регистрации'};


		} catch (er) {
			console.error(er);
		}
	}
};

function validatePassword(password: unknown): password is string {
	return typeof password === 'string' && password.length >= 6 && password.length <= 255;
}

async function findUserByEmail(email: string) {
	const user = await UserEntity.findOne({ where: { email: email } });
	return user;
}