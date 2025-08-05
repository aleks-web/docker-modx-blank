/*
    Поиск объекта по свойству
*/
export function findObjectByProperty<T extends Record<string, any>>(array: T[] | null | undefined, property: string, value: string): T | undefined {
    if (Array.isArray(array)) {
        return array.find(item => item[property] === value);
    }

    return undefined;
}

export function validateUserName(username: unknown): username is string {
	return (
		typeof username === 'string' &&
		username.length >= 3 &&
		username.length <= 31 &&
		/^[A-zА-я|-]+$/.test(username)
	);
}

export function validateEmail(email: unknown) : email is string {
	const EMAIL_REGEXP = /^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/iu;

	return (
		typeof email === 'string' &&
		EMAIL_REGEXP.test(email)
	);
}