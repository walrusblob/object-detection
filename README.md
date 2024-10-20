# object-detection

This is a client-side object detection app that can be deployed as an entirety to a [Walrus blob](https://www.walrus.xyz). All the dependencies are packaged into the project including:

- Bootstrap's minified CSS and JS
- transformers.js
- detr-restnet-50 model weights

n.b. the weights (*.onnx files) are not committed to this repo due to Github's file size limit, but they can be downloaded separately from the [huggingface repo](https://huggingface.co/Xenova/detr-resnet-50/tree/main).

Check out the demo at [https://object-detection.walrus.site](https://object-detection.walrus.site) until the blob runs out of "epochs"