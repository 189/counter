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