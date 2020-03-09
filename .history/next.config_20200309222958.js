if (typeof require !== "undefined") {
  require.extensions[".less"] = file => {};
}
const withPlugins = require("next-compose-plugins");
const withLess = require("@zeit/next-less")l
const sass = require('@zeit/next-sass');
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

  const sassConfig = {
    cssModules: true,
    cssLoaderOptions: {
      importLoaders: 1,
      localIdentName: '[local]___[name]___[hash:base64:5]'
    }
  };
module.exports = withPlugins([withLess,  [withSass, sassConfig],],nextConfig));
