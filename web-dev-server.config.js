import litcss from 'rollup-plugin-lit-css';
import commonjs from '@rollup/plugin-commonjs';
import nodepolyfill from 'rollup-plugin-node-polyfills';
import { prepend } from 'rollup-plugin-insert'
import { fromRollup } from '@web/dev-server-rollup';

const pluginLitCSS = fromRollup(litcss);
const pluginCommonJS = fromRollup(commonjs);
const pluginNodePolyfill = fromRollup(nodepolyfill);
const pluginPrepend = fromRollup(prepend);

export default {
    mimeTypes: {
        '**/*.css': 'js'
    },
    open: true,
    nodeResolve: true,
    plugins: [
        pluginLitCSS(),
        pluginPrepend('var remaining, curPixel, n_bits; \n\n', { include: './node_modules/gifjs/src/LZWEncoder.js'}),
        pluginCommonJS( {
            include: ['./node_modules/gifjs/**/*.js']
        }),
        pluginNodePolyfill(),
    ]
};
