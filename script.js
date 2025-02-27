let words = [];
	const externalSources = [
		// `https://raw.githubusercontent.com/gameyoga/open-skribbl-io/refs/heads/master/resources/words/fr`,
		// `https://raw.githubusercontent.com/Taknok/French-Wordlist/refs/heads/master/francais.txt`,
		// `https://raw.githubusercontent.com/kuel27/wordlist/main/wordlist.txt`
	];

	const customFile = 'custom.txt';
	
	function fetchWords(url) {
		return fetch(url)
			.then(response => response.text())
			.then(text => text.split('\n').map(word => word.trim()))
			.catch(error => console.error('Loading Error', error));
	}

	Promise.all([
		...externalSources.map(fetchWords),
		fetchWords(customFile)
	])
	.then(allWords => {
		words = allWords.flat().concat(customWords);
		regenerateWords();
	})
	.catch(error => console.error('Catch Error', error));


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
					const randomIndex = Math.max(Math.floor(Math.random() * words.length), 1);
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
				lengthInfo.textContent = `lenghts : ${lengths.join(', ')}`;

				wordsContainer.appendChild(wordItem);
				wordsContainer.appendChild(lengthInfo);
			});
		} else {
			wordsContainer.textContent = 'Load Error';
		}
	}

	function getWordLengths(term) {
		const wordsArray = term.split(' ').flatMap(word => word.split('-'));
		return wordsArray.map(word => word.length);
	}

	document.addEventListener("keydown", function(event) {
		if (event.key === " " || event.key === "Enter") {
			event.preventDefault();
			regenerateWords();
		}
	});