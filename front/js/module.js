export function saveCart(cart){ /* Cette fonction va enregistrer le panier dans le localStorage */
    localStorage.setItem("cart", JSON.stringify(cart))
}

 function getCart(){ /* Cette fonction recupere un item dans le panier du local storage */
    let cart = localStorage.getItem("cart")
    if(cart == null){ /* Si le panier n'existe pas */
        return [] /*On retourne un panier vide */
    }else{
        return JSON.parse(cart) /* Sinon on retourne le panier */
    } 
}

 function addToCart(product){ /* Ajouter un produit au panier */
    let cart = getCart() /* On recup le panier dans le local storage */
    let foundProduct = cart.find(p => p.id == product.id) //On cherche dans le tableau si l'id du produit existe deja
    if (foundProduct != undefined){ //si le produit existe
        foundProduct.quantity++ //on incremente de 1 la quantité
    }else{ //sinon on parametre la quantité a 1 et on ajoute le produit au panier
        product.quantity = 1
        cart.push(product) 
    }
    saveCart(cart) /*Une fois le produit ajouté on enregistre le panier dans le localStorage */
}

 function removeFromCart(product){ //retirer produit
    let cart = getCart() /* On recup le panier dans le local storage */
    cart = cart.filter(p => p.id != product.id) //on filtre pour garder tous les produits qui ont un id different de celui qu'on cherche ce qui va supprimer juste ce dernier
    saveCart(cart) //on reenregistre le panier dans le localStorage
}

 function changeQuantity (product, quantity){
    let cart = getCart()
    let foundProduct = cart.find(p => p.id == product.id)
    if (foundProduct != undefined){
        foundProduct.quantity += quantity
        if(foundProduct.quantity <= 0){
            removeFromCart(foundProduct)
        }else{
            saveCart(cart)
        }
    }
}

 function getNumberOfProduct (){
    let cart = getCart()
    let number = 0
    for (let product of cart){
        number += product.quantity
    }
    return number
}

 function getTotalPrice (){
    let cart = getCart()
    let total = 0
    for (let product of cart){
        total += product.quantity * product.price
    }
    return total
}

