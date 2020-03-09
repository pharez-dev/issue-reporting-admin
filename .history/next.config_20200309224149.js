if (typeof require !== "undefined") {
  require.extensions[".less"] = file => {};
}
const withPlugins = require("next-compose-plugins");
const withLess = require("@zeit/next-less");
const withSass = require("@zeit/next-sass");
const webpack = require("webpack");
const withCSS = require("@zeit/next-css");
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
    localIdentName: "[local]___[name]___[hash:base64:5]"
  }
};
const cssConfig = withCSS({
  cssModules: true,
  cssLoaderOptions: {
    importLoaders: 1,
    localIdentName: "[local]___[hash:base64:5]"
  }
});
module.exports = withPlugins([withLess, [withSass, sassConfig]], nextConfig);
