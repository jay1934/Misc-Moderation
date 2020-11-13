module.exports = (error) =>
  console.log(`Uncaught Exception. Reason: ${error}. Trace: ${error.stack}`);
