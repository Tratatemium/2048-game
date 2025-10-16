// #region FUNCTIONS

    const updateGameField = () => {

        for (let i = 0; i < gameArray.length; i++) {
            for (let j = 0; j < gameArray[i].length; j++) {

                const gameElement = document.querySelector(`.element.row-${i}.column-${j}`);
                if (!gameElement) {
                    console.log('⚠️ updateGameField() failed to select game element!')
                } else {
                    gameElement.textContent = gameArray[i][j] === 0 ? '' : gameArray[i][j];
                }
            }
        }
    };


    const slideAndMerge = (line) => {
        let result = line.filter((element) => element !== 0);

        for (let i = 0; i < result.length - 1; i++) {
            if (result[i] === result[i + 1]) {
                result[i] = result[i] * 2;
                result[i + 1] = 0;
            }
        }

        result = result.filter((element) => element !== 0);

        while (result.length < line.length) {
            result.push(0);
        }

        return result;
    };

    const addNumberAtRundom = () => {
        let emptySpaces = [];

        for (let i = 0; i < gameArray.length; i++) {
            for (let j = 0; j < gameArray.length; j++) {
                if (gameArray[i][j] === 0) emptySpaces.push([i, j]);
            }
        }

        if (emptySpaces.length > 0) {
            const randomSpace = Math.floor(Math.random() * emptySpaces.length);
            const [randomX, randomY] = emptySpaces[randomSpace];

            const newValue = Math.random() > 0.3 ? 2 : 4;
            gameArray[randomX][randomY] = newValue;

            const gameField = document.querySelector('.game-field');
            const newTile = document.createElement('div');
            newTile.textContent = newValue;
            newTile.className = `tile tile-${newValue}`;
            newTile.style.setProperty('--x', randomX);
            newTile.style.setProperty('--y', randomY);
            gameField.appendChild(newTile);
        }
    };


    const onKeyDown = (event) => {

        let somethingMoved = false;

        switch (event.key) {
            case 'ArrowLeft':
                for (let i = 0; i < gameArray.length; i++) {
                    const lineBefore = [...gameArray[i]];
                    gameArray[i] = slideAndMerge(gameArray[i]);
                    if (gameArray[i].some((element, index) => element !== lineBefore[index])) somethingMoved = true;
                }
                break;
            case 'ArrowRight':
                for (let i = 0; i < gameArray.length; i++) {
                    const lineBefore = [...gameArray[i]];
                    gameArray[i] = slideAndMerge(gameArray[i].reverse()).reverse();
                    if (gameArray[i].some((element, index) => element !== lineBefore[index])) somethingMoved = true;
                }
                break;
            case 'ArrowUp':
                for (let j = 0; j < gameArray.length; j++) {
                    let column = gameArray.map((row) => row[j]);
                    const lineBefore = [... column];
                    column = slideAndMerge(column);
                    if (column.some((element, index) => element !== lineBefore[index])) somethingMoved = true;
                    for (let i = 0; i < gameArray.length; i ++) gameArray[i][j] = column[i];
                }
                break;
            case 'ArrowDown':
                for (let j = 0; j < gameArray.length; j++) {
                    let column = gameArray.map((row) => row[j]);
                    const lineBefore = [... column];
                    column = slideAndMerge(column.reverse()).reverse();
                    if (column.some((element, index) => element !== lineBefore[index])) somethingMoved = true;
                    for (let i = 0; i < gameArray.length; i ++) gameArray[i][j] = column[i];
                }
                break;
            default:
        }

        if (somethingMoved) {
            addNumberAtRundom();
        }
    };



// #endregion FUNCTIONS

gameArray = [
    [0, 0, 0, 0],
    [0, 0, 0, 0], 
    [0, 0, 0, 0],
    [0, 0, 0, 0]
]


// gameArray = [
//     [ {id: null, value: 0},  {id: null, value: 0},  {id: null, value: 0},  {id: null, value: 0}],
//     [ {id: null, value: 0},  {id: null, value: 0},  {id: null, value: 0},  {id: null, value: 0}], 
//     [ {id: null, value: 0},  {id: null, value: 0},  {id: null, value: 0},  {id: null, value: 0}],
//     [ {id: null, value: 0},  {id: null, value: 0},  {id: null, value: 0},  {id: null, value: 0}]
// ]


// gameArray = [
//     [4, 0, 4, 8],
//     [0, 2, 0, 8],
//     [0, 2, 2, 2],
//     [2, 0, 0, 0]
// ]

// gameArray = [
//     [2, 4, 8, 16, 32, 64, 128, 256],
//     [0, 2, 4, 8, 16, 32, 64, 128],
//     [2, 0, 2, 0, 2, 0, 2, 0],
//     [4, 4, 8, 8, 16, 16, 32, 32],
//     [0, 0, 0, 0, 0, 0, 0, 0],
//     [2, 2, 4, 4, 8, 8, 16, 16],
//     [0, 4, 0, 8, 0, 16, 0, 32],
//     [256, 128, 64, 32, 16, 8, 4, 2]
// ]

addNumberAtRundom();
addNumberAtRundom();
updateGameField();

const gameField = document.querySelector('.game-field');
document.addEventListener('keydown', (event) => onKeyDown(event));



