const searchByName = () => {
  const titleElements = Array.from(document.querySelectorAll('.title'));
  
  const searchedName = document.querySelector('.nameSearch').value;
  Array.from(document.querySelectorAll('.card')).forEach(
    card => (card.className = 'hide')
  );

  titleElements.forEach(titleElement => {
    if (titleElement.value.match(new RegExp(searchedName))) {
      const card = titleElement.parentElement.parentElement;
      card.className = 'card';
    }
  });
};

const searchByTask = () => {
  const taskContentElements = Array.from(
    document.querySelectorAll('.itemContent')
  );
  const searchedTask = document.querySelector('.nameSearch').value;
  Array.from(document.querySelectorAll('.card')).forEach(
    card => (card.className = 'hide')
  );
  taskContentElements.forEach(taskContentElement => {
    if (taskContentElement.value.match(new RegExp(searchedTask))) {
      taskContentElement.style.colour = 'red';
      const card =
        taskContentElement.parentElement.parentElement.parentElement
          .parentElement.parentElement;
      card.className = 'card';
    }
  });
};
