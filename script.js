let words = [];
const sources = [
	{ url: "https://raw.githubusercontent.com/Wartets/RandomWord/refs/heads/main/lists/astroaid.txt", name: "Samstroversaire", enabled: false, index: 0 },
	{ url: "https://raw.githubusercontent.com/Wartets/RandomWord/refs/heads/main/lists/wiwiwi.txt", name: "Wiwiwi", enabled: false, index: 1 },
	{ url: "https://raw.githubusercontent.com/gameyoga/open-skribbl-io/refs/heads/master/resources/words/fr", name: "GameYoga (fr)", enabled: true, index: 2 },
	{ url: "https://raw.githubusercontent.com/Taknok/French-Wordlist/refs/heads/master/francais.txt", name: "Taknok", enabled: true, index: 3 },
	{ url: "https://raw.githubusercontent.com/Wartets/RandomWord/refs/heads/main/lists/lol.txt", name: "Ligue of Legends", enabled: false, index: 4 },
	{ url: "https://raw.githubusercontent.com/Wartets/RandomWord/refs/heads/main/lists/forest.txt", name: "Forêt enchantée", enabled: false, index: 5 },
	{ url: "https://raw.githubusercontent.com/Wartets/RandomWord/refs/heads/main/lists/mystic.txt", name: "Mystique & SFi", enabled: false, index: 6 },
	{ url: "https://raw.githubusercontent.com/Wartets/RandomWord/refs/heads/main/lists/darkdarkVOLAIRE.txt", name: "darkdark VOLAIRE", enabled: false, index: 7 },
	{ url: "https://raw.githubusercontent.com/Wartets/RandomWord/refs/heads/main/lists/insultes.txt", name: "Insultes", enabled: false, index: 8 },
	{ url: "https://raw.githubusercontent.com/Wartets/RandomWord/refs/heads/main/lists/nosense.txt", name: "Aucun Sens", enabled: false, index: 9 },
	{ url: "https://raw.githubusercontent.com/kuel27/wordlist/main/wordlist.txt", name: "Kuel27 (en)", enabled: false, index: 10 },
	{ url: "https://raw.githubusercontent.com/Wartets/RandomWord/refs/heads/main/lists/wakfu.txt", name: "Wakfu", enabled: false, index: 11 },
	{ url: "https://raw.githubusercontent.com/Wartets/RandomWord/refs/heads/main/lists/chimie.txt", name: "Chimie", enabled: false, index: 12 },
	{ url: "https://raw.githubusercontent.com/Wartets/RandomWord/refs/heads/main/lists/physique.txt", name: "Physique", enabled: false, index: 13 },
	{ url: "https://raw.githubusercontent.com/Wartets/RandomWord/refs/heads/main/lists/biologie.txt", name: "Biologie", enabled: false, index: 14 },
	{ url: "https://raw.githubusercontent.com/Wartets/RandomWord/refs/heads/main/lists/maths.txt", name: "Mathématiques", enabled: false, index: 15 },
	{ url: "https://raw.githubusercontent.com/Wartets/RandomWord/refs/heads/main/lists/informatique.txt", name: "Informatique", enabled: false, index: 16 },
	{ url: "https://raw.githubusercontent.com/Wartets/RandomWord/refs/heads/main/lists/geo.txt", name: "Géographie", enabled: false, index: 17 },
	{ url: "https://raw.githubusercontent.com/Wartets/RandomWord/refs/heads/main/lists/moyenage.txt", name: "Moyen-Âge", enabled: false, index: 18 },
	{ url: "https://raw.githubusercontent.com/Wartets/RandomWord/refs/heads/main/lists/lovsex.txt", name: "Love & Sex", enabled: false, index: 19 },
	{ url: "https://raw.githubusercontent.com/gameyoga/open-skribbl-io/refs/heads/master/resources/words/en", name: "GameYoga (en)", enabled: false, index: 20 },
	{ url: "https://raw.githubusercontent.com/gameyoga/open-skribbl-io/refs/heads/master/resources/words/de", name: "GameYoga (de)", enabled: false, index: 21 },
	{ url: "https://raw.githubusercontent.com/gameyoga/open-skribbl-io/refs/heads/master/resources/words/it", name: "GameYoga (it)", enabled: false, index: 22 },
	{ url: "https://raw.githubusercontent.com/gameyoga/open-skribbl-io/refs/heads/master/resources/words/nl", name: "GameYoga (nl)", enabled: false, index: 23 },
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
			activeSources.forEach((source, index) => {
				source.words = allWords[index];
			});
			regenerateWords();
			updateTotalTerms();
		})
		.catch(error => console.error('Catch Error', error));
}


