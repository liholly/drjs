[TOC]



## 简介

可玩性强、小巧实用的DOM编程框架。
它将界面的各个构件的交互，转化为一种**事件流**的方式来表达。
它为网页交互设计提供了另一种编码视角。

它能够让我们：

1. 对已有的js插件二次封装为html直接调用的组件；
2. 在不动用js代码的情况下自由编排页面各构件交互逻辑；
3. 通过在html中编写表达式装卸CSS样式类来实现交互效果；
4. 对js代码进行原子性封装，实现语素化的代码复用，逻辑代码像说话一样好理解。
5. 高效的内存管理，更节省资源。

最重要的是，它真的很简单！



## 安装

在head中引用脚本文件即可。

```html
<script src="./dr.js">
```

<a target='_blank' href='https://github.com/liholly/drjs'>下载源码</a>

<a target='_blank' href='https://github.com/liholly/drjs'>给我点赞</a>



## 概念

### 事件流

事件A生成事件B，事件B生成事件C，一生二，二生三，三生万物。
事件流是drjs的代码组织方式，通过事件的连锁反应来定义界面的动作。

### 指令

一个指令就是一个函数，这是drjs最核心的部分，也就是上文所说的“语素”。
在实践中，我们可能会用指令来封装组件。

### 作用域

drjs在Html标签上使用`dr`属性来定义作用域，限定事件响应的范围。
作用域是drjs组件化的关键。

### 句柄

drjs可以使用句柄来二次封装开源插件，html中使用do指令来访问句柄对象。



## 表达式

drjs的逻辑代码写在html元素的`dr`前缀的属性中，是一种特定的表达式。

`dr-on`是drjs的核心表达式，它使用一种类似于JQuery的链式风格表达式来书写交互逻辑。
但是，千万要注意了！只是看起来像JQuery，“函数”之间的点其实是分隔符，而不是对象访问符。
表达式写在html元素的`dr`前缀的属性中，由drjs托管执行。

以下是`dr-on`表达式示例：

**滚动响应**

`at(window,'inner').remove('cls1').add('cls2')`
元素居于窗口内部时，删除cls1样式类并且添加cls2样式类。

**事件防抖**

`mouseover.delay(200,'mouseleave').son().fadeIn()`
鼠标停留在元素上方时，子元素呈现（做下拉菜单必备）。

**自定义事件**

`click.e('modalClose')`

**自定义事件作用域**

`click.e('tabClick',null,'tab')`

**事件防冒泡**

`click.isSelf().add('active')`

**事件合成**

`[click|modalClose].remove('modalShow')`
元素被点击或接收到modalClose事件时，删除modalShow样式。

**事件代理**

`mouseover('li').e('menuShow',index);`
代理元素下所有li元素的mouseover事件，后续index是指被代理的子元素的索引。

**断言1**

`panelShow.isEq(index,prop).show()`
当前元素索引与事件`panelShow`传递的参数相等时则显示。

**断言2**

`click.has('modalShow').log('存在modalShow样式类')`
当前元素存在modalShow样式类时，向控制台打印提示语。



drjs还有数个**辅助表达式**：

- `dr` ——定义一个事件作用域
- `dr-widget` ——定义组件
- `dr-pms`——定义元素作用域上下文变量
- `dr-calc`——计算属性

这些表达式这里不展开说明，请参阅文档部分内容。



## 示例

通过几个经典网页组件来看一下基于drjs的交互实现方式。

### Tab页签

```html
<!--组件开始-->
<div class="tab" dr="tab">
    <div class="head">
        <ul dr-on="mouseover('li').e('tabToggle',index,'tab');tabToggle('li').hit(index,null,'active')">
            <li class="active">页签1</li>
            <li>页签2</li>
            <li>页签3</li>
        </ul>
    </div>
    <div class="body" dr-on="tabToggle('.panel').hit(index,null,'active')">
        <div class="panel active">页签1面板</div>
        <div class="panel">页签2面板</div>
        <div class="panel">页签3面板</div>
    </div>
</div>
<!--组件结束-->

<!--外部触发按钮-->
<button dr-on="click.e('tabToggle',0)">切换到页签1</button>
<button dr-on="click.e('tabToggle',1)">切换到页签2</button>
```

<a href='http://www.w3docs.cn/drjs/example/tab.html' target='_blank'>查看运行效果</a>

### Modal模态框

```html
<!--组件开始-->
<div class="n-modal" dr-on="[openModal|closeModal].as('show');click.isSelf().e('closeModal');">
    <div class="modal-box">
        <p>弹窗内容，点击窗体之外则关闭</p>
        <button dr-on="click.e('closeModal')">点击立即关闭弹窗</button>
        <button dr-on="click.delay(1000).e('closeModal')">点击1秒后关闭弹窗</button>
    </div>
</div>
<!--组件结束-->

<!--触发按钮-->
<button dr-on="click.e('openModal')">点击打开弹窗</button>
```

<a href='http://www.w3docs.cn/drjs/example/modal.html' target='_blank'>查看运行效果</a>

### 二级导航栏

