// 產品資料格式
const App = {
  data() {
    return {
      products: [],
      tempProduct: {},
      apiUrl:'https://vue3-course-api.hexschool.io/v2',
      apiPath:'maohong'
    }
  }, methods: {
    checkAdmin() {
      // 確認是否登入
      axios.post(`${this.apiUrl}/api/user/check`)
        .then((res) => {
          this.getData();
        })
        .catch((error) => {
          alert(error.data.message);
          window.location = 'Vue_class_hw2_login.html';
        })
    },
    getData(){
      axios.get(`${this.apiUrl}/api/${this.apiPath}/admin/products`)
      .then((res)=>{
        this.products = res.data.products
      })
      .catch((error)=>{
        alert(error.data.message);
      })
    }
  },
  created() {
    // 取得 Token（Token 僅需要設定一次）
    const token = document.cookie.replace(/(?:(?:^|.*;\s*)hexToken\s*\=\s*([^;]*).*$)|^.*$/, "$1");
    // 在header 夾帶 Authorization : token 只要送過一次就可以被預設設定到
    axios.defaults.headers.common['Authorization'] = token;
    this.checkAdmin();
  },
}
Vue.createApp(App).mount('#app')