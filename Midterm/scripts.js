let currentCategory = '';
let currentGifIndex = 0;

const gifCategories = {
    'cats': ['cat1.gif', 'cat2.gif'],
    'dogs': ['dog1.gif', 'dog2.gif']
};

function loadGifs(category) {
    currentCategory = category;
    currentGifIndex = 0;
    playGif();
}

function playGif() {
    const gifPlayer = document.getElementById('gif-player');

    gifPlayer.src = `/${currentCategory}/${gifCategories[currentCategory][currentGifIndex]}`;

    gifPlayer.onload = function() {
        setTimeout(() => {
            currentGifIndex++;

            if (currentGifIndex >= gifCategories[currentCategory].length) {
                currentGifIndex = 0;
            }

            playGif();
        }, 3000); // Change 3000 to your desired GIF display time in milliseconds
    };
}
