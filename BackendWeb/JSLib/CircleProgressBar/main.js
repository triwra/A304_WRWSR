// Inspired by https://codepen.io/davatron5000/pen/jzMmME

// Get all the Meters
const meters = document.querySelectorAll('.wrwsr-cricle-progressbar svg[data-value] .meter');

meters.forEach((path) => {
    // Get the length of the path
    let length = path.getTotalLength();

    // console.log(length);

    // Just need to set this once manually on the .meter element and then can be commented out
    // path.style.strokeDashoffset = length;
    // path.style.strokeDasharray = length;

    // Get the value of the meter
    let value = parseInt(path.parentNode.getAttribute('data-value'));
    let text = '';
    if (value > 100) { text = '>100'; value = 100; }
    else { text = value; }
    // Calculate the percentage of the total length
    let to = length * ((100 - value) / 100);
    // Trigger Layout in Safari hack https://jakearchibald.com/2013/animated-line-drawing-svg/
    path.getBoundingClientRect();
    // Set the Offset
    path.style.strokeDashoffset = Math.max(0, to);
    path.nextElementSibling.textContent = `${text}%`;
});
