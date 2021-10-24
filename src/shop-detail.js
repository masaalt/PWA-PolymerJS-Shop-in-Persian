import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import '@polymer/app-route/app-route.js';
import '@polymer/iron-flex-layout/iron-flex-layout.js';
import './shop-button.js';
import './shop-category-data.js';
import './shop-common-styles.js';
import './shop-image.js';
import './shop-select.js';
import { Debouncer } from '@polymer/polymer/lib/utils/debounce.js';
import { microTask } from '@polymer/polymer/lib/utils/async.js';

class ShopDetail extends PolymerElement {
  static get template() {
    return html`
    <style include="shop-common-styles shop-button shop-select">

      :host {
        display: block;
      }

      #content {
        @apply --layout-horizontal;
        @apply --layout-center-justified;
      }

      shop-image {
        position: relative;
        margin: 64px 32px;
        width: 50%;
        max-width: 600px;
        --shop-image-img: {
          @apply --layout-fit;
        };
      }

      shop-image::before {
        content: "";
        display: block;
        padding-top: 100%;
      }

      .detail {
        margin: 64px 32px;
        width: 50%;
        max-width: 400px;
        transition: opacity 0.4s;
        opacity: 0;
      }

      .detail[has-content] {
        opacity: 1;
      }

      h1 {
        font-size: 24px;
        font-weight: 500;
        line-height: 28px;
        margin: 0;
      }

      .price {
        margin: 16px 0 40px;
        font-size: 16px;
        color: var(--app-secondary-color);
      }

      .description {
        margin: 32px 0;
      }

      .description > h2 {
        margin: 16px 0;
        font-size: 13px;
      }

      .description > p {
        margin: 0;
        color: var(--app-secondary-color);
      }

      .pickers {
        @apply --layout-vertical;
        border-top: 1px solid #ccc;
      }

      shop-select > select {
        font-size: 16px;
        padding: 16px 24px 16px 70px;
      }

      @media (max-width: 767px) {

        #content {
          @apply --layout-vertical;
          @apply --layout-center;
        }

        shop-image {
          margin: 0;
          width: 80%;
        }

        .detail {
          box-sizing: border-box;
          margin: 32px 0;
          padding: 0 24px;
          width: 100%;
          max-width: 600px;
        }

        h1 {
          font-size: 20px;
          line-height: 24px;
        }

        .price {
          font-size: inherit;
          margin: 12px 0 32px;
        }

      }

    </style>

    <!--
      app-route provides the name of the category and the item.
    -->
    <app-route
        route="[[route]]"
        pattern="/:category/:item"
        data="{{routeData}}"></app-route>

    <!--
      shop-category-data provides the item data for a given category and item name.
    -->
    <shop-category-data
        id="categoryData"
        category-name="[[routeData.category]]"
        item-name="[[routeData.item]]"
        item="{{item}}"
        failure="{{failure}}"></shop-category-data>
    <div id="content" hidden$="[[failure]]">
      <shop-image alt="[[item.title]]" src="[[item.largeImage]]"></shop-image>
      <div class="detail" has-content$="[[_isDefined(item)]]">
        <h1>[[item.title]]</h1>
        <div class="price">[[_formatPrice(item.price)]]</div>
        <div class="pickers">
          <shop-select>
            <label id="quantityLabel" prefix>تعداد</label>
            <select style="font-family: 'B Nazanin'" id="quantitySelect" aria-labelledby="quantityLabel">
              <option style="font-family: 'B Nazanin'" value="1" selected>1 </option>
              <option style="font-family: 'B Nazanin'" value="2">2 </option>
              <option style="font-family: 'B Nazanin'" value="3">3 </option>
              <option style="font-family: 'B Nazanin'" value="4">4 </option>
              <option style="font-family: 'B Nazanin'" value="5">5 </option>
            </select>
            <shop-md-decorator aria-hidden="true">
              <shop-underline></shop-underline>
            </shop-md-decorator>
          </shop-select>
        </div>
        <div class="description">
          <h2>بیشتر</h2>
          <href id="desc"></href>
            <a href="https://www.bing.com/search?q=[[item.title]]"  target="_blank">پژوهش در منابع</a>
        </div>
        <shop-button responsive>
          <button on-click="_addToCart" aria-label="Add this item to cart" style="font-family: 'B Nazanin'">اضافه کردن به سبد</button>
        </shop-button>
      </div>
    </div>

    <!--
      shop-network-warning shows a warning message when the items can't be rendered due
      to network conditions.
    -->
    <shop-network-warning
        hidden$="[[!failure]]"
        offline="[[offline]]"
        on-try-reconnect="_tryReconnect"></shop-network-warning>
    `;

  }

  static get is() { return 'shop-detail'; }

  static get properties() { return {

    item: Object,

    route: Object,

    routeData: Object,

    visible: {
      type: Boolean,
      value: false
    },

    offline: {
      type: Boolean,
      observer: '_offlineChanged'
    },

    failure: Boolean

  }}

  static get observers() { return [
    '_itemChanged(item, visible)'
  ]}

  _itemChanged(item, visible) {
    if (visible) {
      this._itemChangeDebouncer = Debouncer.debounce(this._itemChangeDebouncer,
        microTask, () => {
          // The item description contains escaped HTML (e.g. "&lt;br&gt;"), so we need to
          // unescape it ("<br>") and set it as innerHTML.
          let text = item ? item.description : '';
          this.$.desc.innerHTML = this._unescapeText(text);

          // Reset the select menus.
          this.$.quantitySelect.value = '1';

          this.dispatchEvent(new CustomEvent('change-section', {
            bubbles: true, composed: true, detail: {
              category: item ? item.category : '',
              title: item ? item.title : '',
              description: item ? item.description.substring(0, 100) : '',
              image: item ? this.baseURI + item.image : ''
            }}));
        })
    }
  }

  _unescapeText(text) {
    let elem = document.createElement('textarea');
    elem.innerHTML = text;
    return elem.textContent;
  }

  _formatPrice(price) {
    return price ? price.toFixed(0)+' ریال '   : '';
  }

  _addToCart() {
    // This event will be handled by shop-app.
    this.dispatchEvent(new CustomEvent('add-cart-item', {
      bubbles: true, composed: true, detail: {
        item: this.item,
        quantity: parseInt(this.$.quantitySelect.value, 10)
      }}));
  }

  _isDefined(item) {
    return item != null;
  }

  _tryReconnect() {
    this.$.categoryData.refresh();
  }

  _offlineChanged(offline) {
    if (!offline) {
      this._tryReconnect();
    }
  }

}

customElements.define(ShopDetail.is, ShopDetail);