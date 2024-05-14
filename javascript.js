SLICE_DESIRED = 15
NUMBER_OF_SLICES = 30

// target the heading and the button
const heading = document.querySelector('h1');
const spinButton = document.querySelector('button');
// target the SVG and the pin right next to it
const containerSlices = document.querySelector('g#slices');
const pin = document.querySelector('svg#pin');

function drawCircle(numberOfSlices){
  
  // immediately add simple dots around the wheel
  for (let i = 0; i < 48; i += 1) {
    const transform = `rotate(${360 / 48 * i}), translate(0 -49.5), rotate(${-360 / 48 * i})`;
    const dot = `<circle r="0.5" cx="50" cy="50" fill="currentColor" transform="${transform}"/>`;
    containerSlices.innerHTML += dot;
  }
  
  // variable updated for the timeout
  let timeoutID = 0;
  
  // utility functions returning a random integer in a range and a random hex value
  const randomInt = (min = 0, max = 16) => Math.floor(Math.random() * (max - min) + min);
  const randomHex = () => randomInt().toString(16);
  
  // object used throughout the script, describing the colors and 3 particular rotation values
  // the idea is to include the three slices aroud the wheel and have the arrow point always at one of them
  slice_angle = 360 / numberOfSlices
  mid_slice = slice_angle / 2
  // exact_position = ((slice_desired-1) * slice_angle) - mid_slice
  function generateSuspiciousList(n) {
    const slice_angle = 360 / n;
    const mid_slice = slice_angle / 2;
    const suspicious = [];

    for (let i = 1; i <= n; i++) {
        // const exact_position = ((i-1) * slice_angle) - mid_slice;
        const exact_position = (-(i-1) * slice_angle) - mid_slice;
        const color = "000000"; // You may define this function to generate a random color
        suspicious.push({ rotation: exact_position, color: color });
    }

    return suspicious;
  }

  const suspicious = generateSuspiciousList(numberOfSlices);
  
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

    const suspect = suspicious.find(pairing => pairing.index === Math.ceil(i / (360 / numberOfSlices)));
    // debugger
    if (suspect) {
      fill = suspect.color;
    }
  
    // create the path element and append it to the SVG container
    const path = `
      <path d="M 50 50 L 50 3 A 47 47 ${flags} ${xCoor} ${yCoor}" fill=#${fill} />
    `;
    containerSlices.innerHTML += path;
    
    // add text element
    if ((numberOfSlices - i / (360 / numberOfSlices) + 1).toFixed() <= numberOfSlices){
        const text = `
        <text x="${midX}" y="${midY}" fill="white" font-size="3" text-anchor="middle" alignment-baseline="middle">
        ${(numberOfSlices - i / (360 / numberOfSlices) + 1).toFixed()}
        </text>
        `;
        containerSlices.innerHTML += text;
    }
  
  }

  return {
    suspicious:suspicious,
    timeoutID:timeoutID,
  }
}

// Specified 
function spinWheel(circle_constants=circle_constants, slice_desired=0) {
  try {
    // Remove listeners to prevent re-triggering the function
        spinButton.removeEventListener('click', spinWheel);
        pin.removeEventListener('click', spinWheel);
        
        // Start the spin logic
        heading.classList.add('isHidden');
        pin.classList.add('isSpinning');
        spinButton.classList.add('isSpinning');
        
        // Define spin dynamics
        const fixedDuration = 5;  // seconds
        const fixedRotations = 5; // full rotations
        
        // Configure the spin
        debugger
        const targetSlice = circle_constants.suspicious[slice_desired-1];
        const targetRotation = targetSlice.rotation;
        containerSlices.style.transformOrigin = '50%';
        containerSlices.style.transition = `transform ${fixedDuration}s ease-out`;
        containerSlices.style.transform = `rotate(${fixedRotations * 360 - targetRotation + 90}deg)`;

        pin.style.animation = `pinWheel ${fixedDuration / 10}s 10 ease-in-out`;

        // Setup to end the spin
        circle_constants.timeoutID = setTimeout(() => {
          heading.textContent = `#${targetSlice.color}`;
            heading.classList.remove('isHidden');
            pin.style.animation = '';
            document.documentElement.style.setProperty('--color-theme', `#${targetSlice.color}`);
        }, fixedDuration * 1000);
    } catch (error) {
      console.error("An error occurred during spinning: ", error);
    } finally {
        // Ensure this runs after the spin logic or any errors
        clearTimeout(circle_constants.timeoutID);
        pin.classList.remove('isSpinning');
        spinButton.classList.remove('isSpinning');
        spinButton.addEventListener('click', () => {spinWheel(circle_constants, slice_desired=slice_desired)});
        pin.addEventListener('click', () => {spinWheel(circle_constants, slice_desired=slice_desired)});
      }
}


circle_constants = drawCircle(numberOfSlices=NUMBER_OF_SLICES)

// attach a click event listener on the button, at which point call the spinWheel function
spinButton.addEventListener('click', () => {spinWheel(circle_constants, slice_desired=SLICE_DESIRED)});

// call the same function when pressing the pin
pin.addEventListener('click', () => {spinWheel(circle_constants, slice_desired=SLICE_DESIRED)});




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

