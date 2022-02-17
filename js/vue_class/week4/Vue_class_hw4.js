/* global axios bootstrap */
// eslint-disable-next-line
import { createApp } from 'https://cdnjs.cloudflare.com/ajax/libs/vue/3.0.9/vue.esm-browser.js';
// eslint-disable-next-line
import pagination from '../pagination.js';

let productModal = null;
let delProductModal = null;

const app = createApp(
  {
    components: {
      pagination,
    },
    data() {
      return {
        products: [],
        tempProduct: {
          imagesUrl: [],
        },
        apiUrl: 'https://vue3-course-api.hexschool.io/v2',
        apiPath: 'maohong',
        isNew: true,
        modalTitle: '新增產品',
        pagination: {},
      };
    },
    mounted() {
      productModal = new bootstrap.Modal(document.querySelector('#productModal'));
      delProductModal = new bootstrap.Modal(document.querySelector('#delProductModal'));
      this.checkAdmin();
      this.getAllProductData();
    },
    methods: {
      checkAdmin() {
        // 取得 Token（Token 僅需要設定一次）
        const token = document.cookie.replace(/(?:(?:^|.*;\s*)hexToken\s*\=\s*([^;]*).*$)|^.*$/, '$1');
        // 在header 夾帶 Authorization : token 只要送過一次就可以被預設設定到
        axios.defaults.headers.common.Authorization = token;
        // 確認是否登入
        axios.post(`${this.apiUrl}/api/user/check`)
          .then(() => {
            this.getAllProductData();
          })
          .catch((error) => {
            alert(error.data.message);
            window.location = 'Vue_class_hw2_login.html';
          });
      },
      getAllProductData(page = 1) { // 參數預設值
        axios.get(`${this.apiUrl}/api/${this.apiPath}/admin/products/?page=${page}`)
          .then((res) => {
            this.products = res.data.products;
            this.pagination = res.data.pagination;
          })
          .catch((error) => {
            alert(error.data.message);
          });
      },
      openModal(type, item) {
        switch (type) {
          case 'create':
            this.tempProduct = {
              imagesUrl: [],
            };
            this.isNew = true;
            this.modalTitle = '新增產品';
            break;
          case 'edit':
            this.tempProduct = { ...item };
            this.modalTitle = '編輯產品';
            this.isNew = false;
            productModal.show();
            break;
          case 'delete':
            this.tempProduct = { ...item };
            delProductModal.show();
            break;
          default:
            break;
        }
      },
    },

  },
);
app.component('productModal', {
  props: ['tempProduct', 'modalTitle', 'isNew'],
  template: '#templateForProductModal',
  data() {
    return {
      apiUrl: 'https://vue3-course-api.hexschool.io/v2',
      apiPath: 'maohong',
    };
  },
  methods: {
    doSave() {
      let url = `${this.apiUrl}/api/${this.apiPath}/admin/product`;
      let type = 'post';
      if (!this.isNew) {
        url = `${this.apiUrl}/api/${this.apiPath}/admin/product/${this.tempProduct.id}`;
        type = 'put';
      }
      axios[type](url, { data: this.tempProduct })
        .then((res) => {
          alert(res.data.message);
          productModal.hide();
          // this.getAllProductData(); => 外層method
          this.$emit('get-all-product-data');
        })
        .catch((error) => {
          alert(error.data.message);
        });
    },
  },
});
app.component('deleteModal', {
  data() {
    return {
      apiUrl: 'https://vue3-course-api.hexschool.io/v2',
      apiPath: 'maohong',
    };
  },
  props: ['tempProduct'],
  template: '#templateForDeleteModal',
  methods: {
    doDelete(id) {
      axios.delete(`${this.apiUrl}/api/${this.apiPath}/admin/product/${id}`)
        .then((res) => {
          alert(res.data.message);
          // this.getAllProductData(); 外層method
          delProductModal.hide();
          this.$emit('get-all-product-data');
        })
        .catch((error) => {
          alert(error.data.message);
        });
    },
  },
});
app.mount('#app');
