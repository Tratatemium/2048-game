// #region FUNCTIONS

    const updateGameField = () => {

        for (let i = 0; i < gameArray.length; i++) {
            for (let j = 0; j < gameArray[i].length; j++) {

                const gameElement = document.querySelector(`.element.row-${i}.column-${j}`);
                if (!gameElement) {
                    console.log('⚠️ updateGameField() failed to select game element!')
                } else {
                    gameElement.textContent = gameArray[i][j];
                }
            }
        }
    };

    const onKeyDown = (event) => {

        switch (event.key) {
            case 'ArrowLeft':
                console.log('ArrowLeft')
                for (let i = 0; i < gameArray.length; i++) {
                    let indexMerged;
                    for (let j = 1; j < gameArray[i].length; j++) {                        
                        let jLocal = j;
                        while(gameArray[i][jLocal] !== 0 && gameArray[i][jLocal - 1] === 0) {
                            [gameArray[i][jLocal - 1], gameArray[i][jLocal]] = [gameArray[i][jLocal], gameArray[i][jLocal - 1]];
                            jLocal = jLocal > 1 ? jLocal - 1 : jLocal;
                        }
                        if (gameArray[i][jLocal] !== 0 && jLocal - 1 !== indexMerged && gameArray[i][jLocal] === gameArray[i][jLocal - 1]) {
                            gameArray[i][jLocal - 1] = gameArray[i][jLocal - 1] * 2;
                            gameArray[i][jLocal] = 0;
                            indexMerged = jLocal - 1;
                        }
                    }
                }
                updateGameField()
                break;
            case 'ArrowRight':
                console.log('ArrowRight')
                for (let i = 0; i < gameArray.length; i++) {
                    let indexMerged;
                    for (let j = gameArray[i].length - 2; j >= 0; j--) {
                        let jLocal = j;
                        while(gameArray[i][jLocal] !== 0 && gameArray[i][jLocal + 1] === 0) {
                            [gameArray[i][jLocal + 1], gameArray[i][jLocal]] = [gameArray[i][jLocal], gameArray[i][jLocal + 1]];
                            jLocal = jLocal < gameArray[i].length - 2 ? jLocal + 1 : jLocal;
                        }
                        if (gameArray[i][jLocal] !== 0 && jLocal + 1 !== indexMerged && gameArray[i][jLocal] === gameArray[i][jLocal + 1]) {
                            gameArray[i][jLocal + 1] = gameArray[i][jLocal + 1] * 2;
                            gameArray[i][jLocal] = 0;
                            indexMerged = jLocal + 1;
                        }
                    }
                }
                updateGameField()
                break;
            case 'ArrowUp':
                console.log('ArrowUp')
                for (let j = 0; j < gameArray[0].length; j++) {
                    let indexMerged;
                    for (let i = 1; i < gameArray.length; i++) {
                        let iLocal = i;
                        while(gameArray[iLocal][j] !== 0 && gameArray[iLocal - 1][j] === 0) {
                            [gameArray[iLocal - 1][j], gameArray[iLocal][j]] = [gameArray[iLocal][j], gameArray[iLocal - 1][j]];
                            iLocal = iLocal > 1 ? iLocal - 1 : iLocal;
                        }
                        if (gameArray[iLocal][j] !== 0 && iLocal - 1 !== indexMerged && gameArray[iLocal][j] === gameArray[iLocal - 1][j]) {
                            gameArray[iLocal - 1][j] = gameArray[iLocal - 1][j] * 2;
                            gameArray[iLocal][j] = 0;
                            indexMerged = iLocal - 1;
                        }
                    }
                }
                updateGameField()
                break;
            case 'ArrowDown':
                console.log('ArrowDown')
                for (let j = 0; j < gameArray[0].length; j++) {
                    let indexMerged;
                    for (let i = gameArray.length - 2; i >= 0; i--) {
                        let iLocal = i;
                        while(gameArray[iLocal][j] !== 0 && gameArray[iLocal + 1][j] === 0) {
                            [gameArray[iLocal + 1][j], gameArray[iLocal][j]] = [gameArray[iLocal][j], gameArray[iLocal + 1][j]];
                            iLocal = iLocal < gameArray.length - 2 ? iLocal + 1 : iLocal;
                        }
                        if (gameArray[iLocal][j] !== 0 && iLocal - 1 !== indexMerged && gameArray[iLocal][j] === gameArray[iLocal + 1][j]) {
                            gameArray[iLocal + 1][j] = gameArray[iLocal + 1][j] * 2;
                            gameArray[iLocal][j] = 0;
                            indexMerged = iLocal + 1;
                        }
                    }
                }
                updateGameField()
                break;
            default:
        }



    };

// #endregion FUNCTIONS

// gameArray = [
//     [0, 0, 0, 0],
//     [0, 0, 0, 0], 
//     [0, 0, 0, 0],
//     [0, 0, 0, 0]
// ]

gameArray = [
    [4, 0, 4, 8],
    [0, 2, 0, 8],
    [0, 0, 2, 2],
    [2, 0, 0, 0]
]

updateGameField();

const gameField = document.querySelector('.game-field');
document.addEventListener('keydown', (event) => onKeyDown(event));



