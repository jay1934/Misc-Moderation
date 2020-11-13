const fs = require('fs');

exports.init = (client) => {
  fs.readdirSync('./events/client').forEach((file) =>
    client.on(file.split('.')[0], (...args) =>
      require(`../events/client/${file}`)(...args, client)
    )
  );
  fs.readdirSync('./events/process').forEach((file) =>
    process.on(file.split('.')[0], require(`../events/process/${file}`))
  );
};
