const hideAllCards = () => {
  Array.from(document.querySelectorAll('.card')).forEach(
    card => (card.className = 'hide')
  );
};

const searchByName = () => {
  const titleElements = Array.from(document.querySelectorAll('.todoTitle'));

  const searchedName = document.querySelector('.nameSearch').value;

  hideAllCards();

  titleElements.forEach(titleElement => {
    if (titleElement.value.match(new RegExp(searchedName))) {
      const card = titleElement.parentElement.parentElement;
      card.className = 'card';
    }
  });
};

const iterate = function(iteratefn, value, times) {
  if (times === 0) {
    return value;
  }
  return iterate(iteratefn, iteratefn(value), times - 1);
};

const getParentElement = priValue => priValue.parentElement;

const searchByTask = () => {
  const taskContentElements = Array.from(
    document.querySelectorAll('.itemContent')
  );
  const searchedTask = document.querySelector('.taskSearch').value;

  hideAllCards();

  taskContentElements.forEach(taskContentElement => {
    if (taskContentElement.value.match(new RegExp(searchedTask))) {
      taskContentElement.style.backgroundColor = 'red';
      const card = iterate(getParentElement, taskContentElement, 5);

      card.className = 'card';
    }
  });
};
