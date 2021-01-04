<template>
    <div class="head">
        <div class="content">
            <a-row>
                <a-col :span="22">靓仔备忘录</a-col>
                <a-col :span="1" v-if="!isLogin"><a-button type="link" @click="loginDrawer">登录</a-button></a-col>
                <a-col :span="1" v-if="!isLogin"><a-button type="link" @click="registerDrawer">注册</a-button></a-col>
                <a-col :span="2" v-if="isLogin">{{name}}</a-col>
            </a-row>
        </div>
        <div class="main">
            <a-row >
                <a-col :span="18" :offset="3">
                    <a-input size="large" placeholder="输入后按下回车添加一条待办记录" class="a-input" @pressEnter="addTodo"></a-input>
                </a-col>
            </a-row>
            <a-row style="margin-top: 20px">
                <a-col :span="3" :offset="3"><a-button type="primary" @click="allComplete">批量完成</a-button></a-col>
                <a-col :span="3"><a-button type="primary" @click="generateHistory">生成历史</a-button></a-col>
            </a-row>
            <!-- 待完成表格 -->
            <a-row style="margin-top: 10px">
                <a-col :span="18" :offset="3">
                    <a-table :columns="columns" :data-source="data">
                        <a-checkbox :checked="record.select" slot="select" slot-scope="text, record"  @click="a(record.key)"></a-checkbox>
                        <a-row slot="button" slot-scope="text, record">
                            <a-col :span="12">
                                <a-button type="primary" @click="completeOne(record.key)">完成</a-button>
                            </a-col>
                            <a-col :span="12">
                                <a-button type="danger" @click="deleteOne(record.key)">删除</a-button>
                            </a-col>
                        </a-row>
                    </a-table>
                </a-col>
            </a-row>
            <!-- 生成历史的表格 -->
            <a-row v-if="showHistory">
                <a-col :span="5" :offset="3">
                    历史记录
                </a-col>
            </a-row>
            <a-row style="margin-top: 20px" v-if="showHistory">
                <a-col :span="18" :offset="3">
                    <a-table :columns="columnsHistory" :data-source="dataHistory">
                        <template slot="status" slot-scope="text, record">
                            <span v-if="record.status == '已完成'" style="color: grey">{{record.status}}</span>
                            <span v-if="record.status == '未完成'" style="color: blue">{{record.status}}</span>
                            <span v-if="record.status == '已删除'" style="color: red">{{record.status}}</span>
                        </template>
                    </a-table>
                </a-col>
            </a-row>
        </div>
        <a-drawer
            title="用户登录"
            placement="right"
            :width="400"
            :closable="false"
            :visible="visible"
            @close="onClose"
        >
            <a-form :form="form"  :label-col="{span: 5}" :wrapper-col="{span:12}" @submit="handleSubmit" layout="horizontal">
                <a-form-item label="用户名">
                    <a-input
                        v-decorator="['name', { rules: [{ required: true, message: 'Please input your note!' }] }]"
                    />
                </a-form-item>
                <a-form-item label="密码">
                    <a-input-password
                        v-decorator="['passwd', { rules: [{ required: true, message: 'Please input your note!' }] }]"
                    />
                </a-form-item>
                <a-form-item :wrapper-col="{span: 3, offset:2}" >
                    <a-button type="primary" html-type="submit">
                        登录
                    </a-button>
                </a-form-item>
            </a-form>
        </a-drawer>
        <a-drawer
            title="用户注册"
            placement="right"
            :width="400"
            :closable="false"
            :visible="visibleForRegister"
            @close="onCloseForRegister"
        >
            <a-form :form="formForRegister"  :label-col="{span: 5}" :wrapper-col="{span:12}" @submit="handleSubmitForRegister" layout="horizontal">
                <a-form-item label="用户名">
                    <a-input
                        v-decorator="['name', { rules: [{ required: true, message: 'Please input your note!' }] }]"
                    />
                </a-form-item>
                <a-form-item label="密码">
                    <a-input-password
                        v-decorator="['passwd', { rules: [{ required: true, message: 'Please input your note!' }] }]"
                    />
                </a-form-item>
                <a-form-item :wrapper-col="{span: 3, offset:2}" >
                    <a-button type="primary" html-type="submit">
                        注册
                    </a-button>
                </a-form-item>
            </a-form>
        </a-drawer>
    </div>
