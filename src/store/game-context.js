import React, {useState} from "react";
import {calcEarnings} from "../util/multiplier";

const GameContext = React.createContext({});

export const GameContextProvider = (props) => {
    const [gems, setGems] = useState(0);
    const [generateBoard, setGenerateBoard] = useState(false);
    const [firstGame, setFirstGame] = useState(true);
    const [isRunning, setRunning] = useState(false);
    const [cashout, setCashout] = useState(false);
    const [money, setMoney] = useState(0);
    const [bonusMoney, setBonusMoney] = useState(10);
    const [gameData, setGameData] = useState({
        bet: 0.5,
        bombs: 3
    });

    /**
     * @type {Array<{id: string, amount: number, win: boolean,  multiplier: number}>}
     */
    const [logs, setLogs] = useState([]);

    /**
     * @param data {bet: number, bombs: number}
     */
    const startGame = (data) => {
        setGems(0);
        setCashout(false);
        setGameData(data);
        setRunning(true);
        if (firstGame) {
            setFirstGame(false);
        }
        setGenerateBoard(true);
    };

    /**
     * @param isCashout {boolean} if win cashOut is true, else null / false
     */
    const endGame = async (isCashout) => {
        setRunning(false);

        // only charge when game ended by a bomb or cashout
        if ( isCashout === false) {
            // means we hit a bomb
            chargeBalance();
            addLog(gameData.bet, false);
        } else if (gems > 0) {
            // we canceled the game
            chargeBalance();
        }

        // if we cashed out
        if (isCashout && gems > 0) {
            setMoney((currentMoney) => currentMoney + calcEarnings(gameData.bet, gems, gameData.bombs));
            setCashout(true);
            addLog(calcEarnings(gameData.bet, gems, gameData.bombs), true);
        }
    };

    /**
     * Deduct money from the player's balance for the bet
     */
    const chargeBalance = () => {
        //deduct as much as possible from the bonus money, the rest from the balance
        if (bonusMoney >= gameData.bet) {
            setBonusMoney(bonusMoney - gameData.bet);
        } else {
            setMoney((currentMoney) => currentMoney - (gameData.bet - bonusMoney));
            setBonusMoney(0);
        }
    }

    /**
     * Add a log entry
     * @param amount {number}
     * @param win {boolean}
     */
    const addLog = (amount, win) => {
        const multiplier = calcEarnings(gameData.bet, gems, gameData.bombs);
        setLogs((prev) => [...prev, {
            id: Date.now(),
            amount,
            win,
            multiplier
        }]);
    }

    const addGem = () => setGems(gems + 1);

    const preventBoardGen = () => setGenerateBoard(false);

    return (
        <GameContext.Provider
            value={{
                generateBoard,
                gems,
                firstGame,
                isRunning,
                cashout,
                money,
                logs,
                bonusMoney,
                gameData,
                startGame,
                endGame,
                addGem,
                preventBoardGen,
            }}
        >
            {props.children}
        </GameContext.Provider>
    );
};

export default GameContext;
