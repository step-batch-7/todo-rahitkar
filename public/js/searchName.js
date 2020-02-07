const searchName = () => {
  const titleElements = Array.from(document.querySelectorAll('.title'));
  const searchedName = document.querySelector('.nameSearch').value;
  Array.from(document.querySelectorAll('.card')).forEach(
    card => (card.className = 'hide')
  );

  titleElements.forEach(titleElement => {
    if (titleElement.innerText === searchedName) {
      const card = titleElement.parentElement.parentElement;
      card.className = 'card';
    }
  });
};
