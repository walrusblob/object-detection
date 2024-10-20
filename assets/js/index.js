import { pipeline, env } from './transformers.js';

// load object detection model from the Walrus blob
env.allowLocalModels = true;
env.localModelPath = '/';

// Reference the elements that we will need
const status = document.getElementById('status');
const fileUpload = document.getElementById('file-upload');
const imageContainer = document.getElementById('image-container');
const predictionContainer = document.getElementById('predictions');
const downloadButton = document.getElementById('download-button');
const modelName = 'detr-resnet-50';

// Create a new object detection pipeline
status.className = 'alert alert-primary'
status.textContent = 'Loading ' + modelName + '...';
const detector = await pipeline('object-detection', modelName);
status.className = 'alert alert-success'
status.textContent = 'Model loaded - ready to detect some objects!';

fileUpload.addEventListener('change', function (e) {
    const file = e.target.files[0];
    if (!file) {
        return;
    }

    const reader = new FileReader();

    // Set up a callback when the file is loaded
    reader.onload = function (e2) {
        imageContainer.innerHTML = '';
        const image = document.createElement('img');
        image.src = e2.target.result;
        imageContainer.appendChild(image);
        detect(image);
    };
    reader.readAsDataURL(file);
});


// Detect objects in the image
async function detect(img) {
    disableDownloadButton();
    status.className = 'alert alert-primary'
    status.textContent = 'Detecting objects...';
    predictionContainer.innerHTML = '';
    const output = await detector(img.src, {
        threshold: 0.5,
        percentage: true,
    });
    status.className = 'alert alert-success'
    status.textContent = 'Detected '+ output.length + ' objects with ' + modelName;
    enableDownloadButton(output);

    // sort the output by score
    output.sort((a, b) => b.score - a.score);

    // display the entire output in the predictionContainer
    // create <li></li> elements for each output
    output.forEach((o) => {
      renderBox(o);
      const tr = document.createElement('tr');
      predictionContainer.appendChild(tr);
      const td1 = document.createElement('td');
      td1.textContent = o.label;
      const td2 = document.createElement('td');
      td2.textContent = o.score;
      const td3 = document.createElement('td');
      td3.textContent = '(' + o.box.xmin + ', ' + o.box.ymin + ', ' + o.box.xmax + ', ' + o.box.ymax + ')';
      tr.appendChild(td1);
      tr.appendChild(td2);
      tr.appendChild(td3);
    });
}

function enableDownloadButton(output) {
  var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(output));
  downloadButton.className = 'btn btn-success';
  downloadButton.setAttribute("href", dataStr);
  downloadButton.setAttribute("download", "labels.json");
}

function disableDownloadButton(output) {
  downloadButton.className = 'btn d-none';
  downloadButton.setAttribute('href', '');
  downloadButton.setAttribute('download', '');
}

// Render a bounding box and label on the image
function renderBox({ box, label }) {
    const { xmax, xmin, ymax, ymin } = box;

    // Generate a random color for the box
    const color = '#' + Math.floor(Math.random() * 0xFFFFFF).toString(16).padStart(6, 0);

    // Draw the box
    const boxElement = document.createElement('div');
    boxElement.className = 'bounding-box';
    Object.assign(boxElement.style, {
        borderColor: color,
        left: 100 * xmin + '%',
        top: 100 * ymin + '%',
        width: 100 * (xmax - xmin) + '%',
        height: 100 * (ymax - ymin) + '%',
    })

    // Draw label
    const labelElement = document.createElement('span');
    labelElement.textContent = label;
    labelElement.className = 'bounding-box-label';
    labelElement.style.backgroundColor = color;

    boxElement.appendChild(labelElement);
    imageContainer.appendChild(boxElement);
}