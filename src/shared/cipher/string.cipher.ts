import bcrypt from "bcrypt";

/** Returns a bcrypt hash (60 chars) of the given plain-text password. */
export async function strinEncrypt(password: string): Promise<string> {
    const saltRounds = 10; 
    return await bcrypt.hash(password, saltRounds);
}

/** Checks if a plain-text password matches the given bcrypt hash. */
export async function stringDecrypt(password: string, hash: string): Promise<boolean> {
    return await bcrypt.compare(password, hash);
}
