export type ErrorPolicy = { ok: false, data: { message: string }};

export type SuccessPolicy<T> = { ok: true, data: T };

export type ApiPolicy<T> = ErrorPolicy | SuccessPolicy<T>