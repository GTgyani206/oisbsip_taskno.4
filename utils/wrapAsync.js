module.exports = (fn) => {
  return (req, res, next) => {
    try {
      const result = fn(req, res, next);
      if (!result || typeof result.catch !== 'function') {
        throw new Error('Function does not return a promise');
      }
      result.catch(next);
    } catch (err) {
      next(err); 
    }
  };
};
