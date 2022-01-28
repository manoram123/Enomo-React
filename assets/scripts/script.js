// You could easily add more colors to this array.


var colors = ['#5294ff', '#42ff68', '#e31e3e', '#ff42d6', '#ffc917', '#ff6c17', '#34e8eb', '#afafaf'];
var boxes = document.querySelectorAll(".box");
var button = document.querySelector("button");


for (var i = 0; i < boxes.length; i++) {
    // Pick a random color from the array 'colors'.
    boxes[i].style.backgroundColor = colors[Math.floor(Math.random() * colors.length)]
}

