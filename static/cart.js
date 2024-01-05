const cartItems = document.querySelector(".cart #cart__items")
const totalItems = document.querySelector("#totalQuantity")
const totalPrice = document.querySelector("#totalPrice")



const queryString = window.location.search; /*On recupère l'url */
const urlParams = new URLSearchParams(queryString); /*On stocke l'objet "URLSearchParams" dans une variable. Cet objet va nous permettre d'analyser l'url*/
const productId = urlParams.get("id") /*on utilise ensuite la methode get pour recupérer les parametres qui nous interessent, ici on recup l'id de l'objet*/



function saveCart(cart){ /* sauvegarde le tableau passé en parametres avec la clé "cart" */
    localStorage.setItem("cart", JSON.stringify(cart))
  }
  
function getCart (){ // Recupère le tableau tu local storage ayant la clé "cart"
    let cart = JSON.parse(localStorage.getItem("cart"))
    return cart
}

function displayInHTML(data){ //afficher les données du local storage
  let cart = getCart()
  for(let j = 0; j < cart.length; j++){
    const id = cart[j].id
    const i = data.findIndex((productInData) => productInData._id === id) //dans data on cherche le mm id que celui du produit actuel
      cartItems.innerHTML += 
        `<article class="cart__item" data-id="${cart[j].id}" data-color="${j.color}" data-price="${data[i].price}"> <!--On utilise i pour ne selectionner que le produit actuel de la boucle-->
          <div class="cart__item__img">
              <img src="${cart[j].img}" alt="Photographie d'un canapé">
          </div>
          <div class="cart__item__content">
              <div class="cart__item__content__description">
                <h2>${cart[j].name}</h2>
                <p>${cart[j].color}</p>
                <p>${data[i].price * cart[j].quantity} €</p>
              </div>
            <div class="cart__item__content__settings">
              <div class="cart__item__content__settings__quantity">
                <p>Qté : </p>
                <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${cart[j].quantity}">
              </div>
              <div class="cart__item__content__settings__delete">
                <p class="deleteItem">Supprimer</p>
              </div>
            </div>  
          </div>
        </article>`; 
  }
}

    
function deleteProduct () { //suppression de produit
    const deleteBtns = document.querySelectorAll(".cart__item__content__settings__delete")
    let cart = getCart()
    deleteBtns.forEach(btn => {
      btn.addEventListener("click", (e) => {
        const thisArticle = e.target.closest("article")
        const thisArticleID = thisArticle.getAttribute("data-id")
        const thisArticleColor = thisArticle.getAttribute("data-color")
        const thisArticlePrice = thisArticle.getAttribute("data-price")
        const thisArticleInput = thisArticle.querySelector(".itemQuantity")
        const indexOfItem = cart.findIndex(item => ((item.id == thisArticleID)&&(item.color == thisArticleColor)))
        cart.splice(indexOfItem, 1)
        saveCart(cart) 
        // supprimer l'article de la page
        thisArticle.remove()
        //mise a jour du prix et de la quantité totale
        totalPrice.innerHTML = parseInt(totalPrice.innerHTML) - (parseInt(thisArticlePrice) * thisArticleInput.value)
        totalItems.innerHTML = parseInt(totalItems.innerHTML) - parseInt(thisArticleInput.value)
    })
  })
}
    
async function changeProductQuantity () { //changer la quantité pour les produits
  let response = await fetch(`/api/products/`)
  let data = await response.json()
  displayInHTML(data)
  const articles = document.querySelectorAll('[data-id]')
  let itemsNumberAtStart = []
  let totalPriceAtStart = []
  articles.forEach(article => {
    
    const price = article.querySelector(".cart__item__content .cart__item__content__description p:last-child")
    const inputQuantity = article.querySelector(".cart__item__content .cart__item__content__settings .cart__item__content__settings__quantity input")
    let itemPrice = article.getAttribute("data-price")

    //Afficher le nb total d'items avant modification de quantité
    const totalItems = document.querySelector(".cart__price #totalQuantity")
    itemsNumberAtStart.push(inputQuantity.value)
    totalItems.innerHTML = itemsNumberAtStart.reduce((sum, curentValue) => parseInt(sum) + parseInt(curentValue))
    //.....................................................................................................

    //Afficher le prix total avant modification de quantité
    const totalPrice = document.querySelector(".cart__price #totalPrice") 
    totalPriceAtStart.push(parseInt(price.innerHTML))
    totalPrice.innerHTML = totalPriceAtStart.reduce((sum, curentValue) => sum + curentValue)
    //........................................................................................................

    inputQuantity.addEventListener("change", () => {
      price.innerHTML = `${parseInt(inputQuantity.value) * parseInt(itemPrice)} €`
      calcTotal()
    })
  })
  deleteProduct() // Refresh la page donc le nombre des produits non supprimés se remet a la valeur de "quantity" dans le localhost !! Supprime aussi les autres produits du même id
}
changeProductQuantity()  

