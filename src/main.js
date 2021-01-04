import Vue from 'vue'
import App from './App.vue'
import axios from 'axios';
import {Button, Calendar, Radio, Row, Col, Input, Table,Checkbox, message, Drawer, Form} from 'ant-design-vue';

//ant design
Vue.component(Button.name, Button);
Vue.component(Radio.name, Radio);
Vue.component(Calendar.name, Calendar);
Vue.component(Row.name, Row);
Vue.component(Col.name, Col);
Vue.component(Input.name, Input);
Vue.component(Table.name, Table);
Vue.component(Checkbox.name, Checkbox);
Vue.component(Drawer.name, Drawer);
Vue.use(Input);
Vue.use(Form);

//axios
Vue.prototype.$http = axios;
axios.defaults.withCredentials = true;
axios.defaults.baseURL = '/api';
axios.interceptors.request.use(config => {
  // 表示在配置中的设置头消息的字段Authorization为从本地获取的token值
  config.headers['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';
  config.headers['token'] = sessionStorage.token_for_finance;
  return config
})


Vue.prototype.$message = message;
Vue.config.productionTip = false

new Vue({
  render: h => h(App),
}).$mount('#app')
