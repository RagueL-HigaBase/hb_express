export async function loginMiddleware(req, res, next) {
    const { session } = req.cookies;
    console.log(typeof session);
    // if (typeof session !== "string") {}
    next();
}
//# sourceMappingURL=login.middleware.js.map