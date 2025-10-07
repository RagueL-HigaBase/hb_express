export type ErrorPolicy = {
    ok: false;
    data: {
        message: string;
        reason?: string;
    };
};
export type SuccessPolicy<T> = {
    ok: true;
    data: T;
};
export type ApiPolicy<T> = ErrorPolicy | SuccessPolicy<T>;
//# sourceMappingURL=policy.d.ts.map