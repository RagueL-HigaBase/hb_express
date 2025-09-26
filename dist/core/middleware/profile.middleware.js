export async function systemMiddleware(req, res, next) {
    const { session } = req.cookies;
    const { password, newpassword, confirm } = req.body;
    return res.status(200).json({ ok: true,
        data: {
            password,
            newpassword,
            confirm
        }
    });
}
//# sourceMappingURL=profile.middleware.js.map