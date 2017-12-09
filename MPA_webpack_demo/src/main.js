// import _ from 'lodash';
import './style.css';
// import './style.min.css';
import './style.scss';
import './style.less';
import Edit from './edit.png';
import Data from './data.xml';
import printMe from './print';

console.log('$===', $, jQuery);
// console.log('moment===', moment);

$.ajax('/api_service/call/makeCall', {
  type: 'POST',
  data: {
    businessId: '1212',
    choice: 'sd==ll',
  },
  success(data, textStatus, xhr) {
    console.log(data, textStatus, xhr);
  },
});

function component() {
  const element = document.createElement('div');
  const btn = document.createElement('button');
  // console.log(element.classList);

  // Lodash（目前通过一个 script 脚本引入）对于执行这一行是必需的
  element.innerHTML = 'Hello webpack';
  element.classList.add('hello');
  element.classList.add('div1');

  // 将图像添加到 body 中。
  const myIcon = new Image();
  myIcon.src = Edit;
  document.body.appendChild(myIcon);

  console.log('xmlData===', Data);

  // 添加按钮到 body 中。
  btn.innerHTML = 'Click me and check the coe!';
  btn.onclick = printMe;
  document.body.appendChild(btn);

  console.log('PRODUCTION似懂撒多非懂==', process.env);
  // console.log('PRODUCTION==', PRODUCTION);
  // console.log('VERSION==', VERSION);
  // console.log('BROWSER_SUPPORTS_HTML5==', BROWSER_SUPPORTS_HTML5);
  // console.log('TWO==', TWO);
  // console.log('process==', BASE_API_TEST);
  // console.log('object===', object);

  const divMin = document.createElement('div');
  divMin.style.width = '200px';
  divMin.style.height = '200px';
  divMin.id = 'minDiv';
  document.body.appendChild(divMin);

  return element;
}

// document.body.appendChild(component());
const element = component(); // 当 print.js 改变导致页面重新渲染时，重新获取渲染的元素
document.body.appendChild(element);
