const numberOfSlices = 41; // Change this number to adjust the number of slices



// target the SVG and the pin right next to it
const containerSlices = document.querySelector('g#slices');
const pin = document.querySelector('svg#pin');

// immediately add simple dots around the wheel
for (let i = 0; i < 48; i += 1) {
  const transform = `rotate(${360 / 48 * i}), translate(0 -49.5), rotate(${-360 / 48 * i})`;
  const dot = `<circle r="0.5" cx="50" cy="50" fill="currentColor" transform="${transform}"/>`;
  containerSlices.innerHTML += dot;
}

// target the heading and the button
const heading = document.querySelector('h1');
const spinButton = document.querySelector('button');

// variable updated for the timeout
let timeoutID = 0;

// utility functions returning a random integer in a range and a random hex value
const randomInt = (min = 0, max = 16) => Math.floor(Math.random() * (max - min) + min);
const randomHex = () => randomInt().toString(16);

// object used throughout the script, describing the colors and 3 particular rotation values
// the idea is to include the three slices aroud the wheel and have the arrow point always at one of them
slice_angle = 360/numberOfSlices
const suspicious = [
  {
    rotation: (slice_angle/2),
    color: '3A11CB'
  },
  {
    rotation: (slice_angle*1.5),
    color: '000000'
  }
];

// add a random fill color to the circle behind the slices
let randomFill = '';
for (let i = 0; i < 6; i += 1) {
  randomFill += randomHex();
}
document.querySelector('svg circle#slice').style.fill = randomFill;

for (let i = 360; i > 0; i -= (360 / numberOfSlices)) {
  const angle = i;
  const xCoor = 50 + Math.sin(angle * Math.PI / 180) * 47;
  const yCoor = 50 - Math.cos(angle * Math.PI / 180) * 47;
  const flags = angle > (360 / numberOfSlices) * (numberOfSlices / 2) ? '0 1 1' : '0 0 1';

  // BB
  // midpoint coordinates for placing the number text
  const midAngle = i - (360 / numberOfSlices) / 2;
  const midX = 50 + Math.sin(midAngle * Math.PI / 180) * 30;
  const midY = 50 - Math.cos(midAngle * Math.PI / 180) * 30;
  // BB

  // initialize a variable for the fill color
  let fill = '';
  for (let j = 0; j < 6; j += 1) {
    fill += randomHex();
  }
//   const suspect = suspicious.find(pairing => pairing.rotation === angle);
  const suspect = suspicious.find(pairing => pairing.index === Math.ceil(i / (360 / numberOfSlices)));
  if (suspect) {
    fill = suspect.color;
  }

  // create the path element and append it to the SVG container
  const path = `
    <path d="M 50 50 L 50 3 A 47 47 ${flags} ${xCoor} ${yCoor}" fill=#${fill} />
  `;
  containerSlices.innerHTML += path;
  
  // add text element
//   debugger
  if ((numberOfSlices - i / (360 / numberOfSlices) + 1).toFixed() <= numberOfSlices){
      const text = `
      <text x="${midX}" y="${midY}" fill="white" font-size="3" text-anchor="middle" alignment-baseline="middle">
      ${(numberOfSlices - i / (360 / numberOfSlices) + 1).toFixed()}
      </text>
      `;
      containerSlices.innerHTML += text;
  }

}


// Random
// function spinWheel() {
//   // remove the event listener from the button and the wheel, to avoid running the function twice at the same time
//   spinButton.removeEventListener('click', spinWheel);
//   pin.removeEventListener('click', spinWheel);

//   // immediately hide the heading showing the matching color
//   heading.classList.add('isHidden');
//   // add a class to the pin and the button to show how they should not be clicked
//   pin.classList.add('isSpinning');
//   spinButton.classList.add('isSpinning');

//   // create variables for the duration of the rotation, as whell as the number of rotations achieved by the wheel
//   const randomDuration = randomInt(4, 10);
//   const randomRotate = randomInt(10, 20);
//   // create a variable to pick from one of the objects at random
//   const randomSuspect = randomInt(0, 3);

//   // apply the transition and the transform properties
//   containerSlices.style.transformOrigin = '50%';
//   containerSlices.style.transition = `transform ${randomDuration}s ease-out`;
//   /* for the rotation, beside an arbitrary x360 rotation, remember to
//   - add 90 to match the position of the arrow (to the very right of the wheel)
//   - subtract the rotation of the slices
//   - add up to a slice as to have the arrow point within the slice's boundaries
//   */
//   containerSlices.style.transform = `rotate(${randomRotate * 360 - suspicious[randomSuspect].rotation + 90 + randomInt(0, 360 / 24)}deg)`;

//   pin.style.animation = `pinWheel ${randomDuration / 10}s 10 ease-in-out`;

//   // after the time allocated for the rotation show the heading with the "random" color, update the custom property with its value
//   timeoutID = setTimeout(() => {
//     heading.textContent = `#${suspicious[randomSuspect].color}`;
//     heading.classList.remove('isHidden');
//     pin.style.animation = '';
//     document.documentElement.style.setProperty('--color-theme', `#${suspicious[randomSuspect].color}`);

//     // remove the class on the pin and button showing the forbidden cursor
//     pin.classList.remove('isSpinning');
//     spinButton.classList.remove('isSpinning');

//     // reset the event listener on the button and the pin
//     spinButton.addEventListener('click', spinWheel);
//     pin.addEventListener('click', spinWheel);

//     // clear the interval and set the boolean back to false
//     clearInterval(timeoutID);
//   }, randomDuration * 1000);
// }



// Specified 
function spinWheel() {
    spinButton.removeEventListener('click', spinWheel);
    pin.removeEventListener('click', spinWheel);
  
    heading.classList.add('isHidden');
    pin.classList.add('isSpinning');
    spinButton.classList.add('isSpinning');
  
    // Fixed duration and rotations
    const fixedDuration = 5; // 5 seconds for the spin
    const fixedRotations = 5; // 5 full rotations
  
    // Choosing the specific slice to land on
    const targetSlice = suspicious[1]; // Always land on the second element
    const targetRotation = targetSlice.rotation;
  
    containerSlices.style.transformOrigin = '50%';
    containerSlices.style.transition = `transform ${fixedDuration}s ease-out`;
    containerSlices.style.transform = `rotate(${fixedRotations * 360 - targetRotation + 90}deg)`;
  
    pin.style.animation = `pinWheel ${fixedDuration / 10}s 10 ease-in-out`;
  
    timeoutID = setTimeout(() => {
      heading.textContent = `#${targetSlice.color}`;
      heading.classList.remove('isHidden');
      pin.style.animation = '';
      document.documentElement.style.setProperty('--color-theme', `#${targetSlice.color}`);
  
      pin.classList.remove('isSpinning');
      spinButton.classList.remove('isSpinning');
  
      spinButton.addEventListener('click', spinWheel);
      pin.addEventListener('click', spinWheel);
  
      clearInterval(timeoutID);
    }, fixedDuration * 1000);
  }
  



// attach a click event listener on the button, at which point call the spinWheel function
spinButton.addEventListener('click', spinWheel);

// call the same function when pressing the pin
pin.addEventListener('click', spinWheel);
