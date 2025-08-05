import {
    BaseValidator,
    type ValidationError,
    type Validator,
    type ValidatorOptions
} from "$lib/support/validation/Validator";

import {verifyPassword} from "$lib/server/hash";

type PasswordHashOptions = ValidatorOptions & {hash: string}

export class PasswordHash extends BaseValidator {
    public static new(options: PasswordHashOptions, errMess: ValidationError = null): Validator {
        return async (v: string) => {
            if (await verifyPassword(options.hash, v)) {
                return true;
            } else {
                throw new Error(errMess || `Не верно введён пароль`);
            }
        }
    }
}