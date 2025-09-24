import bcrypt from "bcrypt";
/** Returns a bcrypt hash (60 chars) of the given plain-text password. */
export async function strinEncrypt(password) {
    const saltRounds = 10;
    return await bcrypt.hash(password, saltRounds);
}
/** Checks if a plain-text password matches the given bcrypt hash. */
export async function stringDecrypt(password, hash) {
    return await bcrypt.compare(password, hash);
}
//# sourceMappingURL=string.cipher.js.map