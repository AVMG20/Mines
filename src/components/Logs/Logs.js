import React, {useContext, useEffect, useState} from 'react';
import GameContext from "../../store/game-context";
import styles from './Logs.module.css';

export default function Logs() {
    const { logs } = useContext(GameContext);
    const [hideLogs, setHideLogs] = useState(true);
    const [records, setRecords] = useState(logs.toReversed().slice(-8));

    useEffect(() => {
        console.log(123)
        setRecords(logs.toReversed().slice(-8));
    }, [logs]);

    return (
        <div className={styles.logsContainer}>

            <button onClick={() => setHideLogs(!hideLogs)} className={styles.toggleLogs}>
                {hideLogs ? 'Show' : 'Hide'} Logs
            </button>

            { hideLogs ? null : (
                <div className={styles.logsList}>
                    {records.map((log) => (
                        <div key={log.id} className={log.win ? styles.winLog : styles.loseLog}>
                            €{log.amount.toFixed(2)} | {`${log.multiplier.toFixed(1)}x`}
                        </div>
                    ))}
                </div>
            )}

        </div>
    );
}
