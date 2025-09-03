import { products } from "../data/products.js";
import { cart } from "../data/cart.js";
import { saveCart } from "../data/cart.js";






    let productHtml = '';
products.forEach((product)=>{
    

    productHtml+=
            `<div class="product"  data-id=${product.id}>
                <img src="${product.img}" alt="${product.name}">
                <div class="product-title">${product.name}
                </div>
                <div class="product-spacer"></div>
                <div class="product-bottom">
                    <p>₹${product.price}</p>
                    <button class="add-to-cart" >Add to Cart</button>
                </div>
                <div class="added-tooltip">Added!</div>

            </div>



       `;


});

document.querySelector(".productsGrid").innerHTML = productHtml;


//Adding ToolTip
const addToCarts = document.querySelectorAll(".add-to-cart"); //array like objects ko store krta hai;

addToCarts.forEach((button)=>{
    button.addEventListener('click', function(){
    
        const productCard = button.closest(".product");
        const id = productCard.dataset.id;
        const productObj = products.find(p => p.id == id);
        
        if(!productObj) return;

        const existingItem = cart.find(c => c.id === id);

        if(existingItem){
            existingItem.quantity += 1;
        }else{
            cart.push({
                ...productObj,
                quantity : 1
            });
        }
        
        saveCart();
        console.log(cart);

        //adding tooltip
        const tooltip = productCard.querySelector(".added-tooltip");

        tooltip.classList.add('show');

        setTimeout(()=>{
            tooltip.classList.remove('show');
        },2000);
    });

    
});



