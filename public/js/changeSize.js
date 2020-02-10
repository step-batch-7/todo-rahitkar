const changeSize = (cols, rows, id) => {
  const commentBox = document.getElementById(id);
  commentBox.setAttribute('cols', cols);
  commentBox.setAttribute('rows', rows);
};