```html
<div class="nav" dr-on="mouseleave.e('menuOff')">
    <!--顶级导航-->
    <div class="nav-box">
        <div class="logo">LOGO</div>
        <div class="list">
            <ul dr-on="
            mouseover('li').e('menuOn',index);
            menuOn('li').hit(index,null,'active');
            menuOff.son().remove('active')">
                <li class="active">产品列表</li>
                <li>样板参考</li>
                <li>联系我们</li>
            </ul>
        </div>
    </div>
    <!--二级导航-->
    <div class="son-nav-box"
         dr-on="
         [menuOn|menuOff].as('show');
         menuOn('.panel').hit(index,null,'active')">
        <div class="panel active">二级面板-产品列表</div>
        <div class="panel">二级面板-样板参考</div>
        <div class="panel">二级面板-联系我们</div>
    </div>
</div>
```

<a href='#'>查看运行效果</a>



## 组件化

在html中写大量的表达式非常难看，也不利于复用代码，所以drjs提供了几种组件化方案。
drjs的真正价值来自于页面级交互的编排，把局部可复用的交互封装为组件是必然选择。

### 指令方式

二维码生成指令qrcode

```html
<!--生成尺寸为300的二维码-->
<div dr-on="load.qrcode(300)"></div>
```

js封装源码

```js
//第一层函数用来接收指令运行时上下文，第二层函数用来接收指令运行时传参
dr.handler('qrcode',(next, el, e, pipe)=>(size)=>{
    //这里调用二维码插件生成二维码（伪代码）
    Qrcode.make({
        container: el,
        size: size
    });
    
    //继续后续流程
    next()
});
```

### Widget方式

使用`dr.widget(...)`实例方法

如下例是一个图片懒加载组件。

```html
<div class="box" dr-widget="imageLazyLoad()">
    <img src="" alt="" dr-pms="{src:'/static/img/pic001.png'}">
</div>
```

它对应的基于widget方法的js代码

```js
dr.widget('imageLazyLoad', {
    props: {delayTime: 300},
    setup: {
        root: "loading('unloading',260,180)",
        children: {
            img: "at(window,'inner',200).delay(delayTime).attr('src',src).emitNear('box','unloading')"
        }
    }
});
```

实质上，该js代码就是一个自动安装表达式到html元素的脚本，它等效于以下代码

```html
<div class="box" dr-on="loading('unloading',260,180)">
    <img dr-on="at(window,'inner',200).delay(300).attr('src',src).emitNear('box','unloading')"
         dr-pms="{src:'/static/img/pic001.png'}">
</div>
```

在某些情况下，我们可能需要使用js原生方式来定义组件，但是又希望将组件继续托管给drjs，那么就将widget方法传递的选项中的setup属性定义为函数即可，在函数内，我们可以使用dr自带的元素操作工具包。

```javascript
dr.widget('imageLazyLoad', {
    //定义组件的可配置参数
    props: {delayTime: 300},
    //安装表达式
    setup(props, el, getDrElm){
        //元素操作工具包
        let html = dr.html;
        
        //创建元素
        let btnEl = html.createEl('div',{style:'width:300px;height:260px'});
        
        //添加样式类
        html.addClass(btnEl,'active');
        
        //删除样式类
        html.removeClass(btnEl,'active');
        
        //绑定DOM事件
        html.addHandler(btnEl,'click',e=>{
            //...
        });
        
        //将创建的元素追加到组件根元素
        html.append(el,btnEl);
        
        //发送dr事件
        dr.emit('unloading');
        
        //监听dr事件
        dr.on('...',e=>{
            //事件逻辑
        });
    }
});
```

### 句柄方式

drjs还可以使用句柄方式来封装组件，它通过一种高阶函数来定义一个“**句柄对象**”。
然后就可以通过do命令在html中调用句柄对象暴露的方法。

下例封装了一个幻灯片组件，基于js开源插件Swiper。

```js
dr.handler('slider', (next, el, e, pipe, ctx, handlerState, handle) => (autoplay) => {
    //定义幻灯片实例
    let slider = Swiper(el);
    
    //自动播放
    slider.autoplay = autoplay;
    
    //继续后续流程
    next();
    
    //返回句柄对象
    return handle({
        //下一图
        next() {
            if (slider.index < slider.maxIndex) {
                slider.show(slider.index + 1)
            }
        },
        //上一图
        prev() {
            if (slider.index > 0) {
                slider.show(slider.index - 1)
            }
        },
    })
});
```

使用

语句`slider()('s1')`第二个圆括号，为当前页面挂载了一个名为`s1`的指令句柄对象引用。

```html
<!--幻灯片主体-->
<div class="slider" dr-on="slider(true)('s1')">
    <div class="card">幻灯片1</div>
    <div class="card">幻灯片2</div>
    <div class="card">幻灯片3</div>
</div>

<!--外部控制幻灯片切换。这两个元素可以放在页面任意位置-->
<button dr-on="click.do('s1.next')"> 上一图 </button>
<button dr-on="click.do('s1.prev')"> 下一图 </button>
```



## API

<a href='http://www.w3docs.cn/drjs/docs.html' target='_blank'>跳转至文档站阅读</a>