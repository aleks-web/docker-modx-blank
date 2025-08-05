import type { Actions, PageServerLoad } from './$types';
import { verify } from '@node-rs/argon2';
import { User } from '$entities/User';

import { mailer }  from "$lib/server/mailer";

export const load: PageServerLoad = async (event) => {
	const confirmationToken = event.url.searchParams.get('confirmation_token');

	try {
		if (confirmationToken) {
			const data= atob(confirmationToken).split('|');

			if (data.length) {
				const user = await User.findOneBy({ email: data[0] });

				if (user && !user.emailVerification) {
					user.emailVerification = new Date();

					await user.save();

					mailer('Успешное подтверждение аккаунта ParsingData', `
						<h2 style="margin-top: 0; margin-bottom: 0;">Успешное подтверждение аккаунта <span style="color: #1450d0;">ParsingData</span></h2>
						<br>
						<div style="margin-bottom: 5px;">Ваши учетные данные:</div>
						<div><b>Email:</b> ${data[0]}</div>
						<div><b>Пароль:</b> ${data[1]}</div>
						<div><b>Сайт:</b> ${event.url.origin}</div>
					`);

					return {
						confirmation_success: true
					}
				}

			}
		}
	} catch (er) {
		return {
			confirmation_success: false
		}
	}
};

export const actions: Actions = {
	confirm: async (event) => {
		console.log(event);
	}
};

async function validatePassword(password: string, user: User): Promise<boolean> {
	const result =  await verify(user.passwordHash, password, {
		memoryCost: 19456,
		timeCost: 2,
		outputLen: 32,
		parallelism: 1
	});

	return result;
}