function regenerateWords() {
	const minTotalLength = parseInt(document.getElementById('minLength').value, 10)
	localStorage.setItem('minLength', minLength || 1);
	const wordsContainer = document.getElementById('words-container');
	wordsContainer.innerHTML = ``;
	const generatedWords = [];
	
	if (window.regenAudio) {
		window.regenAudio.pause();
		window.regenAudio.currentTime = 0;
	}
	window.regenAudio = new Audio('sound.mp3');
	window.regenAudio.play();

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
	localStorage.setItem('sources', JSON.stringify(sources));
	localStorage.setItem('minLength', minLength || 1);
}

function createSourceTable() {
	const container = document.getElementById('source-container');
	container.innerHTML = '';

	const sortedSources = sources.slice().sort((a, b) => a.name.localeCompare(b.name));

	sortedSources.forEach((source, index) => {
		const card = document.createElement('div');
		card.classList.add('source-card');
		if (!source.enabled) card.classList.add('disabled');

		card.innerHTML = `
			<h3>${source.name}</h3>
			<p id="lines-${index}">Loading...</p>
		`;

		const originalSource = sources.find(s => s.index === source.index);

		card.addEventListener('click', () => {
			toggleSource(originalSource.index);
			card.classList.toggle('disabled', !originalSource.enabled);
		});

		container.appendChild(card);

		fetchWords(source.url).then(words => {
			document.getElementById(`lines-${index}`).textContent = `${words.length} terms`;
		});
	});

	updateTotalTerms();
}

function updateTotalTerms() {
	const totalTerms = sources.filter(source => source.enabled)
							   .reduce((sum, source) => sum + (source.words ? source.words.length : 0), 0);
	
	const totalElement = document.getElementById('total-terms');
	if (!totalElement) {
		const totalContainer = document.createElement('div');
		totalContainer.id = 'total-terms';
		totalContainer.textContent = `Total terms selected: ${totalTerms}`;
		document.body.appendChild(totalContainer);
	} else {
		totalElement.textContent = `Total terms selected: ${totalTerms}`;
	}
}

document.addEventListener("keydown", function(event) {
	if (event.key === " " || event.key === "Enter") {
		event.preventDefault();
		regenerateWords();
	}
});

function exportWords() {
	let wordsList = words.filter(word => word.length <= 32);
	wordsList = wordsList.sort(() => Math.random() - 0.5);
	if (wordsList.length < 10) {
		while (wordsList.length < 10) {
			wordsList.push(...wordsList);
		}
	}
	let wordsStr = wordsList.join(',');
	if (wordsStr.length > 20000) {
		const tooLong = wordsStr.length - 20000;
		let confirmAdjust = confirm(`The list exceeds 20,000 characters by ${tooLong}. Would you like to reduce it?\n(Reducing the list length allows you to use the list with skribbl.io, random words will be removed)`);
		if (confirmAdjust) {
			document.getElementById('overlay').style.display = 'flex';
			setTimeout(() => {
				while (wordsStr.length > 20000) {
					wordsList.splice(Math.floor(Math.random() * wordsList.length), 1);
					wordsStr = wordsList.join(',');
				}
				navigator.clipboard.writeText(wordsStr)
					.then(() => {
						alert('The words have been copied to the clipboard!');
					})
					.catch(err => {
						console.error('Error while copying', err);
					});
				const blob = new Blob([wordsStr], { type: 'text/plain' });
				const link = document.createElement('a');
				link.href = URL.createObjectURL(blob);
				link.download = 'words.txt';
				link.click();
				document.getElementById('overlay').style.display = 'none';
			}, 1000);
		} else {
			navigator.clipboard.writeText(wordsStr)
				.then(() => {
					alert('The words have been copied to the clipboard!');
				})
				.catch(err => {
					console.error('Error while copying', err);
				});
			const blob = new Blob([wordsStr], { type: 'text/plain' });
			const link = document.createElement('a');
			link.href = URL.createObjectURL(blob);
			link.download = 'words.txt';
			link.click();
		}
	} else {
		navigator.clipboard.writeText(wordsStr)
			.then(() => {
				alert('The words have been copied to the clipboard!');
			})
			.catch(err => {
				console.error('Error while copying', err);
			});
		const blob = new Blob([wordsStr], { type: 'text/plain' });
		const link = document.createElement('a');
		link.href = URL.createObjectURL(blob);
		link.download = 'words.txt';
		link.click();
	}
}


document.addEventListener("DOMContentLoaded", function () {
	createSourceTable();

	const savedSources = JSON.parse(localStorage.getItem('sources'));
	if (savedSources) {
		sources.forEach((source, index) => {
			source.enabled = savedSources[index]?.enabled ?? source.enabled;
		});
	}

	const savedMinLength = localStorage.getItem('minLength') || 1;
	if (savedMinLength) {
		document.getElementById('minLength').value = Math.max(savedMinLength, 1);
	}

	updateWords();
	createSourceTable();
});