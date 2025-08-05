import {
    BaseValidator,
    type ValidationError,
    type Validator,
    type ValidatorOptions
} from "$lib/support/validation/Validator";
import type {TFieldStatus} from "$lib/types/TFieldStatus";


export class RegEx extends BaseValidator {
    public static new(options: ValidatorOptions & { regex: RegExp }, errMess: ValidationError = null): Validator {
        return async (v: string) => {
            if (v.match(options.regex)) {
                return true;
            } else {
                throw new Error(errMess || `Строка не соответствует регулярному выражению`);
            }
        }
    }
}

export const EMAIL_REGEXP = /^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/iu;

export class Email extends BaseValidator {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    public static new(options: ValidatorOptions = {}, errMess: ValidationError = null): Validator {
        return async (v: string) => {
            try {
                return await RegEx.new({ regex: EMAIL_REGEXP })(v);
            } catch (e) {
                throw new Error(errMess || `Не верно указан email.`);
            }
        }
    }
}

export async function validateForm<FORM extends {[key: string]:any}>(formData: FormData, formValidators: Record<keyof FORM, Validator[]>) {
    let err: TFieldStatus[] = [];

    for (const fieldName of Object.keys(formValidators)) {
        const field = String(formData.get(fieldName));
        const validations = formValidators[fieldName];

        try {
            for (const vFn of validations) {
                await vFn(field);
            }
        } catch (e) {
            err.push({
                name: fieldName,
                message: e.message,
                status: 'error'
            });
        }
    }

    if (err.length > 0) {
        return err;
    } else {
        return true;
    }
}