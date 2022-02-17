/* global axios bootstrap */

// eslint-disable-next-line
// import { createApp } from 'https://cdnjs.cloudflare.com/ajax/libs/vue/3.0.9/vue.esm-browser.js';

const { defineRule, Form, Field, ErrorMessage, configure } = VeeValidate;
const { required, email, min, max } = VeeValidateRules;
const { localize, loadLocaleFromURL } = VeeValidateI18n;

defineRule('required', required);
defineRule('email', email);
defineRule('min', min);
defineRule('max', max);

loadLocaleFromURL('https://unpkg.com/@vee-validate/i18n@4.1.0/dist/locale/zh_TW.json');

configure({
  generateMessage: localize('zh_TW'),
});

const app = Vue.createApp({
  data() {
    return {
      apiUrl: 'https://vue3-course-api.hexschool.io/v2',
      apiPath: 'maohong',
      form: {
        user: {
          name: '',
          email: '',
          tel: '',
          address: '',
        },
        message: '',
      },
      products: [],
      cartData: {
        carts: [],
      },
      productId: '',
      isLoadingItem: '',
    };
  },
  components: {
    VForm: Form,
    VField: Field,
    ErrorMessage,
  },
  methods: {
    getProducts() {
      axios.get(`${this.apiUrl}/api/${this.apiPath}/products/all`)
        .then((res) => {
          console.log(res.data);
          this.products = res.data.products;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    openProductModal(id) {
      this.productId = id;
      this.$refs.productModal.openModal();
    },
    getCartData() {
      axios.get(`${this.apiUrl}/api/${this.apiPath}/cart`)
        .then((res) => {
          console.log(res.data);
          this.cartData = res.data.data;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    addToCart(id, qty = 1) {
      const data = {
        product_id: id,
        qty,
      };
      this.isLoadingItem = id;
      axios.post(`${this.apiUrl}/api/${this.apiPath}/cart`, { data })
        .then((res) => {
          console.log(res.data);
          this.getCartData();
          this.isLoadingItem = '';
        })
        .catch((err) => {
          console.log(err);
        });
    },
    updateCartQty(item) {
      const data = {
        product_id: item.id,
        qty: item.qty,
      };
      axios.put(`${this.apiUrl}/api/${this.apiPath}/cart/${item.id}`, { data })
        .then((res) => {
          console.log(res.data);
          this.getCartData();
          this.isLoadingItem = '';
        })
        .catch((err) => {
          console.log(err);
        });
    },
    removeCartItem(item) {
      this.isLoadingItem = item.id;
      axios.delete(`${this.apiUrl}/api/${this.apiPath}/cart/${item.id}`)
        .then(() => {
          this.getCartData();
          this.isLoadingItem = '';
        })
        .catch((err) => {
          console.log(err);
        });
    },
    removeCartItems() {
      axios.delete(`${this.apiUrl}/api/${this.apiPath}/carts`)
        .then(() => {
          this.getCartData();
        })
        .catch((err) => {
          console.log(err);
        });
    },
    createOrder() {
      const url = `${this.apiUrl}/api/${this.apiPath}/order`;
      const order = this.form;
      axios.post(url, { data: order }).then((response) => {
        alert(response.data.message);
        this.$refs.form.resetForm();
        this.getCartData();
      }).catch((err) => {
        alert(err.data.message);
      });
    },
  },
  mounted() {
    this.getProducts();
    this.getCartData();
  },
});
app.component('product-modal', {
  props: ['id'],
  template: '#userProductModal',
  data() {
    return {
      apiUrl: 'https://vue3-course-api.hexschool.io/v2',
      apiPath: 'maohong',
      modal: {},
      product: {},
      qty: 1,
    };
  },
  mounted() {
    this.myModal = new bootstrap.Modal(this.$refs.modal);
  },
  watch: {
    id() {
      this.getProduct();
    },
  },
  methods: {
    openModal() {
      this.myModal.show();
    },
    getProduct() {
      axios.get(`${this.apiUrl}/api/${this.apiPath}/product/${this.id}`)
        .then((res) => {
          console.log(res.data);
          this.product = res.data.product;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    addToCart(id) {
      this.$emit('add-to-Cart', id, this.qty);
      this.myModal.hide();
    },
  },
});
app.mount('#app');
