import { DotLottie } from '@lottiefiles/dotlottie-web';

const dotLottie = new DotLottie({
  canvas: document.querySelector('#canvas'),
  autoplay: true,
  loop: true,
  src: 'https://path-to-your-animation.lottie',
  renderConfig: {
    autoResize: true,
    devicePixelRatio: 1,
  },
  backgroundColor: '#ff0000',
  speed: 1.5,
  segment: [10, 50],
  layout: {
    fit: 'contain',
    align: [0.5, 0.5],
  },
});
export default dotLottie;
