let turn = true;// true = x
let btns = document.querySelectorAll('.btn');
let isDarkModeOn = false;
const h1 = document.getElementById('heading');
const screenMode = document.getElementById('screenMode');
const feedback = document.getElementById('feedback');
let computerTurn;

const checkWin = () => {
    let obj = { isWin: false, isTie: false, pos: [] };

    //Possible winning scenarios
    const winningCombinations = [
        //Rows
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        //Columns
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        //Diagonals
        [0, 4, 8],
        [2, 4, 6],
    ];

    //Iterates through winning combinations without using for...of
    for (let i = 0; i < winningCombinations.length; i++) {
        const combination = winningCombinations[i];
        const [a, b, c] = combination;

        //Checks if the cells in the combination have the same innerHTML and are not empty
        if (
            btns[a].innerHTML === btns[b].innerHTML &&
            btns[b].innerHTML === btns[c].innerHTML &&
            btns[a].innerHTML !== ''
        ) {
            obj = { isWin: true, isTie: false, pos: combination };
            break; //Stops checking once a winning combination is found
        }
    }
    const emptyCells = Array.from(btns).filter(btn => btn.innerHTML === '');
    //If there are no more empty cells, it's a tie
    if (emptyCells.length === 0) {
        obj.isTie = true;
    }
    return obj;
}

//Function to make a strategic move for the computer
const computerMove = () => {
    //Gets an array of empty cells by converting the iterable object to an array
    const emptyCells = Array.from(btns).filter(btn => btn.innerHTML === '');

    //Checks if the computer can win on the next move

    for (let i = 0; i < emptyCells.length; i++) {
        const cell = emptyCells[i];
        cell.innerHTML = 'O';
        let obj = checkWin();

        if (obj.isWin) {
            cell.innerHTML = 'O';
            //turn = !turn;
            return;
        }
        cell.innerHTML = ''; //Resets the cell for the next iteration
    }

    //Checks if the player is about to win and blocks that move
    for (let i = 0; i < emptyCells.length; i++) {
        const cell = emptyCells[i];
        cell.innerHTML = 'X';
        let obj = checkWin();

        if (obj.isWin) {
            cell.innerHTML = 'O';
            //turn = !turn;
            return;
        }
        cell.innerHTML = ''; //Resets the cell for the next iteration
    }
    //If no winning or blocking move, make a random move
    //Chooses a random empty cell
    const randomIndex = Math.floor(Math.random() * emptyCells.length);
    const randomCell = emptyCells[randomIndex];

    //Makes the move
    if (randomCell) {
        randomCell.innerHTML = 'O';
        turn = !turn;
    }
}

const reset = () => {
    feedback.innerHTML = '';//Clears the feedback
    turn = !turn;//Toggles the turn so that the last winner start the games

    btns.forEach(btn => {
        btn.innerHTML = '';//Clears the board 
        btn.style.color = '';//Resets buttons style
        btn.addEventListener('click', onTurn);
    })
}

const onTurn = (event) => {
    const currentTarget = event.currentTarget;//current btn (td)
    if (currentTarget.innerHTML !== '') {
        return;
    }

    //Updates the board for the user's move    
    currentTarget.innerHTML = 'X';

    //Toggles the turn
    turn = !turn;

    //Checks for a win or tie after the user's move
    let obj = checkWin();
    //In case of a win
    if (obj.isWin) {
        //Paints the winning sequence
        btns[obj.pos[0]].style.color = 'red';
        btns[obj.pos[1]].style.color = 'red';
        btns[obj.pos[2]].style.color = 'red';
        //Indicates the user that he won the game
        feedback.innerHTML = 'You win!';
        clearTimeout(computerTurn);

        btns.forEach(btn => {
            btn.removeEventListener('click', onTurn);//Prevents the user from adding elements to the board
            btn.addEventListener('mousedown', () => btn.style.backgroundColor = 'white');
        });
        //In case of a tie
    } else if (obj.isTie) {
        feedback.innerHTML = 'It\'s a draw!';
        btns.forEach(btn => btn.removeEventListener('click', onTurn));//Removes event listeners
    } else {
        computerTurn = setTimeout(() => {
            computerMove();
            obj = checkWin();//Checks for a win or tie after the computer's move
            if (obj.isWin) {
                //Paints the winning sequence
                btns[obj.pos[0]].style.color = 'red';
                btns[obj.pos[1]].style.color = 'red';
                btns[obj.pos[2]].style.color = 'red';
                //Indicates the user that he won the game
                feedback.innerHTML = 'You lose... try again!';

                btns.forEach(btn => {
                    btn.removeEventListener('click', onTurn);//Prevents the user from adding elements to the board
                    btn.addEventListener('mousedown', () => btn.style.backgroundColor = 'white');
                });
            } else if (obj.isTie) {
                feedback.innerHTML = 'It\'s a draw!';
                btns.forEach(btn => btn.removeEventListener('click', onTurn));//Removes event listeners
            }
        }, 500);
    }
}

//Adds to each btn (td tag) a click event
btns.forEach(btn => btn.addEventListener('click', onTurn));

const changeBgColor = () => {
    const body = document.querySelector('body');

    //Removes existing event listeners
    screenMode.removeEventListener('mouseover', changeToWhiteHover);
    screenMode.removeEventListener('mouseout', changeToBlackHover);
    screenMode.removeEventListener('mouseover', changeToWhiteBg);
    screenMode.removeEventListener('mouseout', changeBackToGoldBg);
    screenMode.addEventListener('touchstart', changeToWhiteBg);
    screenMode.addEventListener('touchend', changeBackToGoldBg);

    if (!isDarkModeOn) {
        body.style.backgroundColor = '#202124';
        screenMode.style.backgroundColor = 'lightgoldenrodyellow';
        screenMode.innerHTML = 'Light Mode 🌞';
        screenMode.style.color = '#202124';
        h1.style.color = 'white';
        feedback.style.color = 'white';
        if (window.innerWidth >= 1200) {
            screenMode.addEventListener('mouseover', changeToWhiteBg);
            screenMode.addEventListener('mouseout', changeBackToGoldBg);
        } else {
            screenMode.addEventListener('touchstart', changeToYellowBg);
            screenMode.addEventListener('touchend', changeBackToLightYellowBg);
        }
    } else {
        body.style.backgroundColor = 'lightgoldenrodyellow';
        screenMode.style.backgroundColor = '#202124';
        screenMode.innerHTML = 'Dark Mode 🌛';
        screenMode.style.color = 'white';
        screenMode.addEventListener('mouseover', changeToWhiteHover);
        screenMode.addEventListener('mouseout', changeToBlackHover);
        h1.style.color = 'black';
        feedback.style.color = 'black';
    }
    isDarkModeOn = !isDarkModeOn;
}

const changeToYellowBg = () => {
    screenMode.style.backgroundColor = '#cfcf8b';
}

const changeBackToLightYellowBg = () => {
    screenMode.style.backgroundColor = 'lightgoldenrodyellow';
}

//Hover affect in dark mode
const changeToWhiteBg = () => {
    screenMode.style.backgroundColor = 'white';
    screenMode.style.color = '#202124';
}
//Out of hover
const changeBackToGoldBg = () => {
    screenMode.style.backgroundColor = 'gold';
    screenMode.style.color = '#202124';
}

//Hover effect in light mode
const changeToWhiteHover = () => {
    screenMode.style.backgroundColor = 'white';
    screenMode.style.color = '#202124';
}

//Out of hover
const changeToBlackHover = () => {
    screenMode.style.backgroundColor = '#202124';
    screenMode.style.color = 'white';
}