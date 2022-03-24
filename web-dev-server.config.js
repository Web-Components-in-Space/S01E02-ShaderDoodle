import litcss from 'rollup-plugin-lit-css';
import { fromRollup } from '@web/dev-server-rollup';

const pluginLitCSS = fromRollup(litcss);

export default {
    mimeTypes: {
        '**/*.css': 'js'
    },
    open: true,
    nodeResolve: {
        exportConditions: ['production']
    },
    plugins: [
        pluginLitCSS()
    ]
};
