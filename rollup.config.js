import html from '@web/rollup-plugin-html';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import sourcemaps from 'rollup-plugin-sourcemaps';
import clean from 'rollup-plugin-clean';
import litcss from 'rollup-plugin-lit-css';
import commonjs from '@rollup/plugin-commonjs';
import nodepolyfill from 'rollup-plugin-node-polyfills';
import { prepend } from 'rollup-plugin-insert'

export default {
    input: 'index.html',
    output: {
        dir: 'dist',
        sourcemap: true,
    },
    plugins: [
        clean(),
        nodeResolve(),
        litcss(),
        prepend('var remaining, curPixel, n_bits; \n\n', { include: './node_modules/gifjs/src/LZWEncoder.js'}),
        commonjs( {
            include: ['./node_modules/gifjs/**/*.js']
        }),
        nodepolyfill(),
        sourcemaps(),
        html()
    ],
};
