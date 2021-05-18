const addToCart = (productId, path) => {
    userStorage = {}
    if (localStorage.getItem('userToken') === null) {
        userStorage.userToken = Math.floor(Math.random() * (999999 - 122222 + 1) + 122222);
        localStorage.setItem("userToken", userStorage.userToken)
    } else {
        userStorage.userToken = localStorage.getItem('userToken');
    }

    $.ajax({
        type: "POST",
        url: path,
        data: {
            user_token: userStorage.userToken,
            product_id: productId
        }, 
        success: (response) => {
            let cartCount = JSON.parse(response["cart_count"]);
            let instance = JSON.parse(response["instance"]);
            let productId = JSON.parse(response["productId"]);

            let data = instance[0]['fields'];
            let productList = JSON.parse(localStorage.getItem("productList"));
            if (productList) {
                productList.push(productId)
                localStorage.setItem("productList", JSON.stringify(productList))
            } else {
                localStorage.setItem("productList", JSON.stringify([productId]))
            }
            localStorage.setItem("cartCount", cartCount);
            document.getElementById("cart-count").innerHTML = localStorage.getItem("cartCount");
            console.log(data)
            $("#cart-items").append(`
                <div class="cart-item" id="cart-item-${productId}">
                    <img class="cart-item-img" src="/media/${data.product_image}"/>
                    <p class="cart-item-price">$${data.price}</p>
                    <p class="cart-item-name">${data.name}</p>
                    -
                    <p class="cart-item-description">${data.description.length > 15 ? data.description.substring(0, 15) : data.description}...</p>
                    <button class="remove-item" onclick="removeItemFromCart(${productId})" id="remove-cartitem-${productId}">x</button>
                </div>
            `)

            $(`#add-item-${productId}`).remove()
            $(`#cart-handler-${productId}`).append(
                `
                    <button class="add-item-cart" id="remove-item-${productId}" onclick="removeItemFromCart('${productId}')">
                        Remove from Cart
                    </button>
                `
            )
        }, error: (response) => {
            console.log(response["responseJSON"]["error"]);
        }
    })
}

const removeItemFromCart = (productId) => {
    const path = window.location.origin + '/manage/removecartitem/'
    userStorage = {}
    if (localStorage.getItem('userToken') === null) {
        userStorage.userToken = Math.floor(Math.random() * (999999 - 122222 + 1) + 122222);
        localStorage.setItem("userToken", userStorage.userToken)
    } else {
        userStorage.userToken = localStorage.getItem('userToken');
    }
    
    $.ajax({
        type: "POST",
        url: path,
        data: {
            user_token: userStorage.userToken,
            product_id: productId
        }, 
        success: (response) => {
            let productId = JSON.parse(response["productId"]);
            let productList = JSON.parse(localStorage.getItem("productList"));
            productList = productList.filter(p => p != productId);

            localStorage.setItem("productList", JSON.stringify(productList))
            const cartCount = localStorage.getItem("cartCount")
            localStorage.setItem("cartCount", Number(cartCount) - 1);
            document.getElementById("cart-count").innerHTML = localStorage.getItem("cartCount");
            let addPath = window.location.origin + '/manage/addcartitem/'
            $(`#cart-item-${productId}`).remove()
            $(`#remove-item-${productId}`).remove()
            $(`#cart-handler-${productId}`).append(
                `
                <button class="add-item-cart" id="add-item-${productId}" onclick="addToCart('${productId}', '${addPath}')">
                    Add to Cart
                </button>
                `
            )
        }, error: (response) => {
            console.log(response["responseJSON"]["error"]);
        }
    })
}

const sortResults = (type, queryString) => {
    const path = `${window.location.origin}/getproducts?q=${queryString}&t=${type}`
    
    $.ajax({
        type: "GET",
        url: path, 
        success: (response) => {
            let productList = JSON.parse(response["products_list"]);
            let addPath = window.location.origin + '/manage/addcartitem/'
            $(`.inner-scroll-wrapper`).empty()
            for (let i = 0; i < productList.length; i++) {
                let doesExist = JSON.parse(localStorage.getItem("productList"));
                    buttonHandler = ``
                    if (doesExist) {
                        if (doesExist.indexOf(productList[i].id) !== -1) {
                            buttonHandler =
                                `
                                    <button class="add-item-cart" id="remove-item-${productList[i].id}" onclick="addToCart('${productList[i].id}', '${addPath}')">
                                        Remove from Cart
                                    </button>
                                `
                        } else {
                            buttonHandler =
                                `
                                    <button class="add-item-cart" id="add-item-${productList[i].id}" onclick="addToCart('${productList[i].id}')">
                                        Add to Cart
                                    </button>
                                `
                        }
                    }
                $(`.inner-scroll-wrapper`).append(
                    `
                    <div class="scroll-card">
                        <div class="scroll-card-inner">
                            <h4 class="product-name">
                                ${productList[i].name}
                            </h4>
                            <img class="scroll-card-image" src="${productList[i].product_image}"/>
                            <p class="product-description">${productList[i].description}</p>
                            <div class="add-cart" id="cart-handler-${productList[i].id}">
                                <p class="product-price">$${productList[i].price}</p>
                                ${buttonHandler}
                            </div>
                        </div>
                    </div>
                    `
                )

            }
            
        }, error: (response) => {
            console.log(response["responseJSON"]["error"]);
        }
    })
}


const formHandler = ev => ev.preventDefault();

const products = document.getElementsByClassName('cart-form');
for (let i = 0; i < products.length; i++) {
    products.item(i).addEventListener("submit", formHandler, true);
}

const hideShowCart = () => {
    $("#cart").toggle()
}

window.onload = () => {
    const userToken = localStorage.getItem("userToken")

    if (userToken !== null) {
        const path = `${window.location.origin}/getcartitems/?userToken=${userToken}`
        $.ajax({
            type: "GET",
            url: path, 
            success: (response) => {
                let products = JSON.parse(response["products_list"]);
                const cartCount = JSON.parse(response["cart_count"])
                document.getElementById("cart-count").innerHTML = cartCount

                console.log(products)
                for (let i = 0; i < products.length; i++) {
                    let doesExist = JSON.parse(localStorage.getItem("productList"));
                    $("#cart-items").append(`
                        <div class="cart-item" id="cart-item-${products[i].id}">
                            <img class="cart-item-img" src="${products[i].product_image}"/>
                            <p class="cart-item-price">$${products[i].price}</p>
                            <p class="cart-item-name">${products[i].name}</p>
                            -
                            <p class="cart-item-description">${products[i].description.length > 15 ? products[i].description.substring(0, 15) : products[i].description}...</p>
                            <button class="remove-item" onclick="removeItemFromCart(${products[i].id})" id="remove-cartitem-${products[i]}">x</button>
                        </div>
                    `)
                    console.log(products[i].id, doesExist)
                    if (doesExist) {
                        if (doesExist.indexOf(products[i].id) !== -1) {
                            $(`#add-item-${products[i].id}`).remove()
                            $(`#cart-handler-${products[i].id}`).append(
                                `
                                    <button class="add-item-cart" id="remove-item-${products[i].id}" onclick="removeItemFromCart('${products[i].id}')">
                                        Remove from Cart
                                    </button>
                                `
                            )
                        }
                    }
                }
            }, error: (response) => {
                console.log(response["responseJSON"]["error"]);
            }
        })
    }
}