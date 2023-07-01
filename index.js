//data part
const menuArray = [
    {
        name: "Pizza",
        ingredients: ["pepperoni", "mushrom", "mozarella"],
        price: 14,
        img: "pizza.png",
        uuid: "af9e7dec-4085-4c8b-9199-a2f0a948656c",
        count: 0
    },
    {
        name: "Hamburger",
        ingredients: ["beef", "cheese", "lettuce"],
        price: 12,
        img: "burger.png",
        uuid: "c55da3b6-e5f3-44be-8b8e-ae44e0bfa262",
        count: 0
    },
    {
        name: "Beer",
        ingredients: ["grain, hops, yeast, water"],
        price: 12,
        img: "beer.png",
        uuid: "cc3992e5-7b9b-429a-aa7e-a5c2d9b33ba4",
        count: 0
    }
]

//to store the ordered items
localStorage.setItem("orderItems", JSON.stringify([]))


//payment details form
const payForm = document.getElementById("payment-form")


//adding items, removing items and exiting dialogue box
document.addEventListener('click', function (e) {
    if (e.target.dataset.add) {
        addItem(e.target.dataset.add)
    }
    else if (e.target.dataset.remove) {
        removeItem(e.target.dataset.remove)
    }
    else if (e.target.className == "backdrop") {
        payPrompt()
    }

})

//processing payment form to get username
payForm.addEventListener('submit', function (e) {
    e.preventDefault()
    payPrompt()//hides the dialogue box
    localStorage.setItem("orderItems", JSON.stringify([]))//empties the ordered items list
    const payFormData = new FormData(payForm)
    const name = payFormData.get('name')
    document.getElementById("success-prompt").classList.toggle('hidden')
    document.getElementById('success-prompt').innerHTML = `Thanks ${name}! Your order is on the way!`

    render()

})

function addItem(itemId) {

    document.getElementById("success-prompt").classList.add('hidden') //to hide the success prompt whenever a new item is added

    const targetItemObj = menuArray.filter(function (item) {
        return item.uuid === itemId
    })[0]

    let orderItems = JSON.parse(localStorage.getItem("orderItems"))

    //checking if the item is already ordered, then increase the count
    if (orderItems.find(item => item.uuid === targetItemObj.uuid)) {
        item_ind = orderItems.findIndex((item => item.uuid == targetItemObj.uuid));
        orderItems[item_ind].count += 1
    }
    else {
        orderItems.push(
            {
                name: targetItemObj.name,
                price: targetItemObj.price,
                count: targetItemObj.count + 1,
                uuid: targetItemObj.uuid
            }
        )
    }
    localStorage.setItem("orderItems", JSON.stringify(orderItems))
    render()
}

function removeItem(itemId) {

    let orderItems = JSON.parse(localStorage.getItem("orderItems"))
    console.log(itemId)

    item_ind = orderItems.findIndex((item => item.uuid == itemId));
    orderItems[item_ind].count -= 1

    //removing the item from the array
    if (orderItems[item_ind].count == 0)
        orderItems.splice(item_ind, 1)

    localStorage.setItem("orderItems", JSON.stringify(orderItems))

    render()
}

function payPrompt() {
    document.getElementById("payment-outer").classList.toggle('hidden')
}

function getMenuHtml() {

    let menuHtml = ''
    menuArray.forEach(function (food) {
        menuHtml += `
        <div class="food">
            <img src="images/${food.img}" alt=${food.name} class="food-img">
            <div class="food-details">
                <p class="food-name">${food.name}</p>
                <p class="food-ing">${food.ingredients}</p>
                <p class="food-price">$${food.price}</p>
            </div>
            <i class="fa-solid fa-circle-plus food-add" data-add=${food.uuid}></i>
        </div>
        `
    })

    return menuHtml
}

function getOrderHtml(orderItems) {

    //to check if the array is not undefined and not empty
    if (Array.isArray(orderItems) && orderItems.length != 0) {

        let orderHtml = '<p class="order-head">Your order</p>'
        let total = 0
        orderItems.forEach(function (item) {

            orderHtml += `
                <div class="order-items ">
                    <p class="order-food">${item.name}</p>
                    <p class="order-remove" data-remove=${item.uuid}>remove</p>
                    <p class="order-price">$${item.count * item.price}</p>
                </div>
            `
            total += item.count * item.price
        })

        orderHtml += `
            <div class="order-total" >
                <p class="order-total-head">Total price</p>
                <p class="order-total-price">$${total}</p>
            </div >
            <div class="button order-complete" onclick="payPrompt()">Complete order</div>
        `
        return orderHtml
    }
    return ''
}


function render() {
    document.getElementById("menu").innerHTML = getMenuHtml()
    document.getElementById("order").innerHTML = getOrderHtml(JSON.parse(localStorage.getItem("orderItems")))

}

render()








