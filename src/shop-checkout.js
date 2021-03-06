import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import '@polymer/app-route/app-route.js';
import '@polymer/iron-flex-layout/iron-flex-layout.js';
import './shop-button.js';
import './shop-common-styles.js';
import './shop-form-styles.js';
import './shop-input.js';
import './shop-select.js';
import './shop-checkbox.js';
import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';
import moment from "moment";
class ShopCheckout extends PolymerElement {
  static get template() {
    return html`
    <style include="shop-common-styles shop-button shop-form-styles shop-input shop-select shop-checkbox">

      .main-frame {
        transition: opacity 0.5s;
      }

      :host([waiting]) .main-frame {
        opacity: 0.1;
      }

      shop-input, shop-select {
        font-size: 16px;
      }

      shop-select {
        margin-bottom: 20px;
      }

      paper-spinner-lite {
        position: fixed;
        top: calc(50% - 14px);
        left: calc(50% - 14px);
      }

      .billing-address-picker {
        margin: 28px 0;
        height: 20px;
        @apply --layout-horizontal;
      }

      .billing-address-picker > label {
        margin-left: 12px;
      }

      .grid {
        margin-top: 40px;
        @apply --layout-horizontal;
      }

      .grid > section {
        @apply --layout-flex;
      }

      .grid > section:not(:first-child) {
        margin-left: 80px;
      }

      .row {
        @apply --layout-horizontal;
        @apply --layout-end;
      }

      .column {
        @apply --layout-vertical;
      }

      .row > .flex,
      .input-row > * {
        @apply --layout-flex;
      }

      .input-row > *:not(:first-child) {
        margin-left: 8px;
      }

      .shop-select-label {
        line-height: 20px;
      }

      .order-summary-row {
        line-height: 24px;
      }

      .total-row {
        font-weight: 500;
        margin: 30px 0;
      }

      @media (max-width: 767px) {

        .grid {
          display: block;
          margin-top: 0;
        }

        .grid > section:not(:first-child) {
          margin-left: 0;
        }

      } 
    </style>
    <div class="main-frame">
      <iron-pages id="pages" selected="[[state]]" attr-for-selected="state">
        <div state="init">
          <iron-form id="checkoutForm"
              on-iron-form-response="_didReceiveResponse"
              on-iron-form-presubmit="_willSendRequest">
            <form method="post" action="data/sample_success_response.json" enctype="application/x-www-form-urlencoded">

              <div class="subsection" visible$="[[!_hasItems]]">
                <p class="empty-cart">???????? ?????? <iron-icon icon="shopping-cart"></iron-icon> ???????? ??????.</p>
              </div>

              <header class="subsection" visible$="[[_hasItems]]">
                <h1>????????????</h1>
                <span>?????????? ?????? ?????? ???? ???? ?????? ???? ????????</span>
              </header>

              <div class="subsection grid" visible$="[[_hasItems]]">
                <section>
                  <h2 id="accountInfoHeading">?????????????? ???????? ???????? ????????????</h2>
<!--                  <div class="row input-row">
                    <shop-input>
                      <input type="email" id="accountEmail" name="accountEmail"
                          placeholder="??????????" autofocus required
                          aria-labelledby="accountEmailLabel accountInfoHeading">
                      <shop-md-decorator error-message="?????????? ????????????" aria-hidden="true">
                        <label id="accountEmailLabel">??????????</label>
                        <shop-underline></shop-underline>
                      </shop-md-decorator>
                    </shop-input>
                  </div>-->
                  <div class="row input-row">
                    <shop-input>
                      <input type="tel" id="name" name="name" 
                          placeholder="?????? ?? ?????? ????????????????" required
                          aria-labelledby="accountPhoneLabel accountInfoHeading">
                      <shop-md-decorator error-message="?????? ?? ?????? ????????????????" aria-hidden="true">
                        <label id="accountPhoneLabel">?????? ?? ?????? ????????????????</label>
                        <shop-underline></shop-underline>
                      </shop-md-decorator>
                    </shop-input>
                  </div>
                  <div class="row input-row">
                    <shop-input>
                      <input type="tel" id="accountPhone" name="accountPhone" pattern="\\d{10,}"
                          placeholder="?????????? ????????" required
                          aria-labelledby="accountPhoneLabel accountInfoHeading">
                      <shop-md-decorator error-message="?????????? ???????? ????????????" aria-hidden="true">
                        <label id="accountPhoneLabel">?????????? ????????</label>
                        <shop-underline></shop-underline>
                      </shop-md-decorator>
                    </shop-input>
                  </div>
                 <h2 id="shipAddressHeading">???????? ?????? ?????????? ??????????</h2>
                  <div class="row input-row">
                    <shop-input>
                      <input type="text" id="shipAddress" name="shipAddress" pattern=".{5,}"
                          placeholder="????????" required
                          aria-labelledby="shipAddressLabel shipAddressHeading">
                      <shop-md-decorator error-message="???????? ????????????" aria-hidden="true">
                        <label id="shipAddressLabel">????????</label>
                        <shop-underline></shop-underline>
                      </shop-md-decorator>
                    </shop-input>
                  </div>
<!--                  <div class="row input-row">
                    <shop-input>
                      <input type="text" id="shipCity" name="shipCity" pattern=".{2,}"
                          placeholder="??????" required
                          aria-labelledby="shipCityLabel shipAddressHeading">
                      <shop-md-decorator error-message="?????? ???????? ?????? ???????? ????????" aria-hidden="true">
                        <label id="shipCityLabel">??????</label>
                        <shop-underline></shop-underline>
                      </shop-md-decorator>
                    </shop-input>
                  </div>-->
                  <!--<div class="row input-row">
                    <shop-input>
                      <input type="text" id="shipState" name="??????????" pattern=".{2,}"
                          placeholder="??????????" required
                          aria-labelledby="shipStateLabel shipAddressHeading">
                      <shop-md-decorator error-message="?????????? ???????? ?????? ???????? ????????" aria-hidden="true">
                        <label id="shipStateLabel">??????????</label>
                        <shop-underline></shop-underline>
                      </shop-md-decorator>
                    </shop-input>
                    <shop-input>
                      <input type="text" id="shipZip" name="shipZip" pattern=".{4,}"
                          placeholder="???????????? ?????? ??????????" required
                          aria-labelledby="shipZipLabel shipAddressHeading">
                      <shop-md-decorator error-message="???????????? ????????????" aria-hidden="true">
                        <label id="shipZipLabel">???? ???????? ?????? ??????????</label>
                        <shop-underline></shop-underline>
                      </shop-md-decorator>
                    </shop-input>
                  </div>-->
                  <!--<div class="column">
                    <label id="shipCountryLabel" class="shop-select-label">????????</label>
                    <shop-select>
                      <select style="font-family: 'B Nazanin'" id="shipCountry" name="????????" required
                          aria-labelledby="shipCountryLabel shipAddressHeading">
                        <option style="font-family: 'B Nazanin'" value="US" selected>??????????</option>
                        <option style="font-family: 'B Nazanin'" value="CA">????????</option>
                      </select>
                      <shop-md-decorator aria-hidden="true">
                        <shop-underline></shop-underline>
                      </shop-md-decorator>
                    </shop-select>
                  </div>
                  <h2 id="billAddressHeading">???????? ????????????</h2>-->
                  <!--<div class="billing-address-picker">
                    <shop-checkbox>
                      <input type="checkbox" id="setBilling" name="setBilling"
                          checked$="[[hasBillingAddress]]" on-change="_toggleBillingAddress">
                      <shop-md-decorator></shop-md-decorator aria-hidden="true">
                    </shop-checkbox>
                    <label for="setBilling">?????????? ???????? ???????? ?????? ???????????? ???? ??????</label>
                  </div>
                  <div hidden$="[[!hasBillingAddress]]">
                    <div class="row input-row">
                      <shop-input>
                        <input type="text" id="billAddress" name="billAddress" pattern=".{5,}"
                            placeholder="????????" required$="[[hasBillingAddress]]"
                            autocomplete="billing street-address"
                            aria-labelledby="billAddressLabel billAddressHeading">
                        <shop-md-decorator error-message="???????? ????????????" aria-hidden="true">
                          <label id="billAddressLabel">????????</label>
                          <shop-underline></shop-underline>
                        </shop-md-decorator>
                      </shop-input>
                    </div>
                    <div class="row input-row">
                      <shop-input>
                        <input type="text" id="billCity" name="billCity" pattern=".{2,}"
                            placeholder="??????" required$="[[hasBillingAddress]]"
                            autocomplete="billing address-level2"
                            aria-labelledby="billCityLabel billAddressHeading">
                        <shop-md-decorator error-message="?????? ???????? ?????? ???????? ????????" aria-hidden="true">
                          <label id="billCityLabel">??????</label>
                          <shop-underline></shop-underline>
                        </shop-md-decorator>
                      </shop-input>
                    </div>
                    <div class="row input-row">
                      <shop-input>
                        <input type="text" id="billState" name="billState" pattern=".{2,}"
                            placeholder="??????????" required$="[[hasBillingAddress]]"
                            autocomplete="billing address-level1"
                            aria-labelledby="billStateLabel billAddressHeading">
                        <shop-md-decorator error-message="?????????? ???????? ?????? ???????? ????????" aria-hidden="true">
                          <label id="billStateLabel">??????????</label>
                          <shop-underline></shop-underline>
                        </shop-md-decorator>
                      </shop-input>
                      <shop-input>
                        <input type="text" id="billZip" name="billZip" pattern=".{4,}"
                            placeholder="???? ????????" required$="[[hasBillingAddress]]"
                            autocomplete="billing postal-code"
                            aria-labelledby="billZipLabel billAddressHeading">
                        <shop-md-decorator error-message="???? ???????? ????????????" aria-hidden="true">
                          <label id="billZipLabel">???? ????????</label>
                          <shop-underline></shop-underline>
                        </shop-md-decorator>
                      </shop-input>
                    </div>
                    <div class="column">
                      <label id="billCountryLabel" class="shop-select-label">????????</label>
                      <shop-select>
                        <select style="font-family: 'B Nazanin'" id="billCountry" name="????????" required$="[[hasBillingAddress]]"
                            autocomplete="billing country"
                            aria-labelledby="billCountryLabel billAddressHeading">
                          <option value="US" selected style="font-family: 'B Nazanin'">??????????</option>
                          <option value="CA" style="font-family: 'B Nazanin'">????????</option>
                        </select>
                        <shop-md-decorator aria-hidden="true">
                          <shop-underline></shop-underline>
                        </shop-md-decorator>
                      </shop-select>
                    </div>
                  </div>-->
                </section>

                <section>
                  <h2>???????????? ?????? ????????????</h2>
                  <div class="row input-row">
                    <div class="column">
                      <label for="ccPaymentMethod">?????? ????????????</label>
                      <shop-select>
                        <select style="font-family: 'B Nazanin'" id="ccPaymentMethodd" class="ccPaymentMethod" name="ccPaymentMethod" required
                             autocomplete="cc-exp-month" aria-label="Expiry month">
                          <option style="font-family: 'B Nazanin'" value="01" selected>?????????? ???????? ?????????? ?????? ???????????? ??????????</option>
                          <option style="font-family: 'B Nazanin'" value="02">???????????? ???????????? ?? ???????????? ???????? ???????????? ??????</option>
                        </select>
                        <shop-md-decorator aria-hidden="true">
                          <shop-underline></shop-underline>
                        </shop-md-decorator>
                      </shop-select>
                      <div  class="row order-summary-row">
                   <shop-button responsive id="Link1Box">
                    <input style="font-family: 'B Nazanin'" type="button" on-click="_linkAlPyk" value="?????????? ???? ???????? ????????????">
                  </shop-button>                      
                  <shop-button responsive id="Link2Box">
                    <input style="font-family: 'B Nazanin'" type="button" on-click="_linkSnpBx" value="?????????? ???? ???????? ???????? ????????">
                  </shop-button>
</div>


                    </div>                    
                  </div>
                  <h2 style="color: crimson">???? ???????????? ?????? ???????? ?????????????? ?????? ???? ?????? ???????? ???????? ???? ?????? ?????????? ???? ???????? ?? ?????????? ?????? ???? ???????? ?????????? ???? ???????????? ???? ?????? ?????????????? ?????????? ???? ??????.</h2>
                  <h2 style="color: crimson">???? ???????????? ?????? ?????? ?????????? ?????????? ???? ???? ???????? ???????????? ???????????? ???? ???????? ?? ???? ?????????? ?????? ???????????? ???? ???????? ???????? ?? ?????????????? ???????????????? ???? ???????????? ???? ????????.
                  <h2>?????????? ??????????</h2>
                  <dom-repeat items="[[cart]]" as="entry">
                    <template>
                      <div  class="row order-summary-row">
                        <div id="orderr" class="flex">[[entry.item.title]]</div>
                        <div>[[_getEntryTotal(entry)]]</div>
                      </div>
                    </template>
                  </dom-repeat>
                  <div class="row total-row">
                    <div class="flex">??????????</div>
                    <div id="price">[[_formatPrice(total)]]</div>
                  </div>
                  <shop-button responsive id="submitBox">
                    <input style="font-family: 'B Nazanin'" type="button" on-click="_submit" value="????????????">
                  </shop-button>
                </section>
              </div>
            </form>
          </iron-form>
        </div>
        
        <!-- Success message UI -->
        <header state="success">
          <h1>???? ?????? ??????????????</h1>
          <p>[[response.successMessage]]</p>
          <shop-button responsive>
            <a href="/">??????????</a>
          </shop-button>
        </header>

        <!-- Error message UI -->
        <header state="error">
          <h1>We couldn&acute;t process your order</h1>
          <p id="errorMessage">[[response.errorMessage]]</p>
          <shop-button responsive>
            <a href="/checkout">?????? ????????????</a>
          </shop-button>
        </header>

      </iron-pages>

    </div>




    <!-- Handles the routing for the success and error subroutes -->
    <app-route
        active="{{routeActive}}"
        data="{{routeData}}"
        route="[[route]]"
        pattern="/:state">
     </app-route>

    <!-- Show spinner when waiting for the server to repond -->
    <paper-spinner-lite active="[[waiting]]"></paper-spinner-lite>
    `;
  }
  static get is() { return 'shop-checkout'; }

