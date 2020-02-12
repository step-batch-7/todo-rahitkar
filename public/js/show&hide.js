const show = id => {
  document.getElementById(id).classList.replace('hide', 'itemCrossButton');
};

const hide = id => {
  document.getElementById(id).classList.add('hide');
};
