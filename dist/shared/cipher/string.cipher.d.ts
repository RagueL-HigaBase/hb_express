/** Returns a bcrypt hash (60 chars) of the given plain-text password. */
export declare function strinEncrypt(password: string): Promise<string>;
/** Checks if a plain-text password matches the given bcrypt hash. */
export declare function stringDecrupt(password: string, hash: string): Promise<boolean>;
//# sourceMappingURL=string.cipher.d.ts.map