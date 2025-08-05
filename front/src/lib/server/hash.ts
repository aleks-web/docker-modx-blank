import {hash as argonHash, verify} from "@node-rs/argon2";

export const hashOptions = {
    memoryCost: 19456,
    timeCost: 2,
    outputLen: 32,
    parallelism: 1
};
export const verifyPassword = async (hash: string, password: string) => await verify(hash, password, hashOptions)
export const hash = async (string: string) => await argonHash(string, hashOptions)