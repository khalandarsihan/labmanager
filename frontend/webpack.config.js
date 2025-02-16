// const path = require("path");

// module.exports = {
// 	entry: "./src/index.js",
// 	output: {
// 		path: path.resolve(__dirname, "../labmanager/public/js/react"),
// 		filename: "bundle.js",
// 	},
// 	module: {
// 		rules: [
// 			{
// 				test: /\.(js|jsx)$/,
// 				exclude: /node_modules/,
// 				use: {
// 					loader: "babel-loader",
// 				},
// 			},
// 			{
// 				test: /\.css$/,
// 				use: ["style-loader", "css-loader", "postcss-loader"],
// 			},
// 		],
// 	},
// 	resolve: {
// 		extensions: [".js", ".jsx"],
// 		alias: {
// 			"@": path.resolve(__dirname, "src"),
// 		},
// 	},
// 	mode: "development",
// };

const path = require("path");

module.exports = {
	entry: "./src/index.js",
	output: {
		path: path.resolve(__dirname, "../labmanager/public/js/react"),
		filename: "bundle.js",
		publicPath: "/assets/labmanager/js/react/",
	},
	module: {
		rules: [
			{
				test: /\.(js|jsx)$/,
				exclude: /node_modules/,
				use: {
					loader: "babel-loader",
				},
			},
			{
				test: /\.css$/,
				use: ["style-loader", "css-loader", "postcss-loader"],
			},
		],
	},
	resolve: {
		extensions: [".js", ".jsx"],
		alias: {
			"@": path.resolve(__dirname, "src"),
		},
	},
	mode: "development",
	// Add source maps for better debugging
	devtool: "source-map",
	// Add performance hints
	performance: {
		hints: "warning",
		maxEntrypointSize: 512000,
		maxAssetSize: 512000,
	},
	// Add optimization for development
	optimization: {
		moduleIds: "named",
		removeAvailableModules: false,
		removeEmptyChunks: false,
		splitChunks: false,
	},
	// Add environment-specific configuration
	stats: {
		colors: true,
		modules: false,
		children: false,
		chunks: false,
		chunkModules: false,
	},
};
