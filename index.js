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