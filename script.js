const captureButton = document.getElementById("capture-button");
const message = document.getElementById("message");
const spinner = document.getElementById("spinner");
const video = document.getElementById("video");
const imageGallery = document.getElementById("image-gallery");

let stream;
let videoTrack;

// 📷 Funkcija za zajem slike
async function captureImage() {
    if (!videoTrack) return;
    const imageCapture = new ImageCapture(videoTrack);
    const photoBlob = await imageCapture.takePhoto();

    const img = document.createElement("img");
    img.src = URL.createObjectURL(photoBlob);
    imageGallery.appendChild(img);
}

// 🎬 Samodejni zagon kamere ob odprtju strani
window.addEventListener("load", async () => {
    try {
        stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
        video.srcObject = stream;
        videoTrack = stream.getVideoTracks()[0]; // Shrani video track za kasnejši zajem slik
    } catch (error) {
        alert("Dostop do kamere je potreben za nadaljevanje.");
        return;
    }
});

// 🎬 Zagon prepoznavanja rože
captureButton.addEventListener("click", () => {
    captureButton.style.display = "none"; 
    spinner.classList.remove("hidden");
    message.innerText = "Prepoznavam rožo...";
    
    // ⏳ Po 5 sekundah se prikaže presenečenje
    setTimeout(() => {
        spinner.classList.add("hidden");
        video.classList.add("hidden"); // Skrijemo video
        message.innerText = "🎉 Sej ni važn kira roža je to...Važn je da bosta postala teta in stric Oberžan! 🎉";
        
        // 📸 Takoj začnemo zajemati slike uporabnika
        let count = 0;
        const interval = setInterval(() => {
            if (count < 5) {
                captureImage();
                count++;
            } else {
                clearInterval(interval);
                // 🎬 Ugasnemo kamero po zajemu slik
                stream.getTracks().forEach(track => track.stop());
            }
        }, 1000);
    }, 5000);
});
