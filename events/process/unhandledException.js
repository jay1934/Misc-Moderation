module.exports = (promise, reason) =>
  console.log(
    `Unhandled Rejection at: Promise ${promise}. Reason: ${reason}. Trace: ${reason.stack}`
  );
