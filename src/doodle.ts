import { LitElement, html } from 'lit';
import { customElement } from 'lit/decorators.js';
import style from './doodle.css';

@customElement('doodle-app')
export class Doodle extends LitElement {
    static get styles() { return [style]; }

    render() {
        return html``;
    }
}