  static get properties() { return {

    /**
     * The route for the state. e.g. `success` and `error` are mounted in the
     * `checkout/` route.
     */
    route: {
      type: Object,
      notify: true
    },

    /**
     * The total price of the contents in the user's cart.
     */
    total: Number,

    /**
     * The state of the form. Valid values are:
     * `init`, `success` and `error`.
     */
    state: {
      type: String,
      value: 'init'
    },

    /**
     * An array containing the items in the cart.
     */
    cart: Array,

    /**
     * The server's response.
     */
    response: Object,

    /**
     * If true, the user must enter a billing address.
     */
    hasBillingAddress: {
      type: Boolean,
      value: false
    },

    /**
     * If true, shop-checkout is currently visible on the screen.
     */
    visible: {
      type: Boolean,
      observer: '_visibleChanged'
    },

    /**
     * True when waiting for the server to repond.
     */
    waiting: {
      type: Boolean,
      readOnly: true,
      reflectToAttribute: true
    },

    /**
     * True when waiting for the server to repond.
     */
    _hasItems: {
      type: Boolean,
      computed: '_computeHasItem(cart.length)'
    }

  }}

  static get observers() { return [
    '_updateState(routeActive, routeData)'
  ]}
    _linkAlPyk(e) {
        window.open(
            "https://alopeyk.ir/", "_blank");
  }
    _linkSnpBx(e) {
        window.open(
            "https://snapp-box.com/", "_blank");
    }



