if (typeof require !== "undefined") {
  require.extensions[".less"] = file => {};
}

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

ithCSS({
  webpack(config, options) {
    return config;
  }
});
module.exports = withLess(nextConfig);
