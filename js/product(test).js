const productImg = document.querySelector(".item__img img")
const productPrice = document.querySelector("#price")
const productName = document.querySelector("#title")
const productDEscription = document.querySelector("#description")
const colorsSelect = document.querySelector("#colors")
const btnAddToCart = document.querySelector("#addToCart")

/* Recuperation id dans l'url */
const queryString = window.location.search; /*On recupère l'url */
const urlParams = new URLSearchParams(queryString); /*On stocke l'objet "URLSearchParams" dans une variable. Cet objet va nous permettre d'analyser l'url*/
const productId = urlParams.get("id") /*on utilise ensuite la methode get pour recupérer les parametres qui nous interessent, ici on recup l'id de l'objet*/


async function appelAPI(id){
    return fetch(`http://localhost:3000/api/products/${id}`)
        .then((res) => res.json())
        .then((data) => {
            return data
        })
}

function affichageProduit (){
    const data = appelAPI(productId)
    console.log(data); 
}
affichageProduit()

function saveCart (cart){
    localStorage.setItem("cart", cart)
}



/* function getCart(){
    return localStorage.getItem("cart")

} */