import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import '@polymer/iron-icon/iron-icon.js';
import './shop-button.js';
import './shop-icons.js';

class ShopNetworkWarning extends PolymerElement {
  static get template() {
    return html`
    <style include="shop-button">

      :host {
        display: block;
        padding: 40px 20px;
        text-align: center;
        color: var(--app-secondary-color);
      }

      iron-icon {
        display: inline-block;
        width: 30px;
        height: 30px;
      }

      h1 {
        margin: 50px 0 10px 0;
        font-weight: 300;
      }

      p {
        margin: 0;
      }

      shop-button {
        margin-top: 50px;
      }

    </style>

    <div hidden\$="[[offline]]">
      <h1>دسترسی به سرور امکان پذیر نیست</h1>
    </div>
    <div hidden\$="[[!offline]]">
      <iron-icon icon="perm-scan-wifi"></iron-icon>
      <h1>دسترسی به اینترنت وجود ندارد</h1>
      <p>لطفاً وضعیت اتصال خود به اینترنت را بررسی نمایید.</p>
    </div>
    <shop-button>
      <button style="font-family: 'B Nazanin'" on-click="_tryReconnect">سعی مجدد</button>
    </shop-button>
`;
  }

  static get is() { return 'shop-network-warning'; }

  static get properties() { return {
    offline: Boolean
  }}

  _tryReconnect() {
    this.dispatchEvent(new CustomEvent('try-reconnect', {composed: true}));
  }
}

customElements.define(ShopNetworkWarning.is, ShopNetworkWarning);
