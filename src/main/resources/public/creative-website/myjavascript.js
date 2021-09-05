var firstItem = document.getElementsByClassName("item1");


firstItem[1].style.display = 'none';

var items = document.getElementsByTagName('p');


var container = document.getElementsByClassName("container");




container[0].addEventListener('mouseenter', triggered)


function triggered() {
    console.log("Mouseenter event is triggered")
    container[0].removeEventListener('mouseenter',triggered);
}






