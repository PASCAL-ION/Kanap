const orderIdSpan = document.querySelector("#orderId")

function getCart(){
   return localStorage.getItem("orderId")
}

function showOrderId(){
    const cart = getCart()
    orderIdSpan.innerHTML = cart
    localStorage.clear()
}
showOrderId()