export async function mockController(req, res, err) {
    res.status(404).json({
        ok: false,
        message: "system.enpoint.unexist"
    });
}
//# sourceMappingURL=mock.controller.js.map