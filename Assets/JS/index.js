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
    textes[0].style.animationDelay = '1s';
    textes[1].style.animationDelay = '1.8s';
    textes[2].style.animationDelay = '2.1s';

    const liens = document.getElementsByClassName('link-wrapper');

    let d = 3;
    for(let l of liens)
    {
        l.style.animationDelay = d+'s';
        d+=0.2;
    }
}

animateIntroTexte();

