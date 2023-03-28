/*
    anime les lettres
*/
function animateLetter(){
    const idLettres= [0, 1, 2, 3, 4];
    const idLettresRandom = idLettres.sort((a, b) => 0.5 - Math.random());
    
    const lettres = document.getElementById('lettres');
    let i = 0;
    for (const n of idLettresRandom) {
        lettres.children[n].style.animationDelay = (i*0.15+0.1)+'s';
        i++;
    }
}

animateLetter();

function animateIntroTexte(){
    const textes = document.getElementsByClassName('txtIntro');
    textes[0].style.animationDelay = '1.2s';
    textes[1].style.animationDelay = '1.4s';
    textes[2].style.animationDelay = '1.6s';

    const liens = document.getElementsByClassName('link-wrapper');

    let d = 1.8;
    for(let l of liens)
    {
        l.style.animationDelay = d+'s';
        d+=0.2;
    }
}


function randomLetterAnim()
{
    let interval = null;
    document.querySelector("b").onmouseover = event => {
        clearInterval(interval);
        let iteration = 0;
       
        const letters = "abcdefghijklmnopqrstuvwxyz"
    interval = setInterval(() => {
        event.target.innerText = event.target.innerText
          .split("")
          .map((letter, index) => {
            if(index < iteration) {
              return event.target.dataset.value[index];
            }
          
            return letters[Math.floor(Math.random() * 26)]
          })
          .join("");
        
        if(iteration >= event.target.dataset.value.length){ 
          clearInterval(interval);
        }
        
        iteration += 1 / 3;
      }, 30);
    };
}



const bottomBars = document.querySelector("#bottom").children
const topBars = document.querySelector("#top").children

for(b of bottomBars)
{
  b.style.animation = "bottomBarAnim 1s backwards "+(Math.random()*0.8)+"s";
}

for(b of topBars)
{
  b.style.animation = "topBarAnim 1s backwards "+(Math.random()*0.8)+"s";
}


//pour enlever les barres en responsive 

// let bodyWidth = document.querySelector("body").offsetWidth;
// setInterval(hideBars,100);

// function hideBars(){
//   let bars = document.getElementById("bg").children
//   bodyWidth = document.querySelector("body").offsetWidth;
//   if(bodyWidth <600)
//   {
//     for(b of bars)
//     {
//       b.classList.add("hidden");
//     }
//   }
//   else
//   {
//     for(b of bars)
//     {
//       b.classList.remove("hidden");
//     }
//   }
  
// }


//detects if mouse is outside of the window
let out = false;
document.addEventListener("mouseleave", function(event){

  if(event.clientY <= 0 || event.clientX <= 0 || (event.clientX >= window.innerWidth || event.clientY >= window.innerHeight))
  {
    out = true;
  }
});

document.addEventListener("mouseenter", function(event){

  if(event.clientY >= 0 || event.clientX >= 0 || (event.clientX >= window.innerWidth || event.clientY >= window.innerHeight))
  {
    out = false;
  }
});

setInterval(()=>{ console.log(out)},5);


animateIntroTexte();

const mousePos = {x:0,y:0};
const circles = document.querySelectorAll(".circle");
const mainCircle = document.getElementById("mainCircle");
let interacting = false;
let cursorSize = 16;
circles.forEach(function (circle){
  circle.x = 0;
  circle.y = 0;
});

window.addEventListener("mousemove", function(e){
  this.document.getElementById("cursor").style.display="inline";
  mousePos.x = e.clientX;
  mousePos.y = e.clientY;

   
  interacting = e.target.closest(".interactible") !== null; 
});

function animateCircles(){
  let x = mousePos.x;
  let y = mousePos.y;

  mainCircle.style.left = (x - cursorSize) + "px";
  mainCircle.style.top = (y - cursorSize) + "px";

  circles.forEach(function (circle, index) {
    circle.style.left = (x - cursorSize/2) + "px";
    circle.style.top = (y - cursorSize/2) + "px";
    
    circle.style.scale = (circles.length - index) / circles.length;
    
    circle.x = x;
    circle.y = y;

    const nextCircle = circles[index + 1] || circles[0];
    x += (nextCircle.x - x)  * 0.1;
    y += (nextCircle.y - y) * 0.1;
  })

  if(out)
  {
    mainCircle.style.opacity = 0;
    mainCircle.style.transform = "scale(100%)";
    mainCircle.style.transition =  "opacity 0.3s ease-in-out,transform 0.3s ease-in-out";
    circles.forEach(function (circle, index) {
      circle.style.transform = "scale(50%)";
      circle.style.transition =  "opacity 0.2s ease-in-out,transform 0.1s ease-in-out";
      circle.style.opacity = "0";
    });
  }
  else
  {
    if(interacting)
    {
      mainCircle.style.transition =  "opacity 0.1s ease-in-out,transform 0.2s ease-in-out";
      mainCircle.style.opacity = 0.4;
      mainCircle.style.transform = "scale(300%)";
      
      
      circles.forEach(function (circle, index) {
        circle.style.transform = "scale(50%)";
        circle.style.transition =  "opacity 0.2s ease-in-out,transform 0.1s ease-in-out";
        circle.style.opacity = "0";
      });
    }
    else
    {
    
      mainCircle.style.opacity = 0;
      mainCircle.style.transform = "scale(100%)";
      mainCircle.style.transition =  "opacity 0.3s ease-in-out,transform 0.3s ease-in-out";
  
      circles.forEach(function (circle, index) {
        circle.style.transform = "scale(100%)";
        circle.style.transition =  "opacity "+(0.3+(index*0.1))+"s ease-in-out,transform 0.1s ease-in-out";
        circle.style.opacity = "1";
        
      });
    }
  }

  

  requestAnimationFrame(animateCircles);
}

animateCircles();



var slides = document.querySelectorAll('.slide');
var btns = document.querySelectorAll('.btn');
let currentSlide = 1;

var manualNav = function(manual){
  slides[manual].classList.add('active');
  btns[manual].classList.add('active');

  for(let j=0;j<slides.length;j++)
  {
    if(j != manual)
    {
      slides[j].classList.remove('active');
      btns[j].classList.remove('active');
    }
  }

}

btns.forEach((btn,i) => {
  btn.addEventListener("click",() => {
    manualNav(i);
    currentSlide = i;
  });
})

// var scrollTop = (window.pageYOffset !== undefined) ? window.pageYOffset : (document.documentElement || document.body.parentNode || document.body).scrollTop;
// setInterval(() => {
//   scrollTop = (window.pageYOffset !== undefined) ? window.pageYOffset : (document.documentElement || document.body.parentNode || document.body).scrollTop;
//   console.log(scrollTop)
// }, 5);

let subhome = document.getElementById("subHome")
let footer = document.getElementById("iconesFooter")
let nav = document.getElementsByClassName("nav");
console.log(subhome)
window.onscroll = function() {

  for(let el of nav)
  {
      if(checkVisible(subhome) && !checkVisible(footer))
      {
          el.style.color = 'white';

      }
      else
      {
          el.style.color = 'var(--violetFoncee)';
      }
  }
  
};

function checkVisible(elm) {
  var rect = elm.getBoundingClientRect();
  var viewHeight = Math.max(document.documentElement.clientHeight, window.innerHeight);
  return !(rect.bottom < 0 || rect.top - viewHeight >= 0);
 
}

