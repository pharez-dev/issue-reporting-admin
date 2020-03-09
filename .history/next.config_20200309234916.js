if (typeof require !== "undefined") {
  require.extensions[".less"] = file => {};
  require.extensions[".css"] = file => {};
}
const withPlugins = require("next-compose-plugins");
const withCSS = require("@zeit/next-css");
const withLess = require("@zeit/next-less"),
  nextConfig = {
    //target: 'serverless',
    preserveLog: true,
    env: {
      weatherApi: "",
      mapBoxApi: ""
    },
    onDemandEntries: {
      maxInactiveAge: 1000 * 60 * 60,
      pagesBufferLength: 5
    },
    lessLoaderOptions: {
      javascriptEnabled: true
    },
    webpack: config => config
  };

module.exports = withLess(withCSS(nextConfig));
