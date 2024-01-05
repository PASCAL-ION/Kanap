const productImg = document.querySelector(".item__img img")
const productPrice = document.querySelector("#price")
const productName = document.querySelector("#title")
const productDEscription = document.querySelector("#description")
const colorsSelect = document.querySelector("#colors")
const btnAddToCart = document.querySelector("#addToCart")
const itemQuantity = document.querySelector("#quantity")


/* Recuperation id dans l'url */
const queryString = window.location.search; /*On recupère l'url */
const urlParams = new URLSearchParams(queryString); /*On stocke l'objet "URLSearchParams" dans une variable. Cet objet va nous permettre d'analyser l'url*/
const productId = urlParams.get("id") /*on utilise ensuite la methode get pour recupérer les parametres qui nous interessent, ici on recup l'id de l'objet*/



function saveCart(cart){ /* sauvegarde le panier dans le localstorage */
    localStorage.setItem("cart", JSON.stringify(cart))
}

function getCart (){ /*Recuperer le panier dans le local storage */
    let cart = localStorage.getItem("cart")
    if(cart == null){ /* Si le panier n'existe pas */
        return [] /*On retourne un panier vide */
    }else{
        return JSON.parse(cart) /* Sinon on retourne le panier */
    } 
}

function addToCart(product){ /* Ajouter un produit au panier */
    let cart = getCart() /* On recup le panier dans le local storage */
    let foundProductById = cart.find(p => p.id == product.id)
    let foundProductByColor = cart.find(p => p.color == product.color)
    if(colorsSelect.value === "" || itemQuantity.value == 0){
        alert("couleur ou quantitée invalide")
        return   
    }else if ((foundProductById !== undefined)&&(foundProductByColor !== undefined)){
        alert("produit déjà ajouté au panier, quantitée modifiée")
        foundProductByColor.quantity = parseInt(itemQuantity.value) + parseInt(foundProductByColor.quantity) 
        saveCart(cart)
    }else {
        alert("produit ajouté au panier")
        product.quantity = itemQuantity.value
        cart.push(product) 
        saveCart(cart)
    }  

     /*Une fois le produit ajouté on enregistre le panier dans le localStorage */
}

async function getProductData (id){
    return fetch(`/api/products/${id}`) /*On utilise l'id pour ne récuperer que les donées d'un seul objet */
        .then(res => res.json())
}

function showInHTML () { // afficher les données sur la page html
    getProductData(productId).then(data => {
        let colors = data.colors
        productPrice.innerHTML = data.price
        productImg.src = data.imageUrl
        productImg.alt = data.altTxt
        productName.innerHTML = data.name
        productDEscription.innerHTML = data.description
        for (let i = 0; i < colors.length; i++){
            colorsSelect.innerHTML += `<option value="${colors[i]}">${colors[i]}</option>` 
        }
        
        btnAddToCart.addEventListener("click", () => {
            getCart()
            let dataObject = {
                "id" : data._id,
                "img" : data.imageUrl, 
                "color" : colorsSelect.value,
                "quantity" : 0, 
                "name" : data.name
            }
            addToCart(dataObject)
        })
    })
}

showInHTML()

