// REACT
import { useEffect, useState, useCallback } from "react";

// Importação de componentes
import StartScreen from "./components/StartScreen";
import Game from "./components/Game";
import GameOver from "./components/GameOver";

// Importação de estilos css
import "./App.css";

// Importação de Dados
import { wordsList } from "./data/words";

// Estágios do jogo
const stages = [
  { id: 1, name: "start" },
  { id: 2, name: "game" },
  { id: 3, name: "end" },
];

const guessesQty = 3

function App() {
  // Função de estágios do jogo, declarando que o estágio inicial é 'start'
  const [gameStage, setGameStage] = useState(stages[0].name);
  const [words] = useState(wordsList);
  // Palavra que será escolhida
  
  const [pickedWord, setPickedWord] = useState("");
  // Categoria que será escolhida
  const [pickedCategory, setPickedCategory] = useState("");
  const [letters, setLetters] = useState([]);

  //Letras adivinhadas
  const [guessedLetters, setGuessedLetters] = useState([])
  //Letras erradas
  const [wrongLetters, setWrongLetters] = useState([])
  //Palpites
  const [guesses, setGuesses] = useState(guessesQty)
  //Pontuação
  const [score, setScore] = useState(50)
  //Exibe é um objeto de palavras que não pode ser exibido no console em formato de texto: console.log(`words: ${words}`)
  console.log(words)

  // Função para escolher a palavra e a categoria
  const pickWordAndCategory = useCallback(() => {
    // A chave de cada um dos arrays do word.js são as nossas categories
    const categories = Object.keys(words);
    // Vai receber uma categoria aleatória
    const category =
      categories[Math.floor(Math.random() * Object.keys(categories).length)];

    // Escolhe uma palavra aleatoriamente
    const word =
      words[category][Math.floor(Math.random() * words[category].length)];

    console.log(`category: ${category}, word: ${word}, tamanho: ${category.length}`);
    return { word, category };

    // ESTUDO PESSOAL
    // ///////////////////////////////////// 
    const palavras = Object.keys(wordsList)
    console.log(`palavras: ${palavras}`)
    // /////////////////////////////////////
    //FIM DO ESTUDO PESSOAL  

  }, [words]);

  // Função que inicia o jogo e altera o estágio para 'game'
  const startGame = useCallback(() => {
    //limpar todas as letras
    clearLetterStates()

    // escolha a palavra e escolha a categoria
    const { category, word } = pickWordAndCategory();

    console.log(`word: ${word}, category: ${category}`);

    // Cria uma lista de letras
    let wordLetters = word.split("");

    wordLetters = wordLetters.map((l) => l.toLowerCase());

    console.log(`wordLetters: ${wordLetters}`);

    // Fill States
    setPickedCategory(category);
    setPickedWord(word);
    setLetters(wordLetters);

    setGameStage(stages[1].name) ;
    }, [pickWordAndCategory]); 

  // Função que altera o estágio do jogo para 'end'
  const verifyLetter = (letter) => {
    const normalizedLetter = letter.toLowerCase()

    //Verifica se a letra já foi utuilizada
    if (
      guessedLetters.includes(normalizedLetter) || 
      wrongLetters.includes(normalizedLetter)
    ) {
      return;
    } 
    
    //SE NÃO EU VOU INCLUIR AS MINHAS LETRAS
    if (letters.includes(normalizedLetter)) {
      setGuessedLetters((actualGuessedLetters) => [
        ...actualGuessedLetters,
        letter
      ])
    } else {
      setWrongLetters((actualWrongLetters) => [
        ...actualWrongLetters,
        normalizedLetter
      ])
      setGuesses((actualGuesses) => actualGuesses - 1)
    }
  };

  
  console.log(`guessedLetters: ${guessedLetters}`)
  console.log(`wrongLetters: ${wrongLetters}`)

  
  // Função que reseta o jogo, ou seja, altera o estágio para 'start'
  const retry = () => {
    setScore(0)
    setGuesses(guessesQty)
    setGameStage(stages[0].name);
  };
  
  //Função limpa as tentativas e as letras
    const clearLetterStates = () => {
      setGuessedLetters([])
      setWrongLetters([])
    }
  
  // Verifica se os acertos acabaram
  useEffect(() => {
    if (guesses <= 0) {
      // Finaliza e reseta todos os estados
      clearLetterStates();

      setGameStage(stages[2].name)
    }
  }, [guesses])

  // check win condition
  useEffect(() => {
    //Cria um array de letras únicas 
    const uniqueLetters = [...new Set(letters)]

    console.log(uniqueLetters)
    console.log(setLetters)

    // win condition
    if (guessedLetters.length === uniqueLetters.length) {
      // add score
      setScore((actualScore) => (actualScore += 100))
    
      //Resetar o jogo com uma palavra nova
      startGame()
    }
  }, [guessedLetters, letters, startGame])


  return (
    <div className="App">
      {gameStage === "start" && <StartScreen startGame={startGame} />}
      {gameStage === "game" && (
        <Game
          verifyLetter={verifyLetter}
          pickedWord={pickedWord}
          pickedCategory={pickedCategory}
          letters={letters}
          guessedLetters={guessedLetters}
          wrongLetters={wrongLetters}
          guesses={guesses}
          score={score}
        />
      )}
      {gameStage === "end" && <GameOver retry={retry} score={score} />}
    </div>
  );
}

export default App;
