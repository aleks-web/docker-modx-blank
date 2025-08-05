import type { RequestEvent } from '@sveltejs/kit';
import { sha256 } from '@oslojs/crypto/sha2';
import { encodeBase64url, encodeHexLowerCase } from '@oslojs/encoding';
import { Session as SessionEntity } from "./entities/Session";
import { User as UserEntity } from './entities/User';

export class Auth {
	private event: RequestEvent;
	public sessionToken: string | undefined;
	private sessionId: string | undefined; // id в бд
	private dayInMs = 1000 * 60 * 60 * 24;
	public sessionCookieName = 'auth-session';
	public oldSessionCookieName = 'old-session';

	constructor(event: RequestEvent) {
		this.event = event;
		this.sessionToken = this.event.cookies.get(this.sessionCookieName);
		this.sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(this.sessionToken)));
	}

	public async getSessionData(): Promise<{ session: SessionEntity | null }> {
		const sessionEntity = await SessionEntity.findOne({ where: { uid: this.sessionId }, relations: {user: {roles: {permissions: true}, settings: true}} });

		if (!sessionEntity) {
			this.event.locals.user = null;
			this.event.locals.session = null;
			this.deleteSessionTokenCookie();

			return { session: null };
		}

		if (Date.now() >= sessionEntity.expiresAt.getTime()) { // Если сессия истекла
			await sessionEntity.remove();
			return { session: null };
		}

		if (Date.now() >= sessionEntity.expiresAt.getTime() - this.dayInMs * 15) { // Нужно ли обновить сессию
			await this.refreshSession(sessionEntity);
		}

		const session = sessionEntity;

		this.event.locals.session = session;
		this.event.locals.user = session.user;

		return { session };
	}

	public async getSessionDataByToken(token: string): Promise<{ session: SessionEntity | null, user: UserEntity | null }> {
		const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)));

		const sessionEntity = await SessionEntity.findOne({ where: { uid: sessionId }, relations: ['user'] });

		if (!sessionEntity) {
			return { session: null, user: null };
		}

		const session = sessionEntity;
		const user = sessionEntity.user;

		const sessionExpired = Date.now() >= sessionEntity.expiresAt.getTime();

		if (sessionExpired) {
			await sessionEntity.remove();
			return { session: null, user: null };
		}

		const renewSession = Date.now() >= sessionEntity.expiresAt.getTime() - this.dayInMs * 15;
		if (renewSession) {
			sessionEntity.expiresAt = new Date(Date.now() + this.dayInMs * 30);
			await sessionEntity.save();
		}

		return { session, user };
	}

	public async refreshSession(session: SessionEntity): Promise<SessionEntity> {
		session.expiresAt = new Date(Date.now() + this.dayInMs * 30);
		await session.save();

		return session;
	}

	public generateSessionToken(): string {
		const bytes = crypto.getRandomValues(new Uint8Array(18));
		const token = encodeBase64url(bytes);
		return token;
	}

	public async createSession(token: string, user: UserEntity): Promise<SessionEntity> {
		const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)));
		const sessionEntity = new SessionEntity();

		sessionEntity.uid = sessionId;
		sessionEntity.user = user;
		sessionEntity.expiresAt = new Date(Date.now() + this.dayInMs * 30);
		await sessionEntity.save();

		return sessionEntity;
	}

	public async invalidateSession(): Promise<void> {
		const { session } = await this.getSessionData();
		await session?.remove();
	}

	public setSessionTokenCookie(token: string, expiresAt: Date) {
			this.event.cookies.set(this.sessionCookieName, token, {
				expires: expiresAt,
				secure: false,
				path: '/'
			});
	}

	public setOldSessionTokenCookie(token: string, expiresAt: Date) {
		this.event.cookies.set(this.oldSessionCookieName, token, {
			expires: expiresAt,
			secure: false,
			path: '/'
		});
	}

	public deleteSessionTokenCookie() {
		this.event.cookies.delete(this.sessionCookieName, {
			secure: false,
			path: '/'
		});
	}

	public deleteOldSessionTokenCookie() {
		this.event.cookies.delete(this.oldSessionCookieName, {
			secure: false,
			path: '/'
		});
	}

	public getServerEvent(): RequestEvent {
		return this.event;
	}

	public async authorizationUnderUser(userId: number) {
		/*
			BEGIN Текущая сессия
		*/
		const nowSessionToken = this.event.cookies.get(this.sessionCookieName);
		const nowSessionExpiresAt = this.event.locals.session?.expiresAt;
		/*
			END
		*/

		if (!nowSessionToken) {
			throw new Error("Текущая сессия не определена");
		}

		const userEntity = await (await import("$lib/server/entities/User")).User.findOneBy({ id: userId });
		if (!userEntity) {
			throw new Error("Пользователь не найден");
		}

		/*
			BEGIN Новая сессия
		*/
		const newSessionTokenForUser = this.generateSessionToken();
		const user = new UserEntity();
		user.id = userId;
		const newSession = await this.createSession(newSessionTokenForUser, user);
		/*
			END
		*/

		if (nowSessionToken && nowSessionExpiresAt && newSession) {
			this.setSessionTokenCookie(newSessionTokenForUser, newSession.expiresAt);
			this.setOldSessionTokenCookie(nowSessionToken, nowSessionExpiresAt);

			this.event.locals.oldSession = this.event.locals.session;
			this.event.locals.session = newSession;
			this.event.locals.user = newSession.user;
		} else {
			throw new Error("Не удалось войти под другим пользователем");
		}
	}

	public async getOldSession(): Promise<SessionEntity | null> {
		const oldSessionToken = this.event.cookies.get(this.oldSessionCookieName);

		if (!oldSessionToken) {
			return null;
		} else {
			return (await this.getSessionDataByToken(oldSessionToken)).session;
		}
	}
}

export type SessionValidationResultAuth = Awaited<ReturnType<typeof Auth.prototype.getSessionData>>;