const HtmlWebpackPlugin = require('html-webpack-plugin')

const allModes = [
	'eval',
	'cheap-eval-source-map',
	'cheap-module-eval-source-map',
	'eval-source-map',
	'cheap-source-map',
	'cheap-module-source-map',
	'inline-cheap-source-map',
	'inline-cheap-module-source-map',
	'source-map',
	'inline-source-map',
	'hidden-source-map',
	'nosources-source-map'
]

module.exports = allModes.map(item => {
	return {
		devtool: item,
		mode: 'none',
		entry: './src/main.js',
		output: {
			filename: `js/${item}.js`
		},
		module: {
			rules: [
				{
					test: /\.js$/,
					use: {
						// 辨别其中一类模式的差异
						loader: 'babel-loader',
						options: {
							presets: ['@babel/preset-env']
						}
					}
				}
			]
		},
		plugins: [
			// 为每一个打包任务生成一个 HTML文件
			new HtmlWebpackPlugin({
				filename: `${item}.html`
			})
		]
	}
})

// module.exports = [
// 	{
// 		entry: './src/main.js',
// 		output: {
// 			filename: 'a.js'
// 		}
// 	},
// 	{
// 		entry: './src/main.js',
// 		output: {
// 			filename: 'b.js'
// 		}
// 	}
// ]
