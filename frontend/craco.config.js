// craco.config.js
const path = require("path");
require("dotenv").config();

// Check if we're in development/preview mode (not production build)
// Craco sets NODE_ENV=development for start, NODE_ENV=production for build
const isDevServer = process.env.NODE_ENV !== "production";

// Environment variable overrides
const config = {
  enableHealthCheck: process.env.ENABLE_HEALTH_CHECK === "true",
};

// Conditionally load health check modules only if enabled
let WebpackHealthPlugin;
let setupHealthEndpoints;
let healthPluginInstance;

if (config.enableHealthCheck) {
  WebpackHealthPlugin = require("./plugins/health-check/webpack-health-plugin");
  setupHealthEndpoints = require("./plugins/health-check/health-endpoints");
  healthPluginInstance = new WebpackHealthPlugin();
}

let webpackConfig = {
  eslint: {
    configure: {
      extends: ["plugin:react-hooks/recommended"],
      rules: {
        "react-hooks/rules-of-hooks": "error",
        "react-hooks/exhaustive-deps": "warn",
      },
    },
  },
  webpack: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
    configure: (webpackConfig) => {

      // Add ignored patterns to reduce watched directories
        webpackConfig.watchOptions = {
          ...webpackConfig.watchOptions,
          ignored: [
            '**/node_modules/**',
            '**/.git/**',
            '**/build/**',
            '**/dist/**',
            '**/coverage/**',
            '**/public/**',
        ],
      };

      // Add health check plugin to webpack if enabled
      if (config.enableHealthCheck && healthPluginInstance) {
        webpackConfig.plugins.push(healthPluginInstance);
      }
      return webpackConfig;
    },
  },
};

webpackConfig.devServer = (devServerConfig) => {
  // Add health check endpoints if enabled
  if (config.enableHealthCheck && setupHealthEndpoints && healthPluginInstance) {
    const originalSetupMiddlewares = devServerConfig.setupMiddlewares;

    devServerConfig.setupMiddlewares = (middlewares, devServer) => {
      // Call original setup if exists
      if (originalSetupMiddlewares) {
        middlewares = originalSetupMiddlewares(middlewares, devServer);
      }

      // Setup health endpoints
      setupHealthEndpoints(devServer, healthPluginInstance);

      return middlewares;
    };
  }

  return devServerConfig;
};

// Wrap with visual edits (automatically adds babel plugin, dev server, and overlay in dev mode)
if (isDevServer) {
  try {
    const { withVisualEdits } = require("@emergentbase/visual-edits/craco");
    webpackConfig = withVisualEdits(webpackConfig);

    // ---- Patch: skip visual-edits babel-plugin for R3F (Three.js) scene files.
    // R3F treats unknown props as Three.js object paths (e.g., `x-line-number` -> `x.line-number`),
    // which collides with visual-edits' metadata attributes. Files matching the pattern below
    // are excluded from the plugin.
    const SKIP_PATTERNS = [/SakuraScene\.(jsx|tsx|js|ts)$/];
    if (Array.isArray(webpackConfig.babel?.plugins)) {
      let patched = false;
      webpackConfig.babel.plugins = webpackConfig.babel.plugins.map((p) => {
        // visual-edits exports the plugin factory as a named function
        const isInner =
          typeof p === "function" &&
          (p.name === "babelMetadataPlugin" || /MetadataPlugin/.test(p.name || ""));
        if (isInner) {
          const inner = p;
          patched = true;
          const wrapped = function visualEditsPluginWithSkip(api, opts) {
            const result = inner(api, opts);
            const origVisitor = result.visitor || {};
            const wrap = (fn) => (path, state) => {
              const fn2 =
                state.filename ||
                state.file?.opts?.filename ||
                state.file?.opts?.sourceFileName ||
                "";
              if (SKIP_PATTERNS.some((re) => re.test(fn2))) return;
              return fn(path, state);
            };
            return {
              ...result,
              visitor: Object.fromEntries(
                Object.entries(origVisitor).map(([k, v]) => [
                  k,
                  typeof v === "function" ? wrap(v) : v,
                ]),
              ),
            };
          };
          Object.defineProperty(wrapped, "name", {
            value: "babelMetadataPluginPatched",
          });
          return wrapped;
        }
        return p;
      });
      console.log(
        "[visual-edits patch] babel plugin patched for R3F files:",
        patched,
      );
    }
  } catch (err) {
    if (err.code === 'MODULE_NOT_FOUND' && err.message.includes('@emergentbase/visual-edits/craco')) {
      console.warn(
        "[visual-edits] @emergentbase/visual-edits not installed — visual editing disabled."
      );
    } else {
      throw err;
    }
  }
}

module.exports = webpackConfig;
