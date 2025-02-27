let words = [];
const sources = [
    { url: "https://raw.githubusercontent.com/Wartets/RandomWord/refs/heads/main/astroaid.txt", name: "AstroAïd", enabled: true },
    { url: "https://raw.githubusercontent.com/Wartets/RandomWord/refs/heads/main/lol.txt", name: "Ligue of Legends", enabled: false },
    { url: "https://raw.githubusercontent.com/gameyoga/open-skribbl-io/refs/heads/master/resources/words/fr", name: "GameYoga", enabled: true },
    { url: "https://raw.githubusercontent.com/Taknok/French-Wordlist/refs/heads/master/francais.txt", name: "Taknok", enabled: false },
    { url: "https://raw.githubusercontent.com/kuel27/wordlist/main/wordlist.txt", name: "Kuel27", enabled: false }
];

function fetchWords(url) {
    return fetch(url)
        .then(response => response.text())
        .then(text => text.split('\n').map(word => word.trim()))
        .catch(error => {
            console.error('Loading Error', error);
            return [];
        });
}

function updateWords() {
    words = [];
    const activeSources = sources.filter(source => source.enabled);
    Promise.all(activeSources.map(source => fetchWords(source.url)))
        .then(allWords => {
            words = allWords.flat();
            regenerateWords();
        })
        .catch(error => console.error('Catch Error', error));
}

function regenerateWords() {
    const minTotalLength = parseInt(document.getElementById('minLength').value, 10) || 1;
    const wordsContainer = document.getElementById('words-container');
    wordsContainer.innerHTML = ``;
    const generatedWords = [];

    if (words.length > 0) {
        while (generatedWords.length < 5) {
            let randomWord = ``;
            let wordLengths = [];

            do {
                const randomIndex = Math.max(Math.floor(Math.random() * words.length), 0);
                randomWord = words[randomIndex].trim();
                wordLengths = getWordLengths(randomWord);
            } while (wordLengths.reduce((a, b) => a + b, 0) < minTotalLength);

            generatedWords.push({ term: randomWord, lengths: wordLengths });
        }

        generatedWords.forEach(({ term, lengths }) => {
            const wordItem = document.createElement("div");
            wordItem.classList.add("word-item");
            wordItem.textContent = term;

            const lengthInfo = document.createElement("div");
            lengthInfo.classList.add("lengths");
            lengthInfo.textContent = `length(s) : ${lengths.join(', ')}`;

            wordsContainer.appendChild(wordItem);
            wordsContainer.appendChild(lengthInfo);
        });
    } else {
        wordsContainer.textContent = 'No words loaded.';
    }
}

function getWordLengths(term) {
    const wordsArray = term.split(' ').flatMap(word => word.split('-'));
    return wordsArray.map(word => word.length);
}

function toggleSource(index) {
    sources[index].enabled = !sources[index].enabled;
    updateWords();
}

function createSourceTable() {
    const container = document.getElementById('source-container');
    container.innerHTML = '';

    sources.forEach((source, index) => {
        const card = document.createElement('div');
        card.classList.add('source-card');
        if (!source.enabled) card.classList.add('disabled');

        card.innerHTML = `
            <h3>${source.name}</h3>
            <p id="lines-${index}">Loading...</p>
        `;

        card.addEventListener('click', () => {
            toggleSource(index);
            card.classList.toggle('disabled', !sources[index].enabled);
        });

        container.appendChild(card);

        fetchWords(source.url).then(words => {
            document.getElementById(`lines-${index}`).textContent = `${words.length} terms`;
        });
    });
}


document.addEventListener("keydown", function(event) {
    if (event.key === " " || event.key === "Enter") {
        event.preventDefault();
        regenerateWords();
    }
});

document.addEventListener("DOMContentLoaded", function () {
    createSourceTable();
    updateWords();
});
