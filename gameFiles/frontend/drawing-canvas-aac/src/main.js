import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import HelloWorld from './components/HelloWorld.vue';

//creates vue app DO NO TOUCH
createApp(App).mount('#app')

//sets up canvas and details
 const canvas = document.getElementById("canvas")
 canvas.width = window.innerWidth;
 canvas.height = 400;

 //sets up default color, draw state and stroke width
 let context = canvas.getContext("2d");
 let start_background_color = "white";
 context.fillStyle = start_background_color;
 context.fillRect(0, 0, canvas.width, canvas.height);
 let undoHistory = [];
 let draw_color = "black";
 let is_drawing = false;
 let draw_width = 1; 

 //Saves each new stroke
 function saveState() {
    undoHistory.push(context.getImageData(0, 0, canvas.width, canvas.height));
 }

 //changes stroke color
 function change_color(element) {
    draw_color = element.style.background;
 }

 //listens for all button clicks on colors
 document.querySelectorAll(".color-field").forEach(div => {
    div.addEventListener("click", function () {
        change_color(this);
    });
});

//listens for clear button click
document.querySelectorAll(".Cbutton").forEach(div => {
    div.addEventListener("click", function () {
        clear_canvas(this);
    });
});

//listens for undo button click
document.querySelectorAll(".Ubutton").forEach(div => {
    div.addEventListener("click", function () {
        undo_action(this);
    });
});

//listens for stroke width interaction
document.querySelector(".pen-range").addEventListener("input", function() {
    draw_width = this.value; 
});

//listens for any mouse down action and saves each state (eg. drawing)
canvas.addEventListener("mousedown", function(event) {
    saveState();
  });
  
//listens for input from mouse for drawing
 canvas.addEventListener("touchstart", start, false);
 canvas.addEventListener("touchmove", draw, false);
 canvas.addEventListener("mousedown", start, false);
 canvas.addEventListener("mousemove", draw, false);
 canvas.addEventListener("touchend", stop, false);
 canvas.addEventListener("mouseup", stop, false);
 canvas.addEventListener("mouseout", stop, false);


//starts drawing
 function start(event) {
    is_drawing = true;
    context.beginPath();
    context.moveTo(event.clientX - canvas.offsetLeft,
                   event.clientY - canvas.offsetTop);
    event.preventDefault();
 }

 //starts drawing
 function draw(event) {
    if ( is_drawing )  {
        context.lineTo(event.clientX - canvas.offsetLeft,
                       event.clientY - canvas.offsetTop);
        context.strokeStyle = draw_color;
        context.lineWidth = draw_width;
        context.lineCap = "round";
        context.lineJoin = "round";
        context.stroke();
    }
    event.preventDefault();
 }
    
//stops drawing when mouse isnt clicked or outside canvas
 function stop(event) {
    if ( is_drawing ) {
        context.stroke();
        context.closePath();
        is_drawing = false;
    }
    event.preventDefault();
}
 
//clears the whole canvas
 function clear_canvas(event) {
    context.fillStyle = start_background_color;
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.fillRect(0, 0, canvas.width, canvas.height);
 }

//undos the last action 
 function undo_action() {
    if (undoHistory.length > 0) {
      let previousState = undoHistory.pop();
      context.putImageData(previousState, 0, 0);
    } else {
      context.clearRect(0, 0, canvas.width, canvas.height);
    }
  }
