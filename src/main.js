import createElement from './vdom/createElement';
import render from './vdom/render';
import mount from './vdom/mount';
import diff from './vdom/diff';

const createVApp = (count) => createElement('div', {
  attrs: {
    id: 'app',
    dataCount: count,
  },
  children: [
    createElement('input'),
    createElement('span', { children: [String(count)] }),
    createElement('img', {
      attrs: {
        src: `${
          count % 2 === 0 ?
          'https://media.giphy.com/media/ki1X172sb8x7uLyfYl/giphy.gif' :
          'https://media.giphy.com/media/35PYDhkVkOPEEAKzkc/giphy.gif'
        }`
      },
    }),
  ],
});

let count = 0;

let vApp = createVApp(count);
const $app = render(vApp);

let $rootEl = mount($app, document.getElementById('app'));

setInterval(() => {
  count++;
  // $rootEl = mount(render(createVApp(count)), $rootEl)
  const newVApp = createVApp(count);
  const patch = diff(vApp, newVApp);
  $rootEl = patch($rootEl);
  vApp = newVApp;
}, 1000);
