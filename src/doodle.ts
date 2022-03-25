import {LitElement, html, PropertyValues} from 'lit';
import { customElement, property, query, state } from 'lit/decorators.js';
import style from './doodle.css';
import 'prismjs';
import 'shader-doodle';
import 'lit-code';
import { shaders, createShaderHTML } from "./shaders";

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

    @query('#fragment')
    protected fragmentCodeEditorEl;

    @query('#vertex')
    protected vertexCodeEditorEl;

    @query('#shader-doodle-container')
    protected shaderDoodleContainerEl;

    @query('shader-doodle')
    protected shaderDoodleEl;

    @property({ type: String })
    protected textColor: string = '#000000';

    protected text: string = 'Shader Doodle!';

    @state()
    protected framesToRecord: number = 10;

    @state()
    protected millisecondsBetweenFrames: number = 500;

    /**
     * normally, an object wouldn't be a good idea here for "currentShader",
     * but since we are replacing the entire object with any update (and not setting a property)
     * this seems to work pretty well
     */
    @state()
    protected currentShader = shaders[0];

    protected firstUpdated(_changedProperties: PropertyValues) {
        super.firstUpdated(_changedProperties);
        this.shaderUpdate(this.currentShader);
    }

    protected shaderUpdate(shader) {
        this.fragmentCodeEditorEl?.setCode(shader.fragment);
        this.vertexCodeEditorEl?.setCode(shader.vertex);
        this.shaderDoodleContainerEl.innerHTML = '';
        this.shaderDoodleContainerEl.innerHTML = createShaderHTML(shader);
    }

    protected recordGIF() {
        alert('Record GIF')
    }

    render() {
        return html`
            <sp-theme scale="medium" color="dark">
                <div class="main-column left">
                    <div id="canvas">
                        <div id="shader-doodle-container"></div>
                        <div id="textEditor" style="color: ${this.textColor}; pointer-events: none" contenteditable @input=${(event) => { this.text = event.target.innerText; }}>${this.text}</div>
                    </div>
                    <div id="record-settings">
                        <div class="text-color">
                            <sp-field-label>Text Overlay Color</sp-field-label>
                            <sp-color-area @input=${(event) => { this.textColor = event.target.color }} color=${this.textColor}></sp-color-area>
                            <sp-color-slider @input=${(event) => { this.textColor = event.target.color }} color=${this.textColor}></sp-color-slider>
                        </div>
                        <div>
                            <sp-slider
                                value=${this.framesToRecord}
                                @input=${(event) => { this.framesToRecord = event.target.value }}
                                label="Number of frames"
                                variant="tick"
                                min="1"
                                max="20"
                                tick-step="1"
                            ></sp-slider>
                            <sp-slider
                                label="Milliseconds between frames"
                                value=${this.millisecondsBetweenFrames}
                                @input=${(event) => { this.millisecondsBetweenFrames = event.target.value }}
                                variant="tick"
                                tick-step="100"
                                min="100"
                                max="2000"
                            ></sp-slider>
                            <sp-field-label>Will record ${this.framesToRecord} frames at a rate of ${this.millisecondsBetweenFrames/1000} per second</sp-field-label>
                            <sp-button @click=${() => this.recordGIF()}>Record and Save GIF</sp-button>
                        </div>
                    </div>
                </div>
                <div class="main-column right">
                    <div id="shader-control-header">
                        <div>
                            <sp-field-label>Sample shaders</sp-field-label>
                            <sp-picker value=${this.currentShader.id} label="Custom" @change=${(event) => {
                                this.currentShader = shaders.find((shader) => event.target.value == shader.id);
                                this.shaderUpdate(this.currentShader);
                            }}>
                                ${shaders.map((shader) => {
                                    return html`<sp-menu-item value=${shader.id}>${shader.name}</sp-menu-item>`
                                })}
                            </sp-picker>
                        </div>
    
                        <div>
                            <sp-field-label>Sample textures</sp-field-label>
                            <sp-picker value=${this.currentShader.texture || 'No texture'} @change=${(event) => {
                                this.currentShader = Object.assign({}, this.currentShader);
                                this.currentShader.texture = event.target.value;
                                this.shaderUpdate(this.currentShader);
                            }}>
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
                                })}\`;
                            </sp-picker>
                        </div>
                        <div>
                            <sp-field-label>ShaderToy style?</sp-field-label>
                            <sp-switch @change=${(event) => {
                                this.currentShader = Object.assign({}, this.currentShader);
                                this.currentShader.isShaderToy = event.target.checked;
                                this.shaderUpdate(this.currentShader);
                            }} ?checked=${this.currentShader.isShaderToy}></sp-switch>
                        </div>
                    </div>

                    <sp-divider></sp-divider>
                    
                    <sp-field-label>Shader editors</sp-field-label>
                    <div id="accordion-container">
                    <sp-accordion allow-multiple>
                        <sp-accordion-item open label="Fragment Shader">
                            <lit-code id="fragment" language="js" linenumbers @update=${
                                    ({detail: code}) => {
                                        if (code !== this.currentShader.fragment) {
                                            // Make a copy of the current shader
                                            this.currentShader = Object.assign({}, this.currentShader);
                                            this.currentShader.name = 'Custom';
                                            this.currentShader.id = -1;
                                            this.currentShader.fragment = code;
                                        }
                                    }
                            }></lit-code>
                        </sp-accordion-item>
                        <sp-accordion-item label="Vertex Shader">
                            <lit-code id="vertex" language="js" linenumbers @update=${
                                    ({detail: code}) => {
                                        if (code !== this.currentShader.vertex) {
                                            // Make a copy of the current shader
                                            this.currentShader = Object.assign({}, this.currentShader);
                                            this.currentShader.name = 'Custom';
                                            this.currentShader.id = -1;
                                            this.currentShader.vertex = code;
                                        }
                                    }
                            }></lit-code>
                        </sp-accordion-item>
                    </sp-accordion>
                    <div id="shader-control-footer">
                        <sp-button @click=${() => {
                            this.shaderUpdate(this.currentShader);
                        }}>Reload my shader</sp-button>
                    </div>
                </div>
            </sp-theme>`;
    }
}
