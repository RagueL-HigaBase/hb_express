/**
 * RU: Возвращает bcrypt-хеш (~60 символов) для указанного открытого пароля.
 * EN: Returns a bcrypt hash (~60 chars) of the given plain-text password.
 * NL: Geeft een bcrypt-hash (~60 tekens) van het opgegeven wachtwoord in platte tekst.
 *
 * @param password RU: исходный пароль / EN: plain-text password / NL: wachtwoord in platte tekst
 * @returns RU: строка-хеш для хранения в БД / EN: hash string for DB storage / NL: hashtekenreeks voor DB-opslag
 * @example
 * const hash = await strinEncrypt('Pa$$w0rd');
 * @remarks RU: Для продакшена можно повысить saltRounds; EN: Consider higher saltRounds in production; NL: Overweeg hogere saltRounds in productie.
 */
export declare function stringEncrypt(password: string): Promise<string>;
/**
 * RU: Проверяет, совпадает ли открытый пароль с переданным bcrypt-хешем.
 * EN: Verifies whether a plain-text password matches the provided bcrypt hash.
 * NL: Controleert of een wachtwoord in platte tekst overeenkomt met de opgegeven bcrypt-hash.
 *
 * @param password RU: исходный пароль / EN: plain-text password / NL: wachtwoord in platte tekst
 * @param hash RU: существующий bcrypt-хеш / EN: existing bcrypt hash / NL: bestaande bcrypt-hash
 * @returns RU: true при совпадении, иначе false / EN: true if matched, otherwise false / NL: true bij match, anders false
 * @example
 * const ok = await stringDecrypt('Pa$$w0rd', hash);
 */
export declare function stringDecrypt(password: string, hash: string): Promise<boolean>;
//# sourceMappingURL=string.cipher.d.ts.map