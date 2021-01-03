import Vue from 'vue'
import App from './App.vue'
import {Button, Calendar, Radio} from 'ant-design-vue';

Vue.component(Button.name, Button);
Vue.component(Radio.name, Radio);
Vue.component(Calendar.name, Calendar);
Vue.config.productionTip = false

new Vue({
  render: h => h(App),
}).$mount('#app')
