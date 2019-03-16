const render = (vNode) => {
  let $el;
  if (vNode.tagName) {
    $el = document.createElement(vNode.tagName);
  } else {
    $el = document.createTextNode(vNode);
  }

  if (vNode.attrs)
    for (const [k, v] of Object.entries(vNode.attrs)) {
      $el.setAttribute(k, v);
    }

  if (vNode.children)
    vNode.children.forEach(vCh => {
      $el.append(render(vCh));
    });

  return $el;
};

export default render;
