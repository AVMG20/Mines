import {Fragment} from "react";

import Board from "./Board/Board";
import Settings from "./Settings/Settings";
import styles from './App.module.css';
import Logs from "./Logs/Logs";

function App() {
    return (
        <Fragment>
            <section className={styles.game}>
                <Settings/>
                <Board/>
                <Logs/>
            </section>
            <footer className={styles.footer}>
                <p>&copy; 2022 TechnoVision</p>
            </footer>
        </Fragment>
    );
}

export default App;