   _submit(e) {
    if (this._validateForm()) {




       // To send the form data to the server:
      // 2) Remove the code below.
      // 3) Uncomment `this.$.checkoutForm.submit()`.

      // this.$.checkoutForm.dispatchEvent(new CustomEvent('iron-form-presubmit', {
      //   composed: true}));

      // this._submitFormDebouncer = Debouncer.debounce(this._submitFormDebouncer,
      //   timeOut.after(1000), () => {
      //     this.$.checkoutForm.dispatchEvent(new CustomEvent('iron-form-response', {
      //       composed: true, detail: {
      //         response: {
      //           success: 1,
      //           successMessage: 'Demo checkout process complete.'
      //         }
      //       }}));
      //   });



      // Find our form in the DOM using its class name.
// Get the form data with our (yet to be defined) function.

// Do something with the email address.
     /*alert(data.email);*/
      const config = {
        apiKey: "YOUR API KEY",
        authDomain: "at-golnush.firebaseapp.com",
        databaseURL: "https://at-golnush.firebaseio.com",
        storageBucket: "bucket.appspot.com"
      };
      firebase.initializeApp(config);

      // Get a reference to the database service
      const database = firebase.database();
      let opt;
      for ( let i = 0, len = this.$.ccPaymentMethodd.options.length; i < len; i++ ) {
        opt = this.$.ccPaymentMethodd.options[i];
        if ( opt.selected === true ) {
          break;
        }
      }
      firebase.database().ref('orders/').push({
        name: this.$.name.value,
        mobile: this.$.accountPhone.value,
        address: this.$.shipAddress.value,
        price: this.$.price.textContent,
        order: this.shadowRoot.querySelector('#orderr').textContent,
        ccPaymentMethod: opt.textContent,
        created: moment().format('YYYY-MM-DD, HH:mm:ss')
      });

      this.$.checkoutForm.submit();
       alert('OK');

    }
  }

