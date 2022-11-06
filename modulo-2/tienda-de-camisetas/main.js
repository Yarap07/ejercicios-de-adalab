'use strict';

//Elements
const newTshirtsSection = document.querySelector('.js_Tshirts');
const shoppingCart = document.querySelector('.js_cart');
const userAddress = document.querySelector('.js_address');
const userCity = document.querySelector('.js_city');
const userZip = document.querySelector('.js_zip');

//Tshirt 1
const tshirt_1 = {
  name: 'Gatincho escondido',
  price: 12.5,
  img: './images/gatito-1.jpg',
  quantity: 1,
  decQuantity: function () {
    if (this.quantity > 0) {
      this.quantity -= 1;
    }
  },
};

//Tshirt 2
const tshirt_2 = {
  name: 'Gatincho feliz',
  price: 12.0,
  img: './images/gatito-2.jpg',
  quantity: 1,
  decQuantity: function () {
    if (this.quantity > 0) {
      this.quantity -= 1;
    }
  },
};

//Delivery
const userInfo = {};

//Functions

//Tshirts section
function renderTshirt(tshirt) {
  let newTshirt = `<article class="article">`;
  newTshirt += `<img class="image" src="${tshirt.img}" alt="${tshirt.name}">`;
  newTshirt += `<h3 class="title">${tshirt.name}</h3>`;
  newTshirt += `<p>${tshirt.price}</p>`;
  newTshirt += `<span>-----</span>`;
  newTshirt += `<button>Añadir a la cesta</button>`;
  newTshirt += `</article>`;

  return newTshirt;
}

function paintTshirts() {
  const newTshirt1 = renderTshirt(tshirt_1);
  const newTshirt2 = renderTshirt(tshirt_2);
  newTshirtsSection.innerHTML = newTshirt1 + newTshirt2;
}

//Cart section
function renderCartItem(tshirt) {
  let newCartItem = `<tr>`;
  newCartItem += `<td>${tshirt.name}</td>`;
  newCartItem += `<td>${tshirt.price}</td>`;
  newCartItem += `<td>`;
  newCartItem += `<button class="js_btn_dec">-</button>`;
  newCartItem += `${tshirt.quantity}`;
  newCartItem += `<button class="js_btn_inc">+</button>`;
  newCartItem += `</td>`;
  newCartItem += `<td>${tshirt.price * tshirt.quantity}</td>`;
  return newCartItem;
}

function renderTotalPrice(totalPrice) {
  let totalRow = ``;
  totalRow += `<tr>`;
  totalRow += `<td colspan='3'>Total</td>`;
  totalRow += `<td>${totalPrice}</td>`;
  totalRow += `</tr>`;
  return totalRow;
}

function paintCartItems() {
  shoppingCart.innerHTML = '';
  const finalPrice =
    tshirt_1.price * tshirt_1.quantity + tshirt_2.price * tshirt_2.quantity;
  const product1 = renderCartItem(tshirt_1);
  const product2 = renderCartItem(tshirt_2);
  const total = renderTotalPrice(finalPrice);
  shoppingCart.innerHTML = product1 + product2 + total;
  listenCartButtons();
  //Debo meter esta función de escucha aquí para completar el circulo constante de suma de cantidades
  //si pongo esta función fuera el flujo es el siguiente: se pinta la cesta, se escucha el boton, haciendo click se pinta una nueva cesta llamando de nuevo a la funcion y FIN. Aunque vuelva a hacer click ya no volverá a activarse el click.
  //Para que se active sin fin debemos: pintar la cesta, dentro de este pinta escuchamos el boton, incrementamos o decrementamos dependiendo de su if y volvemos a pintar la cesta hasta el fin de los tiempos
}

function handleQuantityBtn(ev) {
  const clickedBtn = ev.currentTarget;
  if (clickedBtn.classList.contains('js_btn_inc')) {
    tshirt_1.quantity += 1;
  } else {
    tshirt_1.decQuantity();
  }
  paintCartItems(); //fuera del If para que se decida lo que se decida en el if se pinta la selección final
}

function listenCartButtons() {
  const btnIncrement = document.querySelector('.js_btn_inc');
  const btnDecrement = document.querySelector('.js_btn_dec');
  //Debo llamar aquí a los botones, despues de su creacion con la invocación de la funcion pintadora de elementos del carrito porque hasta este momento no existian pero ahora sí existen
  btnIncrement.addEventListener('click', handleQuantityBtn);
  btnDecrement.addEventListener('click', handleQuantityBtn);
}

function handleAddress(ev) {
  const inputName = ev.currentTarget.name;
  userInfo[inputName] = ev.currentTarget.value;
  //Como lo hizo Ivan. Aqui utilizo un atributo gancho. Le paso como nombre de la propiedad de ese nuevo objeto vacío declarado anteriormente el vvalor del atributo name de mi inpuyt, que resulta que tiene el mismo nombre que la propiedad que queremos meterle. Después le metemos como valor el value del input que es lo que se ha recogido del evento de tipo input.

  //Forma larga y básica.
  //   if (ev.currentTarget.classList.contains('js_address')) {
  //     userInfo.address = ev.currentTarget.value;
  //   } else if (ev.currentTarget.classList.contains('js_city')) {
  //     userInfo.city = ev.currentTarget.value;
  //   }
}

//Events
paintTshirts();
paintCartItems();
userAddress.addEventListener('input', handleUserInfo);
userCity.addEventListener('input', handleUserInfo);
userZip.addEventListener('input', handleUserInfo);
