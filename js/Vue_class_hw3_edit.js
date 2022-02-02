let productModal = null;
let delProductModal = null;
// 產品資料格式
const App = {
    data() {
        return {
            products: [],
            tempProduct: {
                imagesUrl:[],
            },
            apiUrl: 'https://vue3-course-api.hexschool.io/v2',
            apiPath: 'maohong',
            isNew: true,
            modalTitle: '新增產品'
        }
    }, mounted() {
        productModal = new bootstrap.Modal(document.querySelector('#productModal'));
        delProductModal = new bootstrap.Modal(document.querySelector('#delProductModal'));
        // 取得 Token（Token 僅需要設定一次）
        const token = document.cookie.replace(/(?:(?:^|.*;\s*)hexToken\s*\=\s*([^;]*).*$)|^.*$/, "$1");
        // 在header 夾帶 Authorization : token 只要送過一次就可以被預設設定到
        axios.defaults.headers.common['Authorization'] = token;
        //   this.checkAdmin();
        this.getAllProductData();
    }, methods: {
        checkAdmin() {
            // 確認是否登入
            axios.post(`${this.apiUrl}/api/user/check`)
                .then((res) => {
                    this.getAllProductData();
                })
                .catch((error) => {
                    alert(error.data.message);
                    window.location = 'Vue_class_hw2_login.html';
                })
        },
        getAllProductData() {
            axios.get(`${this.apiUrl}/api/${this.apiPath}/admin/products`)
                .then((res) => {
                    this.products = res.data.products
                })
                .catch((error) => {
                    alert(error.data.message);
                })
        },
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
                    this.getAllProductData();
                })
                .catch((error) => {
                    alert(error.data.message);
                })
        },
        doDelete(id) {
            axios.delete(`${this.apiUrl}/api/${this.apiPath}/admin/product/${id}`)
                .then((res) => {
                    alert(res.data.message)
                    this.getAllProductData();
                    delProductModal.hide();
                })
                .catch((error) => {
                    alert(error.data.message);
                })
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
                    this.tempProduct = { ...item}
                    this.modalTitle = '編輯產品';
                    this.isNew = false;
                    productModal.show();
                    break;
                case 'delete':
                    this.tempProduct = { ...item}
                    delProductModal.show();
                    break;
            }
        }
    }

}
Vue.createApp(App).mount('#app')