import _ from 'lodash';
import './style.css';
import './style.scss';
import './style.less';
import Edit from './edit.png';
import Data from './data.xml';
import printMe from './print';
import path from 'path';
// import webpack from 'webpack';

// console.log(webpack.optimize.UglifyJsPlugin);

console.log(path);
console.log(path.join('assets', 'js/asm.js'));

function component() {
  var element = document.createElement('div');
  var btn = document.createElement('button');
  // console.log(element.classList);

  // Lodash（目前通过一个 script 脚本引入）对于执行这一行是必需的
  element.innerHTML = _.join(['Hello', 'webpack'], ' ');
  element.classList.add('hello');

  // 将图像添加到 body 中。
  var myIcon = new Image();
  myIcon.src = Edit;
  document.body.appendChild(myIcon);

  console.log('xmlData===', Data);

  // 添加按钮到 body 中。
  btn.innerHTML = 'Click me and check the coe!';
  btn.onclick = printMe;
  document.body.appendChild(btn);

  console.log('PRODUCTION==', process.env);
  // console.log('PRODUCTION==', PRODUCTION);
  // console.log('VERSION==', VERSION);
  // console.log('BROWSER_SUPPORTS_HTML5==', BROWSER_SUPPORTS_HTML5);
  // console.log('TWO==', TWO);
  // console.log('process==', BASE_API_TEST);
  // console.log('object===', object);

  return element;
}

// document.body.appendChild(component());
let element = component(); // 当 print.js 改变导致页面重新渲染时，重新获取渲染的元素
document.body.appendChild(element);

console.log('module===', module);

if (module.hot) {
  module.hot.accept('./print', function() { // dep（依赖路径），callback（回调函数）
    console.log('Accepting the updated printMe module!');
    // printMe();
    document.body.innerHTML = '';
    element = component(); // 重新渲染页面后，component 更新 click 事件处理
    document.body.appendChild(element);
  })
}