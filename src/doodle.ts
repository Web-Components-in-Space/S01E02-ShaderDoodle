import { LitElement, html } from 'lit';
import { customElement } from 'lit/decorators.js';
import {unsafeHTML} from 'lit/directives/unsafe-html.js';
import style from './doodle.css';
import 'prismjs';
import 'shader-doodle';
import 'lit-code';
import { GRADIENT } from "./shaders";

import '@spectrum-web-components/theme/sp-theme';
import '@spectrum-web-components/theme/theme-dark';
import '@spectrum-web-components/theme/scale-medium';
import '@spectrum-web-components/picker/sp-picker';
import '@spectrum-web-components/menu/sp-menu-item';
import '@spectrum-web-components/button/sp-button';
import '@spectrum-web-components/accordion/sp-accordion';
import '@spectrum-web-components/accordion/sp-accordion-item';
import '@spectrum-web-components/field-label/sp-field-label';
import '@spectrum-web-components/divider/sp-divider';
import '@spectrum-web-components/switch/sp-switch';
import '@spectrum-web-components/slider/sp-slider';
import '@spectrum-web-components/color-area/sp-color-area';
import '@spectrum-web-components/color-slider/sp-color-slider';


@customElement('doodle-app')
export class Doodle extends LitElement {
    static get styles() { return [style]; }

    render() {
        return html`
            <sp-theme scale="medium" color="dark">
                <div class="main-column left">
                    <div id="canvas">
                        <div id="shader-doodle-container">
                            <shader-doodle>
                                <script type="x-shader/x-fragment">
                                    ${GRADIENT.fragment}
                                </script>
                            </shader-doodle>
                        </div>
                        <div id="textEditor" contenteditable>Some text</div>
                    </div>
                    <div id="record-settings">
                        <div class="text-color">
                            <sp-field-label>Text Overlay Color</sp-field-label>
                            <sp-color-area></sp-color-area>
                            <sp-color-slider></sp-color-slider>
                        </div>
                        <div>
                            <sp-slider
                                label="Number of frames"
                                variant="tick"
                                min="1"
                                max="20"
                                tick-step="1"
                            ></sp-slider>
                            <sp-slider
                                label="Milliseconds between frames"
                                variant="tick"
                                tick-step="100"
                                min="100"
                                max="2000"
                            ></sp-slider>
                            <sp-field-label>Will record x frames at a rate of x per second</sp-field-label>
                        </div>
                    </div>

                    <sp-button>Record and Save GIF</sp-button>
                </div>
                <div class="main-column right">
                    <div id="shader-control-header">
                        <div>
                            <sp-field-label>Sample shaders</sp-field-label>
                            <sp-picker label="Custom"></sp-picker>
                        </div>
    
                        <div>
                            <sp-field-label>Sample textures</sp-field-label>
                            <sp-picker>
                                <sp-menu-item value="No texture">No Texture</sp-menu-item>
                                ${[
                                    'My Webcam',
                                    'challenger.jpg',
                                    'christopher_kraft.jpg',
                                    'jupiterspot.jpg',
                                    'reddwarf.jpg',
                                    'some video.mp4',    
                                ].map(photo => {
                                    return html`<sp-menu-item value=${photo}>${photo}</sp-menu-item>`
                                })};
                            </sp-picker>
                        </div>
                        <div>
                            <sp-field-label>ShaderToy style?</sp-field-label>
                            <sp-switch></sp-switch>
                        </div>
                    </div>

                    <sp-divider></sp-divider>
                    
                    <sp-field-label>Shader editors</sp-field-label>
                    <div id="accordion-container">
                        <sp-accordion allow-multiple>
                            <sp-accordion-item open label="Fragment Shader">
                                <lit-code id="fragment" language="js" linenumbers code=${GRADIENT.fragment}></lit-code>
                            </sp-accordion-item>
                            <sp-accordion-item label="Vertex Shader">
                                <lit-code id="vertex" language="js" linenumbers code=${GRADIENT.vertex}></lit-code>
                            </sp-accordion-item>
                        </sp-accordion>
                    </div>
                    <div id="shader-control-footer">
                        <sp-button>Reload my shader</sp-button>
                    </div>
                </div>
            </sp-theme>`;
    }
}
