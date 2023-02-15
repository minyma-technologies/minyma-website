$(document).ready(function(){
    $('.hamburger').on('click', (e) => {
        $('.hamburger').toggleClass('is-active')
        $('.nav-item-menu').toggleClass('menu-active')
        $('.nav-list-menu').toggleClass('shown')
    })
})