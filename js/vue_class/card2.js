export default {
    data() {
        return {
            text: '區域註冊的元件'
        }
    },
    methods: {
        pushData(){
            this.$emit('push-event')
        }
    }
    , template: 
    `
    <button type="button" class="btn btn-primary" @click="pushData">測試紐</button>
    <inner-component></inner-component>
    `
    ,components:{
        'inner-component':{
            template:`<div>更內層元件</div>`
        }
    }
}