const App = {
    data() {
        return {
            user:{
                username: '',
                password: ''
            },
            apiUrl:'https://vue3-course-api.hexschool.io/v2'
        }
    },
    methods: {
        login() {
            //  發送 API 至遠端並登入（並儲存 Token）
            axios.post(`${this.apiUrl}/admin/signin`, this.user)
                .then((res) => {
                    console.log(res);
                    const { token, expired } = res.data;
                    console.log(token, expired)
                    document.cookie = `hexToken=${token}; expires=${new Date(expired)}`
                    window.location = 'Vue_class_hw1.html';
                })
                .catch((error) => {
                    alert(error.data.message)
                })
        }
    }
}
Vue.createApp(App).mount('#app')