  /**
   * Sets the valid state and updates the location.
   */
  _pushState(state) {
    this._validState = state;
    this.set('route.path', state);
  }

  /**
   * Checks that the `:state` subroute is correct. That is, the state has been pushed
   * after receiving response from the server. e.g. Users can only go to `/checkout/success`
   * if the server responsed with a success message.
   */
  _updateState(active, routeData) {
    if (active && routeData) {
      let state = routeData.state;
      if (this._validState === state) {
        this.state = state;
        this._validState = '';
        return;
      }
    }
    this.state = 'init';
  }

  /**
   * Sets the initial state.
   */
  _reset() {
    let form = this.$.checkoutForm;

    this._setWaiting(false);
    form.reset && form.reset();

    let nativeForm = form._form;
    if (!nativeForm) {
      return;
    }

    // Remove the `aria-invalid` attribute from the form inputs.
    for (let el, i = 0; el = nativeForm.elements[i], i < nativeForm.elements.length; i++) {
      el.removeAttribute('aria-invalid');
    }
  }

  /**
   * Validates the form's inputs and adds the `aria-invalid` attribute to the inputs
   * that don't match the pattern specified in the markup.
   */
  _validateForm() {
    let form = this.$.checkoutForm;
    let firstInvalid = false;
    let nativeForm = form._form;

    for (let el, i = 0; el = nativeForm.elements[i], i < nativeForm.elements.length; i++) {
      if (el.checkValidity()) {
        el.removeAttribute('aria-invalid');
      } else {
        if (!firstInvalid) {
          // announce error message
          if (el.nextElementSibling) {
            this.dispatchEvent(new CustomEvent('announce', {bubbles: true, composed: true,
              detail: el.nextElementSibling.getAttribute('error-message')}));
          }
          if (el.scrollIntoViewIfNeeded) {
            // safari, chrome
            el.scrollIntoViewIfNeeded();
          } else {
            // firefox, edge, ie
            el.scrollIntoView(false);
          }
          el.focus();
          firstInvalid = true;
        }
        el.setAttribute('aria-invalid', 'true');
      }
    }
    return !firstInvalid;
  }

