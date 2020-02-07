const showRequired = function() {

  setTimeout(() => {
    document.querySelector('button').innerText = ' add todo ';
  }, 1000);
  document.querySelector('button').innerText = 'input required';
};
