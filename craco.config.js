const path = require('path')
const fs = require('fs')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const ManifestPlugin = require('webpack-manifest-plugin')
const paths = require('react-scripts/config/paths')
const appDirectory = fs.realpathSync(process.cwd())
const resolveApp = (relativePath) => path.resolve(appDirectory, relativePath)

/**
 * Utility function to replace plugins in the webpack config files used by react-scripts
 */
const replacePlugin = (plugins, nameMatcher, newPlugin) => {
    const pluginIndex = plugins.findIndex((plugin) => {
        return plugin.constructor && plugin.constructor.name && nameMatcher(plugin.constructor.name)
    })

    if (pluginIndex === -1) return plugins

    return plugins
        .slice(0, pluginIndex)
        .concat(newPlugin)
        .concat(plugins.slice(pluginIndex + 1))
}

module.exports = {
    style: {
        postcss: {
            plugins: [require('tailwindcss'), require('autoprefixer')],
        },
    },

    webpack: {
        configure: (webpackConfig, { env, paths }) => {
            const isEnvDevelopment = process.env.NODE_ENV !== 'production'

            if (isEnvDevelopment) {
                return webpackConfig
            }

            const isEnvProduction = process.env.NODE_ENV === 'production'
            webpackConfig.entry = {
                index: [
                    isEnvDevelopment && require.resolve('react-dev-utils/webpackHotDevClient'),
                    resolveApp('src/index.js'),
                ].filter(Boolean),
                download: [
                    isEnvDevelopment && require.resolve('react-dev-utils/webpackHotDevClient'),
                    resolveApp('src/download.js'),
                ].filter(Boolean),
            }

            const indexHtmlPlugin = new HtmlWebpackPlugin(
                Object.assign(
                    {},
                    {
                        filename: 'index.html',
                        inject: true,
                        template: resolveApp('public/index.html'),
                        chunks: ['index'],
                    },
                    isEnvProduction
                        ? {
                              minify: {
                                  removeComments: true,
                                  collapseWhitespace: true,
                                  removeRedundantAttributes: true,
                                  useShortDoctype: true,
                                  removeEmptyAttributes: true,
                                  removeStyleLinkTypeAttributes: true,
                                  keepClosingSlash: true,
                                  minifyJS: true,
                                  minifyCSS: true,
                                  minifyURLs: true,
                              },
                          }
                        : undefined,
                ),
            )

            webpackConfig.plugins = replacePlugin(
                webpackConfig.plugins,
                (name) => /HtmlWebpackPlugin/i.test(name),
                indexHtmlPlugin,
            )

            webpackConfig.plugins.push(
                new HtmlWebpackPlugin(
                    Object.assign(
                        {},
                        {
                            filename: 'download.html',
                            inject: true,
                            template: resolveApp('public/download.html'),
                            chunks: ['download'],
                        },
                        isEnvProduction
                            ? {
                                  minify: {
                                      removeComments: true,
                                      collapseWhitespace: true,
                                      removeRedundantAttributes: true,
                                      useShortDoctype: true,
                                      removeEmptyAttributes: true,
                                      removeStyleLinkTypeAttributes: true,
                                      keepClosingSlash: true,
                                      minifyJS: true,
                                      minifyCSS: true,
                                      minifyURLs: true,
                                  },
                              }
                            : undefined,
                    ),
                ),
            )

            const publicPath = isEnvProduction ? paths.servedPath : isEnvDevelopment && '/'

            const multiEntryManfiestPlugin = new ManifestPlugin({
                fileName: 'asset-manifest.json',
                publicPath: publicPath,
                generate: (seed, files, entrypoints) => {
                    const manifestFiles = files.reduce((manifest, file) => {
                        manifest[file.name] = file.path
                        return manifest
                    }, seed)

                    const entrypointFiles = {}
                    Object.keys(entrypoints).forEach((entrypoint) => {
                        entrypointFiles[entrypoint] = entrypoints[entrypoint].filter(
                            (fileName) => !fileName.endsWith('.map'),
                        )
                    })

                    return {
                        files: manifestFiles,
                        entrypoints: entrypointFiles,
                    }
                },
            })

            webpackConfig.plugins = replacePlugin(
                webpackConfig.plugins,
                (name) => /ManifestPlugin/i.test(name),
                multiEntryManfiestPlugin,
            )

            return webpackConfig
        },
    },
}
