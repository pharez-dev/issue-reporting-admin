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
  webpack: config => {
    //   config.module.rules.push({
    //     test: /\.css$/,
    //     use: [
    //       {
    //         loader: "style-loader"
    //       },
    //       {
    //         loader: "css-loader"
    //       },
    //       {
    //         loader: "sass-loader"
    //       }
    //     ]
    //   });
    return config;
  }
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
const lessConfig = withLess({
  lessLoaderOptions: {
    modifyVars: {
      "primary-color": "#066"
    },
    javascriptEnabled: true
  },
  webpack: (config, { isServer }) => {
    if (isServer) {
      const antStyles = /antd\/.*?\/style.*?/;
      const origExternals = [...config.externals];
      config.externals = [
        (context, request, callback) => {
          if (request.match(antStyles)) return callback();
          if (typeof origExternals[0] === "function") {
            origExternals[0](context, request, callback);
          } else {
            callback();
          }
        },
        ...(typeof origExternals[0] === "function" ? [] : origExternals)
      ];

      config.module.rules.unshift({
        test: antStyles,
        use: "null-loader"
      });
    }
    return config;
  }
});
module.exports = withPlugins(
  [
    [withLess, lessConfig],
    [withCSS, cssConfig]
  ],
  nextConfig
);
