var aaa=[];
if(localStorage.todoLists){
    aaa=JSON.parse(localStorage.todoLists);//取本地缓存
};

var filters = {  //定义过滤规则
    all: function (lists) {
        return lists;
    },
    active: function (lists) {
        var todoALists=[];
        lists.forEach(function(list) {
            if (!list.completed) {
                todoALists.push(list);
            }
        })
        return todoALists;
    },
    completed: function (lists) {
        var todoCLists=[];
        lists.forEach(function(list) {
            if (list.completed) {
                todoCLists.push(list);
            }
        })
        return todoCLists;
    }
};

var data={
    todoLists:aaa,
    newTodo:'',
    alterTodo:null,//修改的计划
    choose:'all'
}

var vm=new Vue({
    el:'#app',
    data:function(){  //可以是Obj或者Func,在组件定义中只能是函数
        return data;
    },
    watch:{  //监听val的变化
        todoLists:{
            deep: true,  //深度watcher，否则监听不到数组里面的对象变化
            handler: function(val){
                localStorage.todoLists=JSON.stringify(val);
            }
        }
    },
    computed:{  //持续追踪它的响应依赖
        filterLists:function(){
            return filters[this.choose](this.todoLists);
        },
        remaining:function(){
            return filters.active(this.todoLists);
        }
    },
    methods:{
        addTodo:function(){
            var text = this.newTodo.trim();
            if (text) {
                this.todoLists.push({text:text,isShowDelBtn:false,completed:false});
                this.newTodo = '';
            }
        },
        removeTodo:function(list){
            console.log(list)
            this.todoLists.$remove(list);
        },
        editTodo:function(list){
            this.alterTodo=list;//驱动视图显示edit类,显示input输入框

        },
        doneEdit:function(list){
            if (!this.alterTodo) { //兼容处理
                return;
            }
            this.alterTodo = null;
            list.text = list.text.trim();//去处空格
            //不需要赋值，已有双向数据绑定
            if (!list.text) {
                this.removeTodo(list);//没有输入值则移除这行
            }
        },
        showDeleteBtn:function(index){
            var _index=index;
            this.filterLists.forEach(function(list,index){
                if(_index==index){
                    list.isShowDelBtn=true;
                }else{
                    list.isShowDelBtn=false;
                }
            })
        },
        hideDeleteBtn:function(){
            this.filterLists.forEach(function(list){
                list.isShowDelBtn=false;
            })
        },
        changeChoose:function(val){
            this.choose=val;
        },
        clearComplete:function(){
            this.todoLists=this.remaining;
        }
    }
})

window.onload=function(){
    if(location.hash.indexOf('active')>-1){
        vm.choose='active';
    }else if(location.hash.indexOf('completed')>-1){
        vm.choose='completed';
    }else{
        vm.choose='all';
    }
}
