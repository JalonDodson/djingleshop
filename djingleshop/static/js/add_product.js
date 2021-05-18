let image = document.getElementById('product-image');

image.onchange = ev => {
    if (image.files) {
        let imgPreview = document.getElementById('image-preview');
        document.getElementById('preview-container').classList.remove('hidden');
        document.getElementById('photo-lbl').classList.add('hidden');

        let reader = new FileReader();
        reader.readAsDataURL(image.files[0]);
        reader.onload = e => imgPreview.src = e.target.result;
    }
}