</template>
<script>
import Qs from 'qs';
const d = new Date();
const columns = [
    { title:"选择", dataIndex:"select", key:"select", scopedSlots: {customRender: 'select'}},
    { title:"待办事项", dataIndex:"todo", key:"todo"},
    { title:"时间", dataIndex:"time", key:"time"},
    { title:"操作", dataIndex:"button", key:"button", scopedSlots: {customRender: 'button'}}
];
const data = [
    
];
const columnsHistory = [
    { title:"待办事项", dataIndex:"todo", key:"todo"},
    { title:"时间", dataIndex:"time", key:"time"},
    { title:"状态", dataIndex:"status", key:"status", scopedSlots: {customRender: 'status'}}
];
const dataHistory = [];
export default {
    name: "HeadForMd",
    data() {
        return {
            form: this.$form.createForm(this, { name: 'coordinated' }),
            formForRegister: this.$form.createForm(this, { name: 'coordinated2' }),
            columns: columns,
            columnsHistory: columnsHistory,
            data: data,
            dataHistory: dataHistory,
            visible: false,
            visibleForRegister: false,
            name: "",
            isLogin: false,
            showHistory: false
        }
    },
    activated() {
    },
    watch: {
    },
    created(){
    },
    mounted(){
        if (sessionStorage.name_finance != undefined){
            this.name = sessionStorage.name_finance;
            this.isLogin = true;
            this.getAllToDo();
            
        }
    },
    methods:{
        //添加待办事项的回车响应程序
        addTodo: async function(e){
            // if (this.data.length == 0) {
            //     const newARecord = {
            //         key: 1,
            //         select: false,
            //         todo: e.target.value,
            //         time: d.getFullYear()+"-"+(d.getMonth()+1)+"-"+d.getDate()
            //     };
            //     this.data.push(newARecord);
            //     sessionStorage.noComplete.push(newARecord);
            // } else {
            //     const key = this.data[this.data.length-1].key + 1;
            //     const newARecord = {
            //         key: key,
            //         select: false,
            //         todo: e.target.value,
            //         time: d.getFullYear()+"-"+(d.getMonth()+1)+"-"+d.getDate()
            //     };
            //     this.data.push(newARecord);
            // }
            const newARecord = {
                todo: e.target.value,
                time: d.getFullYear()+"-"+(d.getMonth()+1)+"-"+d.getDate()
            };
            var data = Qs.stringify(newARecord);
            var resultData;
            await this.$http.post('/addone',data).then(function(res){
                resultData = res.data;
            });
            if (resultData.status == 1) {
                this.$message.info('添加成功');
                this.getAllToDo();
            } else {
                this.$message.info('添加失败');
            }
        },
        //点击事项的完成时的点击响应程序
        async completeOne(value) {
            console.log(value);
            var keyArray = [];
            var resultData;
            for (let i = 0; i < this.data.length; i++) {
                if (value == this.data[i].key) {
                    keyArray.push(this.data[i].key);
                }
            }
            var data = Qs.stringify({key: keyArray.toString()});
            await this.$http.post('/finish', data).then(function(res){
                if (res.data.status == 1) {
                    resultData = res.data;
                }
            })
            if (resultData.status == 1) {
                this.getAllToDo();
                this.$message.info('操作成功');
            } else {
                this.$message.info('操作失败');
            }
        },
        //删除一条待办事项
        async deleteOne(value) {
            var data;
            var label = 0;
            var resultData;
            for (let i = 0; i < this.data.length; i++) {
                if (value == this.data[i].key) {
                    label = 1;
                    data = {key: this.data[i].key};
                    await this.$http.post('/deleteone', Qs.stringify(data)).then(function(res){
                        resultData = res.data;
                    });
                    
                    if (resultData.status == 1) {
                        this.$message.info('操作成功');
                        this.getAllToDo();
                    } else {
                        this.$message.info('操作失败');
                    }
                }
            }
            if (label == 0) {
                this.$message.info('系统失效, 请稍后再试');
            }
        },
        //点击复选框进行勾选时的点击响应程序
        a(value) {
            for (let i = 0; i < this.data.length; i++) {
                if (value == this.data[i].key) {
                    if (this.data[i].select == false) {
                        this.data[i].select = true;
                    } else {
                        this.data[i].select = false;
                    }
                    console.log(this.data[i].select);
                }
            }
        },
        //点击批量完成时的响应程序
        async allComplete() {
            var count = 0;
            var keyArray = [];
            var resultData;
            if (this.data.length == 0) {
                this.$message.info("没有可完成的事项");
            }
            for (let i = 0; i < this.data.length; i++) {
                if (this.data[i].select == true) {
                    count++;
                    keyArray.push(this.data[i].key);
                }
            }
            if (count == 0) {
                this.$message.info("请勾选事项");
                return;
            }
            var data = Qs.stringify({key: keyArray.toString()});
            await this.$http.post('/finish', data).then(function(res){
                if (res.data.status == 1) {
                    resultData = res.data;
                }
            });
            if (resultData.status == 1) {
                this.$message.info('操作成功');
                this.getAllToDo();
            } else {
                this.$message.info("操作失败");
            }
        },
        //点击登录拉开抽屉
        loginDrawer() {
            this.visible = true;
        },
        //点击注册拉开抽屉
        registerDrawer() {
            this.visibleForRegister = true;
        },
        //点击罩层关闭抽屉
        onClose() {
            this.visible = false;
        },
        //点击罩层关闭抽屉
        onCloseForRegister() {
            this.visibleForRegister = false;
        },
        //历史记录的开关
        generateHistory() {
            this.showHistory = true;
        },
        //表单提交
        handleSubmit(e) {
            
            e.preventDefault();
            this.form.validateFields(async (err, values) => {
                var data =  Qs.stringify(values);
                var resultData;
                if (!err) {
                    await this.$http.post("/forlogin", data).then(function(res){
                        resultData = res.data;
                    });
                    if (resultData.status == 1) {
                        sessionStorage.token_for_finance = resultData.token_for_finance;
                        sessionStorage.name_finance = values.name;
                        this.name = values.name;
                        this.isLogin = true;
                        this.visible = false;
                        this.$message.info("登录成功");
                    } else {
                        this.visible = false;
                        this.$message.info("登录失败");
                    }
                }
            });
        },
        //注册表单提交
         handleSubmitForRegister:async function(e) {
            e.preventDefault();
            this.formForRegister.validateFields(async (err, values) => {
                var data =  Qs.stringify(values);
                var resultData;
                if (!err) {
                 await this.$http.post("/login", data).then(function(res){
                        resultData = res.data;
                    });
                    console.log(resultData);
                    if (resultData.status == 1) {
                        console.log(resultData.status);
                        sessionStorage.token_for_finance = resultData.token_for_finance;
                        sessionStorage.name_finance = values.name;
                        this.name = values.name;
                        this.isLogin = true;
                        this.visibleForRegister = false;
                        this.$message.info("注册成功");
                    } else {
                        this.visibleForRegister = false;
                        this.$message.info("注册失败失败");
                    }
                }
            });
        },
        //获取所有事项
        getAllToDo: async function() {
            var resultData;
            await this.$http.post('/getalltodo').then(function(res){
                resultData = res.data;
            });
            this.data = [];
            this.dataHistory = [];
            if(resultData[0].status == 0) {
                this.$message.info('获取失败');
            }
            for (let i = 1; i < resultData.length; i++) {
                if (resultData[i] != null && resultData[i].status == 1){
                    this.data.push(resultData[i]);
                    this.dataHistory.push({todo: resultData[i].todo, time: resultData[i].time, status:"未完成"});
                }else if (resultData[i] != null && resultData[i].status == 2) {
                    this.dataHistory.push({todo: resultData[i].todo, time: resultData[i].time, status:"已完成"});
                }else if (resultData[i] != null && resultData[i].status == 3) {
                    this.dataHistory.push({todo: resultData[i].todo, time: resultData[i].time, status:"已删除"});
                }
            }
        }
        
    }


}
</script>
<style scoped lang="less">
.head {
    height: 50px;
    background-color: #F7ECEC;
}
.content {
    width: 1000px;
    margin-left: auto;
    margin-right: auto;
    height: 100%;
    line-height: 50px;
}
.main {
    width: 1000px;
    margin-left: auto;
    margin-right: auto;

    .a-input {
        margin-top: 50px;

    }
}
</style>
