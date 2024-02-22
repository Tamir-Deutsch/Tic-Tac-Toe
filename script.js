let turn = true;// true = x
let btns = document.querySelectorAll('.btn');
let isDarkModeOn = false;
const h1 = document.getElementById('heading');
const screenMode = document.getElementById('screenMode');
const feedback = document.getElementById('feedback');
let computerTurn;

//Function to make a random move for the computer
const computerMove = () => {
    //Gets an array of empty cells
    const emptyCells = Array.from(btns).filter(btn => btn.innerHTML === '');

    //Chooses a random empty cell
    const randomIndex = Math.floor(Math.random() * emptyCells.length);
    const randomCell = emptyCells[randomIndex];

    //Makes the move
    if (randomCell) {
        randomCell.innerHTML = 'O';
        turn = !turn;
    }
};

const checkWin = () => {
    let obj = { win: false, isTie: false, pos: [] };

    //The first 3 conditions check whether the user won by a left to right 
    //or right to left sequence
    if (btns[0].innerHTML === btns[1].innerHTML && btns[1].innerHTML === btns[2].innerHTML
        && btns[2].innerHTML !== '') {
        obj = { win: true, isTie: false, pos: [0, 1, 2] };
    }
    else if (btns[3].innerHTML === btns[4].innerHTML && btns[4].innerHTML === btns[5].innerHTML
        && btns[5].innerHTML !== '') {
        obj = { win: true, isTie: false, pos: [3, 4, 5] };
    } else if (btns[6].innerHTML === btns[7].innerHTML && btns[7].innerHTML === btns[8].innerHTML
        && btns[8].innerHTML !== '') {
        obj = { win: true, isTie: false, pos: [6, 7, 8] };

        //These 3 conditions check whether the user won by a top-down
        //or a buttom-up sequence
    } else if (btns[0].innerHTML === btns[3].innerHTML && btns[3].innerHTML === btns[6].innerHTML
        && btns[6].innerHTML !== '') {
        obj = { win: true, isTie: false, pos: [0, 3, 6] };
    } else if (btns[1].innerHTML === btns[4].innerHTML && btns[4].innerHTML === btns[7].innerHTML
        && btns[7].innerHTML !== '') {
        obj = { win: true, isTie: false, pos: [1, 4, 7] };
    } else if (btns[2].innerHTML === btns[5].innerHTML && btns[5].innerHTML === btns[8].innerHTML
        && btns[8].innerHTML !== '') {
        obj = { win: true, isTie: false, pos: [2, 5, 8] };

        //These 3 conditions check whether the user won by a diagonal sequence
    } else if (btns[0].innerHTML === btns[4].innerHTML && btns[4].innerHTML === btns[8].innerHTML
        && btns[8].innerHTML !== '') {
        obj = { win: true, isTie: false, pos: [0, 4, 8] };
    } else if (btns[2].innerHTML === btns[4].innerHTML && btns[4].innerHTML === btns[6].innerHTML
        && btns[6].innerHTML !== '') {
        obj = { win: true, isTie: false, pos: [2, 4, 6] };
    }

    const emptyCells = Array.from(btns).filter(btn => btn.innerHTML === '');
    // If there are no more empty cells, it's a tie
    if (emptyCells.length === 0) {
        obj.isTie = true;
    }

    return obj;
}

const reset = () => {
    feedback.innerHTML = '';//Clears the feedback
    turn = !turn;//Toggles the turn so that the last winner start the games

    btns.forEach(btn => {
        btn.innerHTML = '';//Clears the board 
        btn.style.color = '';//Resets buttons style
    })
    btns.forEach(btn => btn.addEventListener('click', onTurn));
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
    if (obj.win) {
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
            if (obj.win) {
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

    // Removes existing event listeners
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