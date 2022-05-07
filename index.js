const buildApp = require("./src/app");
const config = require("./src/config");

const startApp = async () => {
  const app = await buildApp();

  try {
    app.listen(config.port, config.host_name, () => {
      console.log(`app running at ${config.port}`);
    });
  } catch (err) {
    console.log(err);
    process.exit(1);
  }
};

startApp();
