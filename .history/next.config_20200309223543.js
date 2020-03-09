if (typeof require !== "undefined") {
  require.extensions[".less"] = file => {};
}
const withPlugins = require("next-compose-plugins");
const withLess = require("@zeit/next-less");
const withSass = require("@zeit/next-sass");
const webpack = require("webpack");
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
  webpack: config =>  {
    module: {
      rules: [
        {
          test: /\.css$/,
          use: [
            // style-loader
            { loader: 'style-loader' },
            // css-loader
            {
              loader: 'css-loader',
              options: {
                modules: true
              }
            },
            // sass-loader
            { loader: 'sass-loader' }
          ]
        }
      ]
    }
  };
};

const sassConfig = {
  cssModules: true,
  cssLoaderOptions: {
    importLoaders: 1,
    localIdentName: "[local]___[name]___[hash:base64:5]"
  }
};
module.exports = withPlugins([withLess, [withSass, sassConfig]], nextConfig);
