"use client";
const pre = document.querySelector("pre");

document.addEventListener("mousemove", (e) => {
  rotateElement(e, pre);
});

function rotateElement(event, element) {
  // get mouse position
  const x = event.clientX;
  const y = event.clientY;
  // console.log(x, y)

  // find the middle
  const middleX = window.innerWidth / 2;
  const middleY = window.innerHeight / 2;
  // console.log(middleX, middleY)

  // get offset from middle as a percentage
  // and tone it down a little
  const offsetX = ((x - middleX) / middleX) * 45;
  const offsetY = ((y - middleY) / middleY) * 45;
  // console.log(offsetX, offsetY);

  // set rotation
  element.style.setProperty("--rotateX", offsetX + "deg");
  element.style.setProperty("--rotateY", -1 * offsetY + "deg");
}

const css = `
:root {
    --pink: hsl(338, 70%, 55%);
    --teal: hsl(183, 70%, 62%);
    --white: hsl(334, 7%, 95%);
  }
  
  body {
    background: hsl(224, 32%, 12%);
    background-image: conic-gradient(
      from 0deg at 50% 50%,
      blue,
      purple,
      purple,
      blue
    );
    background-blend-mode: multiply;
    min-block-size: 100dvh;
    display: grid;
    place-items: center;
  }
  
  pre {
    --selector: var(--pink);
    --property: var(--teal);
    --punctuation: var(--white);
    --undefined: var(--white);
  
    font-size: 3rem;
    font-weight: bold;
    color: var(--undefined);
    background: hsl(222, 45%, 7%);
    padding: 2rem;
    border-radius: 1rem;
  
    position: relative;
  
    transform-style: preserve-3d;
    transform: perspective(5000px) rotateY(var(--rotateX)) rotateX(var(--rotateY));
  }
  
  pre > * {
    text-shadow: 0 0 0.3em currentColor;
  }
  
  pre::before,
  pre::after {
    content: "";
    position: absolute;
    border-radius: inherit;
  }
  
  /* shadow */
  pre::before {
    inset: 0.75rem;
    border-radius: inherit;
    background: black;
    z-index: -1;
    transform: translateZ(-50px);
    filter: blur(15px);
    opacity: 0.5;
  }
  
  /* gradient thingy */
  pre::after {
    z-index: -2;
    inset: -1rem;
    background: linear-gradient(-45deg, red, blue);
    transform: translateZ(-50px);
  }
  
  .selector {
    color: var(--selector);
  }
  
  .property {
    color: var(--property);
  }
  
  .punctuation {
    color: var(--punctuation);
  }
  
  .property + .punctuation {
    color: var(--property);
  }
  
  .pre-container {
    position: relative;
    display: grid;
    grid-template: repeat(3, 1fr) / repeat(3, 1fr);
  }
  
  /* extras for CSS only */
  
  .css-only pre {
    grid-row: 1 / -1;
    grid-column: 1 / -1;
    transition: transform 200ms ease-in-out;
  }
  
  .pre-container.css-only > div {
    z-index: 10;
    position: absolute;
    outline: 1px solid lime;
  }
  
  .pre-container.css-only > div:nth-child(1) {
    grid-column: 1 / 2;
    grid-row: 1 / 2;
    inset: 0;
  }
  
  .pre-container.css-only > div:nth-child(2) {
    grid-column: 2 / 3;
    grid-row: 1 / 2;
    inset: 0;
  }
  
  .pre-container.css-only > div:nth-child(3) {
    grid-column: 3 / 4;
    grid-row: 1 / 2;
    inset: 0;
  }
  
  .pre-container.css-only > div:nth-child(4) {
    grid-column: 1 / 2;
    grid-row: 2 / 3;
    inset: 0;
  }
  
  .pre-container.css-only > div:nth-child(5) {
    grid-column: 2 / 3;
    grid-row: 2 / 3;
    inset: 0;
  }
  
  .pre-container.css-only > div:nth-child(6) {
    grid-column: 3 / 4;
    grid-row: 2 / 3;
    inset: 0;
  }
  
  .pre-container.css-only > div:nth-child(7) {
    grid-column: 1 / 2;
    grid-row: 3 / 4;
    inset: 0;
  }
  
  .pre-container.css-only > div:nth-child(8) {
    grid-column: 2 / 3;
    grid-row: 3 / 4;
    inset: 0;
  }
  
  .pre-container.css-only > div:nth-child(9) {
    grid-column: 3 / 4;
    grid-row: 3 / 4;
    inset: 0;
  }
  
  .pre-container.css-only > div:nth-child(1):hover ~ pre {
    --rotateX: -25deg;
    --rotateY: 25deg;
  }
  
  .pre-container.css-only > div:nth-child(2):hover ~ pre {
    --rotateX: 0deg;
    --rotateY: 25deg;
  }
  
  .pre-container.css-only > div:nth-child(3):hover ~ pre {
    --rotateX: 25deg;
    --rotateY: 25deg;
  }
  
  .pre-container.css-only > div:nth-child(4):hover ~ pre {
    --rotateX: -25deg;
    --rotateY: 0deg;
  }
  
  .pre-container.css-only > div:nth-child(5):hover ~ pre {
    --rotateX: 0deg;
    --rotateY: 0deg;
  }
  
  .pre-container.css-only > div:nth-child(6):hover ~ pre {
    --rotateX: 25deg;
    --rotateY: 0deg;
  }
  
  .pre-container.css-only > div:nth-child(7):hover ~ pre {
    --rotateX: -25deg;
    --rotateY: -25deg;
  }
  
  .pre-container.css-only > div:nth-child(8):hover ~ pre {
    --rotateX: 0deg;
    --rotateY: -25deg;
  }
  
  .pre-container.css-only > div:nth-child(9):hover ~ pre {
    --rotateX: 25deg;
    --rotateY: -25deg;
  }
  
  .yt {
    position: fixed;
    bottom: 1.5rem;
    color: #bcbcbc;
  }
  `;

export const Card3d = () => {
  return (
    <pre contenteditable className="language-css" tabindex="0">
      <code className="language-css">
        <span className="token selector">.awesome-layouts</span>{" "}
        <span className="token punctuation"></span>
        <span className="token property">display</span>
        <span className="token punctuation">:</span> grid
        <span className="token punctuation">;</span>
        <span className="token punctuation"></span>
      </code>
    </pre>
  );
};
