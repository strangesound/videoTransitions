import { gsap } from "gsap";


const burger = document.querySelector('#burger')

const tl = gsap.timeline()

tl.to(burger, { duration: .1, backgroundColor: '#A1DEF1'},)
tl.to('.menu-link', {
  yPercent:100,
  duration: 0.3,
})
tl.to('.menu-overlay', {
  width: 0
}).progress(1)



gsap.set(".menu-overlay", {opacity:1})
burger.addEventListener('click', () => {
  tl.reversed(!tl.reversed());
})
