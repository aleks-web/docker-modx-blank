import { json } from '@sveltejs/kit';
import type { RequestEvent } from './$types';

export async function POST(event: RequestEvent) {
	const sessionId = event.locals.session?.id;
	const oldSessionToken = event.cookies.get(Auth.oldSessionCookieName);

	if (sessionId) {
		await Auth.invalidateSession();
		Auth.deleteSessionTokenCookie();

		if (event.locals.oldSession && oldSessionToken) {
			Auth.setSessionTokenCookie(oldSessionToken, event.locals.oldSession.expiresAt);
			Auth.deleteOldSessionTokenCookie();
			event.locals.oldSession = null;
		}

		return json({ message: "Успешный выход из системы", hasOldSession: !!oldSessionToken }, { status: 200 });
	} else {
		return json({ message: "Вы уже разовтаризованы" }, { status: 401 });
	}
}