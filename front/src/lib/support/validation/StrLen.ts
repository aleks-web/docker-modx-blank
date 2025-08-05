import {
    BaseValidator,
    type ValidationError,
    type Validator,
    type ValidatorOptions
} from "$lib/support/validation/Validator";

type StrLenOptions = ValidatorOptions & {
    strMinLen: number
    strMaxLen: number
}

export class StrLen extends BaseValidator {
    public static new(options: StrLenOptions = {strMinLen: 3, strMaxLen: 255}, errMess: ValidationError = null): Validator {
        return async (v: string) => {
            if (v.length >= options.strMinLen && v.length <= options.strMaxLen) {
                return true;
            } else {
                throw new Error(errMess || `Строка должна быть в промежутке от ${options.strMinLen} до ${options.strMaxLen} символов`);
            }
        }
    }
}