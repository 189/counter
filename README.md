React 得益于 API 简单，独树一帜的组件化开发，这两年在前端越来越火，然而通信始终是个蛋疼的问题，尤其是跨组件通信以及如何管理越来越臃肿的 State越来越麻烦。FaceBook 给出了 Flux的实现思想，也是目前Facebook在用的一套前端应用的架构模式。
###简单说说 Flux
**为啥要用 Flux**

从 React 本身设计角度讲，React只能算 MVC 中的 V，只负责数据显示，Flux呢，负责 M和 C。
从实践的角度说，在实际使用过程中，React 上要注册非常多的组件状态，而要管理日益庞大的组件状态是一件需要细致操作的活，React 的组件其实可以理解为一个个状态机，一旦状态发生改变，整个组件便会开始重新渲染，根据 diff 算法渲染实际发生改变的部分(这也是 React 优于其他前端框架的特性之一)，单纯靠手动控制 this.setState 传递会变得凌乱不堪。

**Flux的核心在于单向数据流。**

Flux 的数据流动模型可以理解为(View) -> Action -> Dispatcher -> Store -> View，官网给出的示意图为
![flux](https://hulufei.gitbooks.io/react-tutorial/content/image/flux-overview.png)
如图所示，一个完整的 Flux 应用包括四个部分:

1.Action 动作类型层，可以简单理解为定义一些事件的类型以及需要传递的参数，传给谁?传给 dispatch 层；  
2.Dispatcher呢，动作分发层，会分发触发的 Action 给所有注册的 Store 的回调函数，简单的说，就是决定事件何时触发，将 action 派发给 store  
3、Store呢，会在 Dispatcher 层注册回调函数，当事件派发时，执行必要的回调，更新 React 的 State  
4、View就是简单的组件层，控制视图显示

所以，当用户触发一个事件的时候，比如组件的 change，先产生action动作，被 dispatch 监听，派发给 store，store根据传递过来的数据参数更新组件的状态树，组件的状态数发生改变则反过来执行 View 的更新。原理很简单。

###再说说 Redux
Redux 把自己标榜为一个“可预测的状态容器”，说白了也是 Flux 里面“单向数据流”的思想，只是它充分利用函数式的特性，让整个实现更加优雅纯粹，使用起来也更简单。
它的数据模型比 Flux 简单一些，解耦了 dispatch 层。整个数据传递过程看起来像这样的：Action -> Reducers ->Store -> View。呵呵，少了个 dispatch，却多了个 Reducers，能算简单吗，能，后面再说。

其实 Flux 的实现远不止 redux,还有很多类似的实现，比如Reflux，Flummox， 有兴趣可以去 git上 Fork。老夫懒，独爱 Redux
###一个简单计数器
文件名称Counter，目录结构
<pre class="lang:default decode:true " >
├── webpack.config.js
├── index.html
├── index.js
├── actions
│   └── counter.js
├── package.json
├── componets
│   └── counter.js
├── css
│   └── layout.sass 
└── reducers
    └── reducer.js
</pre> 
**目录介绍**
  
* webpack.config.js是 webpack 的构建配置，整个项目基于 webpack环境开发;  
* package.json 配置 nodejs 的包文件及其版本;  
* index.js 和 index.html 分别对应是项目入口文件和入口静态页面;  
* actions和 components、reducers 现在还只是空目录，分别存放 React 组件的 actions、子组件和 Reducers。
  
**常规组件开发**  
直接上源码。
package.json。各种包和依赖，注意看版本，没这玩意儿，哪天要是跑不起来了(槽点一)，别找老夫。

	{
	  "name": "count",
	  "version": "1.0.0",
	  "description": "",
	  "dependencies": {},
	  "devDependencies": {
	    "babel-core": "^6.4.0",
	    "babel-loader": "^6.2.1",
	    "babel-preset-es2015": "^6.3.13",
	    "babel-preset-react": "^6.3.13",
	    "css-loader": "^0.23.1",
	    "html-webpack-plugin": "^2.17.0",
	    "node-sass": "^3.7.0",
	    "path": "^0.12.7",
	    "react": "^0.14.6",
	    "react-dom": "^0.14.6",
	    "react-redux": "^4.0.6",
	    "redux": "^3.0.5",
	    "sass-loader": "^3.2.0",
	    "style-loader": "^0.13.1",
	    "webpack": "^1.12.10"
	  },
	  "scripts": {
	    "build": "webpack --progress -colors --watch --display-error-detail"
	  },
	  "author": "kv.wang@gmail.com",
	  "license": "ISC"
	}

webpack配置

```
var webpack = require('webpack');
var path = require('path');
var HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    entry: {
    	app : path.join(__dirname, 'index.js'),
        vendors: ['react', 'redux']
    },

    output: {
        path: path.join(__dirname, 'build'),
        filename: '[name].js'
    },

    module: {
        loaders: [
            {
                test: /\.jsx?$/,
                exclude: /node_modules/,
                loader: 'babel',
                query: {
                    presets: ['react', 'es2015']
                }
            },
            {
                test : /.css$/,
                loader : 'style!css'
            },
            {
                test: /\.scss$/,
                loaders: ["sass"]
            }

        ]
    },

    plugins: [
        new webpack.optimize.CommonsChunkPlugin('vendors', 'vendors.js'),
        new HtmlWebpackPlugin({
        	template: './_index.html',
        	filename: 'counter.html',
        	inject: 'body',
        	chunks: ['vendors','app']
        })
    ]
};
```
没写注释。有过 webpack 开发经验的可以直接看源码，没有的需要回去补下课了，[webpack 官网](http://webpack.github.io/)。  
package.json 和 webpack.config没什么特别的地方，需要注意的是js(x)文件的加载器需要指定查询参数['react','es2015']，不分先后。

编写入口 index.js文件

```
import React from 'react';
import ReactDOM from 'react-dom';
import Counter from './components/counter';
import './css/layout.scss';

let box = document.querySelector('#box');

ReactDOM.render(
	<Counter />,
	box
)
``` 

components下先建 counter.js 

```
import React, { Component } from 'react';
import ReactDOM from 'react-dom';

export default React.createClass({
	render : ()=>{
		return (
			<div>
				<span>0</span>;
				<button>加一</button>;
				<button>减一</button>;
				<button>奇数加一</button>;
				<button>异步加一</button>;
			</div>;
		)	
	}
})
```

css目录下新建 scss 文件
 
```
body,html,div,span,button { margin: 0; padding: 0; }
$red : rgb(220, 20, 20);
$large : 13px;

@mixin backgroundClip($value:padding-box){
	-webkit-background-clip : $value;
	   -moz-background-clip : $value;
	    -o-background-clip : $value;
	    -ms-background-clip : $value;
	    	background-clip : $value;
}

@mixin appearance($value:none){
	-webkit-appearance : $value;
	   -moz-appearance : $value;
	    -o-appearance : $value;
	    -ms-appearance : $value;
	    	appearance : $value;
}

@mixin borderBox($value:border-box){
	-webkit-box-sizing : $value;
	   -moz-box-sizing : $value;
	    -o-box-sizing : $value;
	    -ms-box-sizing : $value;
	    	box-sizing : $value;
}

button { 
	@include appearance(none);		
}

.ui-btn {
	background-color : $red;
	background-image : -webkit-gradient(linear,left top,left bottom,color-stop(0.5,rgb(220, 20, 20)),to(rgb(220, 20, 20)));
	color : #fff;
	border-color : $red;
	border-radius : 3px;
	height:25px;
	line-height:25px;
	border:none;
	padding: 0 10px;
	font-size:$large;
	cursor:pointer;

}

.space {
	margin : 10px;
}

#box { 
	@extend .space;
}

#box {
	span,button { 
		@extend .space;
		outline: none; 
	} 

	button {
		@extend .ui-btn;
		@include backgroundClip(padding-box);

	}
}
```

再预览下
![预览](http://blog.guazipu.cn/wp-content/uploads/2016/05/31933B3C-D775-444E-8CCA-E50C92A27A8E.jpg)

###通信
到目前为止，一切看起来还是那么美好.改动的过程其实也主要集中在 Action和，Reducers。Components/counter 组件要完成4个行为：  
1. 点击“加一”按钮，数值+1  
2. 点击"减一"按钮，数值-1  
3. 点击奇数加一，数值唯独在奇数的时候才会产生+1的行为(action)  
4. 异步加一，数值在延迟N 秒后，产生+1  

看起来非常简单的需求，体现在 Redux 里面，会变成这样：
以加一为例，用户跟 view 交互产生一个加一的 action,该 action被redux派发给了 reducers, reducers返回一个新的改变之后的状态树，状态树的改变造成了 store 的改变，进而影响了 view重新发生组件渲染，数据单向流动 action->reducers-> store->view，view只能由 action改变来变化。

有人可能会问，这样似乎把问题复杂化了，组件改变的时候直接在 view 层调用 setState 変更 view 不就好了，看起来是把简单的问题复杂化了，其实不然，这里只是个简单的 demo，真实的情况要复杂的得多，假如有个购物车，会影响购物车状态变化的条件太多了，比如用户增减商品数量，用户清除购物车，用户退出登录，用户整条删除商品，随着组件增多，我们很难判断当前是哪个组件的 state 发生改变导致了购物车发生改变。使用 redux的单向数据流动每个 action 都在监控之下，方便关联组件状态。
那么，废话不多说，直接上代码：

counter.js
 
```
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';
import * as actions from '../actions/counter';

class Counter extends Component {
	render (){
		return (
			<div>
				<span ref='countHolder'>{this.props.count}</span>
				<button onClick={this.addHandler.bind(this)}>加一</button>
				<button onClick={this.reduceHandler.bind(this)}>减一</button>
				<button onClick={this.addIfOdd.bind(this)}>奇数加一</button>
				<button onClick={this.addAsync.bind(this)}>异步加一</button>
			</div>
		)
	}

	// 用户点击加一 组件通过访问 this.props.add 方法将新的 count 传给 action并执行
	addHandler(){
		let count = this.props.count;
		this.props.add(++count);
	}


	// 用户点击减一 组件通过访问 this.props.reduce 方法将新的 count 传给 action并执行
	reduceHandler(){
		let count = this.props.count;
		this.props.reduce(--count);
	}

	// 用户点击奇数加一，先做个逻辑处理，当且仅当奇数的时候才执行 this.props.add 方法
	addIfOdd(){
		if(this.props.count % 2 == 1){
			let count = this.props.count;
			this.props.add(++count);
		}
	}

	// 当且仅当数据返回(异步)的时候才执行 this.props.add 方法
	addAsync(){
		setTimeout(()=>{
			let count = this.props.count;
			this.props.add(++count);
		}, 1000)
	}
}

// 关联 props对应的属性到 state
function mapStateToProps(state){
	return {
		count : state.count
	};
}

// 将 state action绑定到 props 上 返回一个新的与 store 关联的组件
export default connect(mapStateToProps, actions)(Counter);
```
 
不清楚的地方可以看注释。connect 方法是 react-redux提供的工具方法，用法比较灵活，最多接受4个参数返回一个新的函数connect([mapStateToProps], mapDispatchToProps], [mergeProps], [options])，具体每个参数的意思可以查看官网文档，这里只说功能，这个返回的函数接受一个组件类，作为参数，注意是组件类，不是组件，最后才返回一个和 Redux Store关联起来的新组件。

为什么要返回一个跟 Redux Store关联的新组件?为了后面 reducer 也关联到同一个 store 做准备。再简单的说，就是把 action 和 state 绑定到了组件的 props上，使得原来 props可以直接访问 actions上定义的函数方法，访问 actions 上定义的纯函数方法，意味着执行 action。这就是为什么 this.props可以执行 add()/reduce()。

那么，为什么还要把 state也绑定给 props 呢，因为当 store发生改变的时候，state 也会发生改变，通过 state 的变化才能关联到对应的 props对应的属性也发生改变，变化组件的 props(即变化views)才是最终目的，有点绕，习惯了就会觉得这种处理方法比较精妙了，因为省去了各种手动执行 setState。

OK，继续。actions/action.js 的源码如下：

```
export function add(count){
	return {
		type : 'ADD',
		payload : count
	};
}

export function reduce(count){
	return {
		type : 'REDUCE',
		payload : count
	}
}

```
action.js 定义了2个函数接口，为什么要定义成函数形式，这是 redux的要求。redux 充分利用了函数式特性，使得整个实现更加优雅纯粹。为什么函数要返回一个{type, payload}的对象，一样的道理。类似的{type， payload}返回函数，在 actions内被称为 action creater。为了配合redux 传给 reducer,接受 payload传来的数据，再依据 type 的类型决定执行什么组件状态的更新。 

./reducers/reducer.js

```
export default function(state, action){
	switch(action.type){
		case 'ADD':
			return { count : action.payload };
		case 'REDUCE' :
			return { count : action.payload };
		default : 
			return { count : 0 };

	}
}
```

reducer也是个函数，(redux真是钟情于函数特性)。功能就是在 action触发之后返回一个新的 state (state, action) => newState。那么，问题又来了，为什么 action 触发后，事件能够被派发给 reducers，返回个新的 state 状态树?老司机继续往下改:

index.js
 
```
import React from 'react';
import ReactDOM from 'react-dom';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import Counter from './components/counter';
import reducer from './reducers/reducer';

import './css/layout.scss';

let box = document.querySelector('#box');
let store  = createStore(reducer);

ReactDOM.render(
	<Provider store = {store}>
		<Counter />
	</Provider>,
	box
)
```


重点在这几行代码：
 
```
import { createStore } from 'redux';
...
let store  = createStore(reducer);
...
```

createStore 是 redux提供的工具方法，接受reducer作为参数，使得 store 和 reducer关联在一起。为什么要关联？因为在此之前，actions跟 reducer 都没有关联过，action触发后如何被派发给 reducers 的？createStore 就是干了件这样的事情。action 通过 connect()绑定到了 props上,也关联到了 store上。store会把 action 派发给 reducers。

```
import { Provider } from 'react-redux';
...
ReactDOM.render(
	<Provider store = {store}>
		<Counter />
	</Provider>,
	box
) 
...
```
Provider是 react-redux 提供的容器组件，用来嵌套需要通信的子组件，比如这里的 <counter>,这样组件才能访问到 store，state的变化才能影响到子组件的 props。
源码戳<a href="https://github.com/189/counter" target="_blank">这里</a>

###吐槽一下

1. 概念太多，这里提到的 action,reducer,store,view，以及我没提到的，root reducer ,pure function, provider等，都是些需要理解的概念，仅此还没涉及到 route...
2. 更新太快，如果我不提供 package.json，过段时间这个 demo 估计都跑不了了
3. react 本身设计很简单，加入了通信框架之后瞬间变得复杂了，这只是个小案例，项目大起来维护起来依旧心累；
4. HTML 本身被碎片化，对这个褒贬不一，前端花了这么多年把 js和 css,html分离，现在又把 html 和 js揉在一起了，该说点什么好

###使用方法
```
$ npm install && npm run build
```

