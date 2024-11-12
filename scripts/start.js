document.addEventListener("DOMContentLoaded", function() {
    document.getElementById('hideButton').addEventListener('click', function() {
        var cloudImage = document.getElementById('cloudImage');
        if (cloudImage) {
            cloudImage.classList.add('hidden');
        } else {
            console.error('cloudImage が見つかりません');
        }
    });
});
