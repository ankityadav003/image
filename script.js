function previewImage(input) {
    const file = input.files[0];
    const reader = new FileReader();
    reader.onload = function (e) {
        const imagePreview = document.getElementById('imagePreview');
        imagePreview.src = e.target.result;
        imagePreview.style.display = 'block';
    };
    reader.readAsDataURL(file);
}

//Function to crop image

let img = null;
let canvas = null;
let ctx = null;
let cropping = false;
let startX = 0, startY = 0;
let cropWidth = 0, cropHeight = 0;

const cropCanvas = document.getElementById('cropCanvas');
const croppedImage = document.getElementById('croppedImage');
function previewImage(input) {
    const file = input.files[0];
    const reader = new FileReader();
    reader.onload = function (e) {
        // Get canvas element
        canvas = cropCanvas;
        ctx = canvas.getContext('2d');

        img = new Image();
        img.src = e.target.result;
        img.onload = function() {
            // Set canvas size and draw the image
            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img, 0, 0);

            // Show crop button after image is loaded
            document.getElementById('cropControls').style.display = 'block';

            // Add event listeners for cropping functionality
            canvas.addEventListener('mousedown', startCrop);
            canvas.addEventListener('mousemove', cropArea);
            canvas.addEventListener('mouseup', endCrop);
        };
    };
    reader.readAsDataURL(file);
}

function startCrop(e) {
    cropping = true;
    startX = e.offsetX;
    startY = e.offsetY;
}

function cropArea(e) {
    if (!cropping) return;

    cropWidth = e.offsetX - startX;
    cropHeight = e.offsetY - startY;

    // Clear the canvas and redraw the image
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0);

    // Draw the cropping rectangle
    ctx.beginPath();
    ctx.rect(startX, startY, cropWidth, cropHeight);
    ctx.lineWidth = 2;
    ctx.strokeStyle = 'red';
    ctx.stroke();
}

function endCrop() {
    cropping = false;

    const cropData = ctx.getImageData(startX, startY, cropWidth, cropHeight);

    // Create a new canvas for the cropped image
    const croppedCanvas = document.createElement('canvas');
    const croppedCtx = croppedCanvas.getContext('2d');
    croppedCanvas.width = cropWidth;
    croppedCanvas.height = cropHeight;
    croppedCtx.putImageData(cropData, 0, 0);

    // Show the cropped image preview
    croppedImage.src = croppedCanvas.toDataURL('image/png');
    document.getElementById('croppedPreview').style.display = 'block';

    // Show the download button
    const downloadBtn = document.getElementById('downloadBtn');
    downloadBtn.style.display = 'inline-block';
}

function downloadCroppedImage() {
    const croppedCanvas = document.createElement('canvas');
    const croppedCtx = croppedCanvas.getContext('2d');
    const imageSrc = croppedImage.src;

    croppedCanvas.width = croppedImage.naturalWidth;
    croppedCanvas.height = croppedImage.naturalHeight;
    croppedCtx.drawImage(croppedImage, 0, 0);

    const link = document.createElement('a');
    link.href = croppedCanvas.toDataURL('image/png');
    link.download = 'cropped-image.png';
    link.click();
}
