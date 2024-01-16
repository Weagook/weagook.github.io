let tg = window.Telegram.WebApp;
product_list = []
$(window).on('scroll', handleScroll);
$(document).ready(function() {
    $(".minus").on("click", function() {
        var input = $(this).siblings("input");
        var currentValue = parseInt(input.val(), 10);
        if (currentValue > 1) {
        input.val(currentValue - 1);
        }
    });

    $(".plus").on("click", function() {
        var input = $(this).siblings("input");
        var currentValue = parseInt(input.val(), 10);
        input.val(currentValue + 1);
    });

    $('.categories li').on('click', function() {
        var targetId = $(this).data('target');
        
        $('html, body').animate({
            scrollTop: $('#' + targetId).offset().top - 120
        }, 500);
    });

    $('li button').on('click', function() {
        var listItem = $(this).closest('li');
        
        var productName = listItem.find('p').text();
        var quantity = parseInt(listItem.find('input').val());
        var price = parseFloat(listItem.find('button').text().replace(' тг.', ''));
    
        var total = quantity * price;

        var product = {
            name: productName,
            quantity: quantity,
            total: total
        };
    
        product_list.push(product);
    
        $('.accept_buying').text('Корзина (' + product_list.length + ')')
        checkList()

    });
    $('#overlay').on('click', function() {
        overlay()
    });
});

function overlay() {
    $('#overlay').css('display', 'none');
    $('.product-list').css('display', 'none');
    $('body').removeClass('no-scroll');
    $('.communication').css('display', 'none');
    $('.message-box').css('display', 'none');
}

function checkList() {
    if (product_list.length > 0) {
        $('.accept_buying').css('display', 'block');
        $('.reset_products').css('display', 'block');
    }
    else {
        $('.accept_buying').css('display', 'none');
        $('.reset_products').css('display', 'none');
    }
}

function removeProducts() {
    product_list = []
    checkList()
}

function acceptBuying() {
    purchaseAmount = 0
    $('#overlay').css('display', 'block');
    $('.products').empty();
    for (var i = 0; i < product_list.length; i++) {
        var product = product_list[i];
        var productInfo = product.name + ' - ' + product.quantity + ' шт. - ' + product.total + ' тг.';
        purchaseAmount += product.total
        $('.products').append('<div class="product-item"><span>' + productInfo + '</span>' + '<button class="remove-product" data-index="' + i + '"><svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="#000000"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M6 5H18M9 5V5C10.5769 3.16026 13.4231 3.16026 15 5V5M9 20H15C16.1046 20 17 19.1046 17 18V9C17 8.44772 16.5523 8 16 8H8C7.44772 8 7 8.44772 7 9V18C7 19.1046 7.89543 20 9 20Z" stroke="#ff7070" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> </g></svg></button></div>');
    }
    $('.product-list').append('<p class="totalSum">' + "Сумма заказа: " + purchaseAmount + ' тг.' + '</p>');
    $('.product-list').css('display', 'block');
    $('body').addClass('no-scroll');

    $('.remove-product').on('click', function() {
        var indexToRemove = $(this).data('index');
        removeProduct(indexToRemove);
    });
}

function removeProduct(index) {
    product_list.splice(index, 1);
    checkList();
    acceptBuying();
    $('.accept_buying').text('Корзина (' + product_list.length + ')')
    if (product_list.length === 0) {
        overlay()
    }
}

function handleScroll() {
    var scrollPosition = $(window).scrollTop();
    if (scrollPosition >= $('#folders').offset().top - 200) {
        $('.categories li').removeClass('selected');
        $('#hfolders').addClass('selected');
        
    }
    else if (scrollPosition >= $('#linear').offset().top -200) {
        $('.categories li').removeClass('selected');
        $('#hlinear').addClass('selected');
    }
    else {
        $('.categories li').removeClass('selected');
        $('#hpen').addClass('selected');
    }

}

function sendData() {
    $('.product-list').css('display', 'none');
    $('.communication').css('display', 'flex');
    $('#name').val('Ваше имя');
}

const tg_bot_token = '6303435680:AAG3JpBvqdFp2Walccwv7Gu5_aiQQ1F2TUs'
const tg_chat_id = '-1001993957039'
const api = 'https://api.telegram.org/bot'+tg_bot_token+'/sendMessage'

async function finishOrder(event) {
    event.preventDefault();
    var form = document.querySelector('.communication');

    var name = form.querySelector('#form-name').value;
    var phone = form.querySelector('#form-number').value;
    
    console.log(name);
    console.log(phone);

    let text = "Имя: " + name + ", Телефон: " + phone;
    $('.hpen').html(text)
    let response = await fetch(api, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            chat_id: tg_chat_id,
            text,
        })
    });
    if (response.ok) {
        $('.message-error').text('Успешно')
    }
    else {
        $('.message-error').text('Говно')
    }
}
