export type Validator = (s: string)=>Promise<true>;
export type ValidatorOptions = object;
export type ValidationError = null|string;
export class BaseValidator {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    public static new(options: ValidatorOptions = {}, errMess: ValidationError = null): Validator {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        return async (v:string) => { throw new Error(errMess||"Method is not implemented");}
    }
}