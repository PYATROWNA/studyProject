// document.addEventListener("DOMContentLoaded", function() {
//     document.getElementById("burger").addEventListener("click", function() {
//         document.querySelector("header").classList.toggle("open");
//     });
// });


// const deadline = '2023-03-11';

// function getTimeRemaining(endtime) {
//     const t = Date.parse(endtime) - Date.parse(new Date());

    
// }


// function animation(args, elem) { // некоторые аргументы определим на будущее
// 	var $ = {
// 		radius  :     250, // радиус окружности 
// 		speed   :     20 // скорость/задержка ( в js это мс, например 10 мс = 100 кадров в секунду)
// 	}
// 	var f = 0;
// 	var s = 2 * Math.PI / 180; //Вычислим угол
// 	setInterval(function() { // функция движения 
// 		f += s; // приращение аргумента
// 		  elem.style.left =  235 + $.radius * Math.sin(f)  + 'px'; // меняем координаты элемента, подобно тому как мы это делали в школе в декартовой системе координат. Правда, в данном случае используется полярная система координат, изменяя угол
// 		  elem.style.top =   235 + $.radius * Math.cos(f) + 'px';
// 	}, $.speed)
// }


let options = { threshold: [0.5] };
let observer = new IntersectionObserver(onEntry, options);
let elements = document.querySelectorAll('.container');
for (let elm of elements) {
  observer.observe(elm);
}

function onEntry(entry) {
    entry.forEach(change => {
      if (change.isIntersecting) {
        change.target.classList.add('show');
      }
    });
  }



// модальное окно

// const modalTrigger = document.querySelectorAll('[data-modal]'),
// modal = document.querySelector('.modal'),
// modalCloseBtn = document.querySelector('[data-close]');

// modalTrigger.forEach(btn => {
// btn.addEventListener('click', function() {
//     modal.classList.add('show');
//     modal.classList.remove('hide');
//     // Либо вариант с toggle - но тогда назначить класс в верстке
//     document.body.style.overflow = 'hidden';
// });
// });

// function closeModal() {
// modal.classList.add('hide');
// modal.classList.remove('show');
// // Либо вариант с toggle - но тогда назначить класс в верстке
// document.body.style.overflow = '';
// }

// modalCloseBtn.addEventListener('click', closeModal);


// modal.addEventListener('click', (e) => {
//     if (e.target === modal) {
//         closeModal();
//     }



//     function showThanksModal(){
//         const prevModalDialog = document.querySelector('.modal__dialog');

//         prevModalDialog.classList.add('hide');
//         openModal();

//         const thanksModal = document.createElement('div');
//         thanksModal.classList.add('modal__dialog');
//         thanksModal.innerHTML = `
//         <div class="modal__content"></div>
//         `;

//     }
// });


const modalActivator = document.querySelectorAll('[data-modal]');  //получим все кнопки для модалки
const modal = document.querySelector('.modal'); //получим модалку


//пишем функцию для вызова модалки при нажатии на кнопку

modalActivator.forEach(btn => { //кнопкой с триггером  modalActivator
    btn.addEventListener('click', function(){
        modal.classList.add('show');
        modal.classList.remove('hide'); //назначаются классы на другой элемент, .modal
    })

});


function closeModal(){
    modal.classList.add('hide');
    modal.classList.remove('show');
    document.body.style.overflow = '';

}

function openModal() {
    modal.classList.add('show');
    modal.classList.remove('hide');
    document.body.style.overflow = 'hidden';
    clearInterval(modalTimerId);
}

modal.addEventListener('click', (e) => {
    if (e.target === modal || e.target.getAttribute('data-close') === '') {
        closeModal();
    }
})

const modalTimerId = setTimeout(openModal, 300000);

//отправка формы

const forms = document.querySelectorAll('form'); //объявляем переменную forms, которая получает все формы
const message ={ // просто объект с сообщениями
    loading: '../src\img\form\spinner.svg',
    success: 'Спасибо! Скоро мы с вами свяжемся',
    failure: 'Что-то пошло не так...'
};




function postData(form) { //при отправки формы вставляем туда объект
    form.addEventListener('submit', (e) => {
        e.preventDefault(); //запрещаем браузеру обновлять страницу

        let statusMessage = document.createElement('img'); //чтоб сообщение появлялось, создаем div
        statusMessage.src = message.loading; //чтоб div появлялся, обновляем класс
        statusMessage.style.cssText = `
        display: block;
        margin: 0 auto;`; //если идет загрузка, выводится loading: 'Загрузка...'
        form.insertAdjacentElement('afterend', statusMessage);
    
 //header запроса
        const formData = new FormData(form);//это специальная коллекция данных, которая позволяет передавать данные в виде пар [ключ, значение] на сервер при помощи fetch() или XMLHttpRequest
        //собираем все данные с формы, крч

        const object = {}; //??
        formData.forEach(function(value, key){
        object[key] = value; 
    });
       //const json = JSON.stringify(object);//преобразует значение JavaScript в строку JSON, возможно с заменой значений

        fetch('../server.php',{
            method: "POST",
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify(object)
        }).then(data => data.text())
        .then(data => {
            console.log(data);
            showThanksModal(message.success);//выводим "заебись"
            form.reset();// восстанавливает стандартные значения всем элементам формы
            statusMessage.remove(); //удаляем спиннер после выполнения
        }).catch(() => {
            showThanksModal(message.failure); //в случае возникновения ошибки посылаем пользователю уведомление
        }).finally(() => {
            form.reset(); // скидываем форму после выполнения
        })


    });
}
forms.forEach(item => { //в формы будем пихать объект
    postData(item);
});


function showThanksModal(message){
    const prevModalDialog = document.querySelector('.modal__dialog'); //получаем элемент с классом modal dialog
    prevModalDialog.classList.add('hide');
    openModal()
    
    const thanksModal = document.createElement('div');
    thanksModal.classList.add('modal__dialog');
    thanksModal.innerHTML = `
        <div class='modal__content'>
            <div class='modal__close'>×</div>
            <div class='modal__title'>
                ${message}
            </div>
        </div>
    `;

    document.querySelector('.modal').append(thanksModal);
    setTimeout(() => {
        thanksModal.remove();
        prevModalDialog.classList.add('show');
        prevModalDialog.classList.remove('hide');
        closeModal();
    }, 4000);
}


fetch('http://localhost:3000/menu')
    .then(data => data.json())
    .then(res => console.log(res));


