const show = id => {
  document.getElementById(id).children[0].children[2].className =
    'itemCrossButton';
};

const hide = id => {
  document.getElementById(id).children[0].children[2].className = 'hide';
};
