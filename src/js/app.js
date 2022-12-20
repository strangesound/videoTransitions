import { Curtains, Plane } from "curtainsjs";
import fragment from "../shaders_circle/fragment.glsl";
import vertex from "../shaders_circle/vertex.glsl";
import { gsap } from "gsap";
import { Observer } from "gsap/Observer";

gsap.registerPlugin(Observer);


let activeTexture = 0;
let currentTexture = 0;
let transitionTimer = 0;
let timer = 0;
let isRunning = 0;
let head = document.querySelector('.frame__title') 
console.log(head);
// Calculate screen size
const appHeight = () => {
  const doc = document.documentElement
  doc.style.setProperty('--app-height', `${window.innerHeight}px`)
 }
 window.addEventListener('resize', appHeight)
 appHeight()


window.addEventListener("load", () => {
  // set up our WebGL context and append the canvas to our wrapper
  const curtains = new Curtains({
    container: "canvas",
    alpha: true,
    pixelRatio: Math.min(1.5, window.devicePixelRatio), // limit pixel ratio for performance
  });

  // get our plane element
  const planeElements = [...document.getElementsByClassName("plane")];
  const navElements = [...document.getElementsByClassName("js-nav")];
  const duration = planeElements[0].getAttribute("data-duration") || 2;
  // set our initial parameters (basic uniforms)
  const params = {
    vertexShaderID: "vert",
    fragmentShaderID: "frag",
    uniforms: {
      transitionTimer: {
        name: "uTransitionTimer",
        type: "1f",
        value: 0,
      },
      fadeIn: {
        name: "uFadeIn",
        type: "1f",
        value: 0,
      },
      timer: {
        name: "uTimer",
        type: "1f",
        value: 0,
      },
      to: {
        name: "uTo",
        type: "1f",
        value: 0,
      },
      from: {
        name: "uFrom",
        type: "1f",
        value: 0,
      },
    },
  };

  const multiTexturesPlane = new Plane(curtains, planeElements[0], params);

  // set up our basic methods
  multiTexturesPlane
    .onReady(() => {
      // display the button

      document.body.classList.add("curtains-ready");
      let length = multiTexturesPlane.videos.length;

      // planeElements[0].addEventListener("click", () => {
      //   gsap.to(multiTexturesPlane.uniforms.transitionTimer, {
      //     duration: duration,
      //     value: currentTexture + 1,
      //     easing: 'power2.in',
      //     onStart: () => {
      //       multiTexturesPlane.videos[(currentTexture + 1) % length].play();
      //       currentTexture = currentTexture + 1;
      //     },
      //     onComplete: () => {
      //       multiTexturesPlane.videos[
      //         (currentTexture + length - 1) % length
      //       ].pause();
      //       multiTexturesPlane.videos[
      //         (currentTexture + length + 1) % length
      //       ].pause();
      //     },
      //   });
      // });

      navElements.forEach(nav => {
        nav.addEventListener('click', (event) => {
          let to = event.target.getAttribute('data-nav');
          if (isRunning || to == currentTexture) return;
          var elems = document.querySelectorAll(".frame__switch-item");
          [].forEach.call(elems, function (el) {
            el.classList.remove("frame__switch-item--current");
          });
          event.target.classList.add('frame__switch-item--current')
          isRunning = true

          multiTexturesPlane.uniforms.to.value = to;
          let fake = { progress: 0 }
          gsap.to(fake, {
            duration: duration,
            progress: 1,
            ease: 'power2.in',
            onStart: () => {
              multiTexturesPlane.videos[to].play();
              currentTexture = to;
            },
            onUpdate: () => {
              if (fake.progress === 1) {
                multiTexturesPlane.uniforms.from.value = to;
              }
              multiTexturesPlane.uniforms.transitionTimer.value = fake.progress
            },
            onComplete: () => {
              multiTexturesPlane.uniforms.from.value = to;
              multiTexturesPlane.videos[
                (currentTexture + length - 1) % length
              ].pause();
              multiTexturesPlane.videos[
                (currentTexture + length + 1) % length
              ].pause();
              isRunning = false;
            },
          });

        })
      })


      Observer.create({
        type: "touch,pointer",
        wheelSpeed: -1,
        onRight: () => changeTex(-1),
        onLeft: () => changeTex(+1),
        tolerance: 50,
        preventDefault: true
      });

      Observer.create({
        type: "wheel",
        wheelSpeed: -1,
        onDown: () => changeTex(-1),
        onUp: () => changeTex(+1),
        tolerance: 10,
        preventDefault: true
      });


      function changeTex(number) {
        
        isRunning = true
        let to = (currentTexture + number) % 3
        if (to === -1){
          to = 2
        }
        console.log('myto', to, number);
        multiTexturesPlane.uniforms.to.value = to;
        let fake = { progress: 0 }
        gsap.to(fake, {
          duration: duration,
          progress: 1,
          ease: 'power2.in',
          onStart: () => {
            multiTexturesPlane.videos[to].play();
            currentTexture = to;
          },
          onUpdate: () => {
            if (fake.progress === 1) {
              multiTexturesPlane.uniforms.from.value = to;
            }
            multiTexturesPlane.uniforms.transitionTimer.value = fake.progress
          },
          onComplete: () => {
            multiTexturesPlane.uniforms.from.value = to;
            multiTexturesPlane.videos[
              (currentTexture + length - 1) % length
            ].pause();
            multiTexturesPlane.videos[
              (currentTexture + length + 1) % length
            ].pause();
            isRunning = false;
          },
        }
        
        
        );
        
        changeHeader(to)

      }

      function changeHeader(num) {
        console.log('change header', num);
        if (num === 0){
          head.innerHTML = 'Intelligent content management_'
        }
        else if (num === 1){
          head.innerHTML = 'SEAMLESS COLUMN SYSTEM_'
        }
        else if (num === 2){
          head.innerHTML = 'LIGHT RIBBON SYSTEM_'
        }
        
      }


      // click to play the videos
      document.getElementById("intro").addEventListener(
        "click",
        () => {
          // fade out animation
          gsap.to('#intro', { duration: 0.1, autoAlpha: 0. })
          document.body.classList.add("video-started");

          gsap.to(multiTexturesPlane.uniforms.fadeIn, {
            duration: 1,
            value: 1
          })

          // play all videos to force uploading the first frame of each texture
          multiTexturesPlane.playVideos();

          // wait a tick and pause the rest of videos (the ones that are hidden)
          curtains.nextRender(() => {
            multiTexturesPlane.videos[1].pause();
            multiTexturesPlane.videos[2].pause();
          });
        },
        false
      );
    })
    .onRender(() => {
      timer += 0.001;
      multiTexturesPlane.uniforms.timer.value = timer;
    });
});
