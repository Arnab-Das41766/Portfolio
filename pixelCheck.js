const fs = require('fs');
const { createCanvas, loadImage } = require('canvas');

async function check() {
    const img = await loadImage('src/lanyardphoto.jpg');
    const canvas = createCanvas(img.width, img.height);
    const ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0);
    
    // Check right half
    const halfWidth = Math.floor(img.width / 2);
    const imgData = ctx.getImageData(halfWidth, 0, halfWidth, img.height).data;
    
    let isBlack = true;
    for (let i = 0; i < imgData.length; i += 4) {
        if (imgData[i] > 10 || imgData[i+1] > 10 || imgData[i+2] > 10) {
            isBlack = false;
            break;
        }
    }
    
    console.log(`Right half is mostly black: ${isBlack}`);
    console.log(`Image dimensions: ${img.width}x${img.height}`);
}

check().catch(console.error);
