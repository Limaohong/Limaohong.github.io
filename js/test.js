import card2 from "./card2.js"
const app = Vue.createApp({
    data(){
        return {
            text:'測試測試'
        }
    },methods:{
        getData(){
            console.log('外層事件')
        }
    },
    mounted(){

    },components:{
        card2
    }
})

app.mount('#app')