  /**
   * Adds the cart data to the payload that will be sent to the server
   * and updates the UI to reflect the waiting state.
   */
  _willSendRequest(e) {
    let form = e.target;
    let body = form.request && form.request.body;

    this._setWaiting(true);

    if (!body) {
      return;
    }
    // Populate the request body where `cartItemsId[i]` is the ID and `cartItemsQuantity[i]`
    // is the quantity for some item `i`.
    body.cartItemsId = [];
    body.cartItemsQuantity = [];

    this.cart.forEach((cartItem) => {
      body.cartItemsId.push(cartItem.item.name);
      body.cartItemsQuantity.push(cartItem.quantity);
    });
  }

  /**
   * Handles the response from the server by checking the response status
   * and transitioning to the success or error UI.
   */
  _didReceiveResponse(e) {
    let response = e.detail.response;

    this.response = response;
    this._setWaiting(true);

    if (response.success) {
      this._pushState('success');
      this._reset();
      this.dispatchEvent(new CustomEvent('clear-cart', {bubbles: true, composed: true}));
    } else {
      this._pushState('error');
    }
  }

  _toggleBillingAddress(e) {
    this.hasBillingAddress = e.target.checked;

    if (this.hasBillingAddress) {
      this.$.billAddress.focus();
    }
  }

  _computeHasItem(cartLength) {
    return cartLength > 0;
  }

  _formatPrice(total) {
    return isNaN(total) ? '' : total.toFixed(0)+' ???????? '  ;
  }

  _getEntryTotal(entry) {
    return this._formatPrice(entry.quantity * entry.item.price);
  }

  _visibleChanged(visible) {
    if (!visible) {
      return;
    }
    // Reset the UI states
    this._reset();
    // Notify the page's title
    this.dispatchEvent(new CustomEvent('change-section', {
      bubbles: true, composed: true, detail: { title: 'Checkout' }}));
  }

}

customElements.define(ShopCheckout.is, ShopCheckout);
