import {useState, useContext, useEffect} from "react";
import useSound from "use-sound";

import GameContext from "../../store/game-context";
import bet from "../../assets/audio/bet.mp3";
import cashout from "../../assets/audio/cashout.wav";
import styles from "./BetForm.module.css";

function BetForm() {
    const ctx = useContext(GameContext);

    const [error, setError] = useState(false);
    const [betAmount, setBetAmount] = useState(0.50);

    useEffect(() => {
        if (betAmount > ctx.money + ctx.bonusMoney) {
            setError(true);
        } else {
            setError(false);
        }
    }, [ctx.bonusMoney, ctx.isRunning, ctx.money]);
    

    const betChangehandler = (event) => {
        const bet = parseFloat(event.target.value);
        setBetAmount(bet);
        if (bet > ctx.money + ctx.bonusMoney) {
            setError(true);
        } else {
            setError(false);
        }
    };

    const adjustBet = (multiplier) => {
        let newBet = betAmount * multiplier;
        if (newBet <= ctx.money + ctx.bonusMoney && newBet <= 10000000) {
            setBetAmount(newBet.toFixed(2));
            setError(false);
        } else {
            setError(true);
        }
    };

    const [playBet] = useSound(bet);
    const [playCashout] = useSound(cashout);

    const submitHandler = (event) => {
        event.preventDefault();
        const data = {
            bet: +event.target.bet.value,
            bombs: +event.target.mines.value,
        };

        if (!ctx.isRunning) {
            // Start Game
            if (error) return;
            playBet();
            ctx.startGame(data);
        } else {
            // Cashout
            playCashout();
            ctx.endGame(true);
        }
    };

    const options = [];
    for (let i = 1; i < 25; i++) {
        options.push(<option key={i} value={i}>
            {i}
        </option>,);
    }

    return (
        <form className={styles.betForm} onSubmit={submitHandler}>
            <div className={styles.input}>
                <label htmlFor="bet">Bet Amount</label>
                <div className={styles.buttonGroup}>
                    <button
                        type="button"
                        className={styles.button}
                        onClick={() => adjustBet(1 / 3)}
                    >
                        -3x
                    </button>
                    <button
                        type="button"
                        className={styles.button}
                        onClick={() => adjustBet(1 / 2)}
                    >
                        -2x
                    </button>
                    <input
                        name="bet"
                        type="number"
                        placeholder="0.00"
                        className={`${styles.inputBox} ${styles.bet} ${error ? styles.error : undefined}`}
                        step="0.01"
                        min="0"
                        max="10000000"
                        value={betAmount}
                        disabled={ctx.isRunning ? "disabled" : undefined}
                        onChange={betChangehandler}
                    />
                    <button
                        type="button"
                        className={styles.button}
                        onClick={() => adjustBet(2)}
                    >
                        +2x
                    </button>
                    <button
                        type="button"
                        className={styles.button}
                        onClick={() => adjustBet(3)}
                    >
                        +3x
                    </button>
                </div>
            </div>
            <div className={styles.input}>
                <label htmlFor="mines">Mines</label>
                <select
                    name="mines"
                    defaultValue="3"
                    className={`${styles.inputBox} ${styles.mines}`}
                    disabled={ctx.isRunning ? "disabled" : undefined}
                >
                    {options}
                </select>
            </div>
            <button type="submit" className={ctx.isRunning ? ctx.gems > 0 ? styles.cashOutButton : styles.cancelButton : styles.betButton}>
                {ctx.isRunning ? ctx.gems > 0 ? "Cash Out" : "Cancel" : "Bet"}
            </button>
        </form>
    );
}

export default BetForm;
