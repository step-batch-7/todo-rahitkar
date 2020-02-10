const getCards = () => {
  return Array.from(document.querySelectorAll('.card'));
};

const hideAllCards = () => {
  Array.from(document.querySelectorAll('.card')).forEach(card => {
    card.className = 'hide';
  });
};

const iterate = function(iterateFn, value, times) {
  if (times === 0) {
    return value;
  }
  return iterate(iterateFn, iterateFn(value), times - 1);
};

const getParentElement = priValue => priValue.parentElement;

const searchByName = () => {
  const titleElements = Array.from(document.querySelectorAll('.todoTitle'));

  const searchedName = document.querySelector('.nameSearch').value;

  hideAllCards();

  titleElements.forEach(titleElement => {
    if (titleElement.value.match(new RegExp(searchedName))) {
      const card = iterate(getParentElement, titleElement, 2);
      console.log(card);

      card.className = 'card';
    }
  });
};

const searchByTask = () => {
  const taskContentElements = Array.from(
    document.querySelectorAll('.itemContent')
  );
  const searchedTask = document.querySelector('.taskSearch').value;

  hideAllCards();

  taskContentElements.forEach(taskContentElement => {
    if (taskContentElement.value.includes(searchedTask)) {
      taskContentElement.style.backgroundColor = 'red';

      const card = iterate(getParentElement, taskContentElement, 5);

      card.className = 'card';
    }
  });
};
