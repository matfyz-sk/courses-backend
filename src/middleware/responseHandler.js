export function responseHandler(req, res) {
    res.status(200).json({status: true, resource: res.locals.resource.subject});
}
