module.exports = (func) => {
    return (req, res, next) => {
        try {
            const result = func(req, res, next);
            if (result && typeof result.then === 'function') {
                result.then(() => {}).catch(next);
            }
        } catch (err) {
            next(err);
        }
    };
};