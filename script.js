const video = document.getElementById("video");
const captureBtn = document.getElementById("capture-btn");
const loading = document.getElementById("loading");
const result = document.getElementById("result");
const reactionImages = document.getElementById("reaction-images");
const imageGallery = document.getElementById("image-gallery");
const downloadBtn = document.getElementById("download-btn");

let stream;
let capturedImages = []; // Shranjevanje slik za ZIP

// Aktivira zadnjo kamero
navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } })
    .then(s => {
        stream = s;
        video.srcObject = stream;
    })
    .catch(err => console.error("Napaka pri dostopu do kamere:", err));

captureBtn.addEventListener("click", () => {
    captureBtn.classList.add("hidden");
    loading.classList.remove("hidden");

    setTimeout(() => {
        loading.classList.add("hidden");
        result.classList.remove("hidden");

        // Preklopi na sprednjo kamero
        switchToFrontCamera();

    }, 5000);
});

function switchToFrontCamera() {
    if (stream) {
        stream.getTracks().forEach(track => track.stop());
    }

    navigator.mediaDevices.getUserMedia({ video: { facingMode: "user" } })
        .then(s => {
            stream = s;
            video.srcObject = stream;
            captureReaction();
        })
        .catch(err => console.error("Napaka pri preklopu na sprednjo kamero:", err));
}

function captureReaction() {
    reactionImages.classList.remove("hidden");

    let count = 0;
    capturedImages = []; // Resetiranje slik pred zajemanjem

    const interval = setInterval(() => {
        if (count >= 5) {
            clearInterval(interval);
            showDownloadButton(); // Ko so vse slike shranjene, prikažemo gumb za prenos
            return;
        }

        const canvas = document.createElement("canvas");
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

        const img = document.createElement("img");
        img.src = canvas.toDataURL("image/png");
        imageGallery.appendChild(img);

        // Shranimo sliko v seznam za ZIP prenos
        capturedImages.push({ name: `reakcija-${count + 1}.png`, data: img.src });

        count++;
    }, 1000);
}

function showDownloadButton() {
    downloadBtn.classList.remove("hidden");
    downloadBtn.addEventListener("click", downloadImages);
}

function downloadImages() {
    let zip = new JSZip();
    let imgFolder = zip.folder("reakcija");

    capturedImages.forEach((image, index) => {
        let imgData = image.data.split(",")[1]; // Odstranimo "data:image/png;base64,"
        imgFolder.file(image.name, imgData, { base64: true });
    });

    zip.generateAsync({ type: "blob" }).then(content => {
        let link = document.createElement("a");
        link.href = URL.createObjectURL(content);
        link.download = "reakcija.zip";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    });
}
