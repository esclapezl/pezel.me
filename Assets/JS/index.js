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


animateIntroTexte();

