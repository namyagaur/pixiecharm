export let cart = JSON.parse(localStorage.getItem('cart')) || [];
//in case cart already h toh vo load ho

export function saveCart(){
    localStorage.setItem('cart', JSON.stringify(cart));
}

