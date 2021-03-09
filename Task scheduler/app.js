function solve() {

    const divCompleted = document.querySelector('.wrapper section:nth-child(4) div:nth-child(2)');
    const divProgressed = document.querySelector('.wrapper section:nth-child(3) div:nth-child(2)');
    const divOpen = document.querySelector('.wrapper section:nth-child(2) div:nth-child(2)');

    const fieldDate = document.getElementById('date');
    const fieldDescription = document.getElementById('description');
    const fieldTask = document.getElementById('task');
    const buttonAdd = document.getElementById('add');


    buttonAdd.addEventListener('click', function(e) {
        e.preventDefault();

        if (fieldTask.value !== '' && fieldDescription.value !== '' && fieldDate.value !== '') {

            const descriptionParagraph = document.createElement('p');
            const dateParagraph = document.createElement('p');
            const heading3 = document.createElement('h3');
            const article = document.createElement('article');
            const divFlex = document.createElement('div');
            const buttonDelete = document.createElement('button');
            const buttonFinish = document.createElement('button');
            const buttonStart = document.createElement('button');

            heading3.textContent = fieldTask.value.trim();
            descriptionParagraph.textContent = `Description: ` + fieldDescription.value.trim();
            dateParagraph.textContent = `Due Date: ` + fieldDate.value.trim();

            buttonStart.textContent = 'Start';
            buttonDelete.textContent = 'Delete';
            buttonFinish.textContent = 'Finish';

            article.appendChild(heading3);
            article.appendChild(descriptionParagraph);
            article.appendChild(dateParagraph);

            divFlex.classList.add('flex');
            buttonStart.classList.add('green');
            buttonDelete.classList.add('red');
            buttonFinish.classList.add('orange');

            divFlex.appendChild(buttonStart);
            divFlex.appendChild(buttonDelete);

            article.appendChild(divFlex);
            divOpen.appendChild(article);

            document.getElementById('task').value = '';
            document.getElementById('description').value = '';
            document.getElementById('date').value = '';

            buttonStart.addEventListener('click', function(e) {

                divProgressed.appendChild(article);
                buttonStart.remove();
                divFlex.appendChild(buttonFinish);
            });

            buttonFinish.addEventListener('click', function(e) {

                divCompleted.appendChild(article);
                divFlex.remove();
            });

            buttonDelete.addEventListener('click', function(e) {

                article.remove();
            });
        }
    });
}