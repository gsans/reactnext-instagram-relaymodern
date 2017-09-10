import React from 'react';
import ReactDOM from 'react-dom';
import { render } from 'react-dom'
import './index.css';
import App from './App';
import CreatePage from './CreatePage';
import registerServiceWorker from './registerServiceWorker';

import { HashRouter, Route, Switch } from 'react-router-dom'

render(
  <HashRouter>
    <div>
      <Switch>
        <Route exact path='/' component={App} />
        <Route path='/create' component={CreatePage} />
      </Switch>
    </div>
  </HashRouter>
 ,
  document.getElementById('root')
)
registerServiceWorker();