function calcTotal (){ //calculer le prix total et le total d'articles
  const totalPrice = document.querySelector(".cart__price #totalPrice") 
  let arrTotalPrice = []
  const AllPrices = document.querySelectorAll(".cart__item__content .cart__item__content__description p:last-child")
  AllPrices.forEach(price => {
    arrTotalPrice.push(parseInt(price.innerHTML))
    totalPrice.innerHTML = arrTotalPrice.reduce((sum, curentValue) => sum + curentValue)
  })

  const totalItems = document.querySelector(".cart__price #totalQuantity")
  let arrInputsValue = []
  const AllInputs = document.querySelectorAll(".itemQuantity")
  AllInputs.forEach(input =>{
    arrInputsValue.push(parseInt(input.value))
    totalItems.innerHTML = arrInputsValue.reduce((sum, curentValue) => sum + curentValue)
  })
}


/*****Envoi du formulaire****** */

const form = document.querySelector(".cart__order__form")
const firstName = form.querySelector("#firstName")
const lastName = form.querySelector("#lastName")
const city = form.querySelector("#city")
const address = form.querySelector("#address")
const email = form.querySelector("#email")

form.addEventListener("submit", (e) => { 
  if(validNameAndCity(lastName) && validNameAndCity(firstName) && validNameAndCity(city) && validAddress(address) && validEmail(email)){
    postForm()
    e.preventDefault()
  }else{
    e.preventDefault()
    console.log("err");
  }
})

function postForm (){ // fetch vers le serveur avec les donnés de la page
  let cart = getCart()
  let productsArr = []
  for (let product of cart){
    productsArr.push(product.id);
  }
  const body = {
    contact: {
    firstName: firstName.value,
    lastName: lastName.value,
    address: address.value,
    city: city.value,
    email: email.value
  },
  products: productsArr
  }

  fetch('/api/products/order',{
    method: 'POST',
    body: JSON.stringify(body),
    headers: {
      "Content-Type": "application/json"
    }
  })
  .then(response => response.json())
  .then(data => {
    window.location.href = 'http://127.0.0.1:5500/front/html/confirmation.html'
    localStorage.setItem("orderId",  data.orderId)
  })
  .catch(err => console.log(err))
}

  //Prénom, Nom et ville début.....................
  firstName.addEventListener("change", () => {
    validNameAndCity(firstName)
  })
  
  lastName.addEventListener("change", () => {
    validNameAndCity(lastName)
  })
  
  city.addEventListener("change", () => {
    validNameAndCity(city)
  })
  
function validNameAndCity (input){
    const regExName = new RegExp('^[a-zA-Z\-]+$') 
    
    if(regExName.test(input.value)){
      input.nextElementSibling.innerHTML = ""
      return true
    } else {
      input.nextElementSibling.innerHTML = "Champ invalide"
      return false
    }
    
  }
  //Prénom et nom fin...............................
  
  //Adresse début.............................
  
  address.addEventListener("change", () => {
    validAddress(address)
  })
  
function validAddress (addressInput){
    const regExAddress = new RegExp('^[\\d]+\\s[a-z|A-Z\\s]+')
  
    if(regExAddress.test(addressInput.value)){
      addressInput.nextElementSibling.innerHTML = ""
      return true
    } else {
      addressInput.nextElementSibling.innerHTML = "Champ invalide"
      return false
    }
  }
  //Adresse fin................................
  
  //Email début.................................
  
  email.addEventListener("change", () =>{
    validEmail(email)
  })
  
  function validEmail(inputEmail){
    const regExEmail = new RegExp('[a-z0-9]+@[a-z]+\\.[a-z]{2,3}')
  
    if(regExEmail.test(inputEmail.value)){
      inputEmail.nextElementSibling.innerHTML = ""
      return true
    } else {
      inputEmail.nextElementSibling.innerHTML = "Champ invalide"
      return false
    }
  }
  //Email fin.......................................
  
  //Fin d'analyse des données du form



