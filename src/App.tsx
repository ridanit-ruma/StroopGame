import { useState } from 'react';
import './App.css'
import { Button, Flex, Link, Text } from '@radix-ui/themes';
import { generateRoundData } from './utils/generateMap';
import RadixUiLogo from './assets/radixui.png';
import GithubLogo from './assets/github.svg';
import changeNum from './utils/numtodt';
import { useRef } from 'react';

export default function App() {
    const [isGameStarted, setIsGameStarted] = useState(false);
    const [bestScore, setBestScore] = useState(() => Number(localStorage.getItem('bestScore') || 0));
    const [countDown, setCountDown] = useState(0);
    const [stopWatch, setStopWatch] = useState(0);
    const [round, setRound] = useState(0);
    const [grid, setGrid] = useState<[string, string][]>([]);
    const [highlightCorrect, setHighlightCorrect] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
    const [correctIndex, setCorrectIndex] = useState(-1);
    const [stopWatchInterval, setStopWatchInterval] = useState<number | null>(null);
    const startTimeRef = useRef<number | null>(null);

    function startGame() {
        setCountDown(3);
        setStopWatch(0);
        setRound(0);
        setIsGameStarted(false);
        countDownStart();
    }

    function startRound(roundUp: boolean) {
        if (roundUp) {
            setRound(prev => prev + 1);
        }
        const { grid, correctIndex } = generateRoundData();
        setGrid(grid);
        setCorrectIndex(correctIndex);
        setSelectedIndex(null);
        setHighlightCorrect(false);
    }

    function stopGame() {
        pauseTimeWatch();
        setIsGameStarted(false);
        if (bestScore === 0) {
            setBestScore(stopWatch);
        } else if (stopWatch < bestScore) {
            setBestScore(stopWatch);
        }
        localStorage.setItem('bestScore', stopWatch.toString());
    }

    function handleCellClick(rowIndex: number, index: number) {
        const clickedIndex = rowIndex * 4 + index;
        if (clickedIndex === correctIndex && round === 5) {
            stopGame();
            return;
        }
        setSelectedIndex(clickedIndex);
        setHighlightCorrect(true);
        let waitingTime = 500;
        if (clickedIndex != correctIndex) {
            waitingTime = 4000;
        }

        setTimeout(() => {
            if (round <= 10) {
                console.log(clickedIndex, correctIndex)
                if (clickedIndex === correctIndex) {
                    startRound(true);
                } else {
                    startRound(false);
                }
            } else {
                stopGame();
            }
        }, waitingTime);
    }

    function startTimeWatch() {
        startTimeRef.current = performance.now();
        const interval = setInterval(() => {
            if (startTimeRef.current !== null) {
                const elapsed = performance.now() - startTimeRef.current;
                setStopWatch(Math.round(elapsed / 10));
            }
        }, 10);
        setStopWatchInterval(interval);
    }

    function pauseTimeWatch() {
        if (stopWatchInterval) {
            clearInterval(stopWatchInterval);
            setStopWatchInterval(null);
        }
    }

    function countDownStart() {
        const interval = setInterval(() => {
            setCountDown(prev => {
                if (prev <= 1) {
                    clearInterval(interval);
                    setIsGameStarted(true);
                    startRound(true);
                    startTimeWatch();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
    }

    return (
        <Flex direction="column" align="center" justify="center" width={"100vw"} height="100vh" className="app">
            {!isGameStarted ? (
                !(countDown > 0) ? (
                    <Flex direction="column" align="center" justify="center" gapY="9">
                        <Flex direction="column" gapY="7">
                            <Flex direction={"column"}>
                                <Text size="9" weight="bold" className="title">스트루프 게임</Text>
                                <Text size="7" className="subtitle">- 2025 RAON</Text>
                            </Flex>
                            <Flex direction="column">
                                <Text size="6">Score : {changeNum(stopWatch)}</Text>
                                <Text size="6">Best Score : {changeNum(bestScore)}</Text>
                            </Flex>
                        </Flex>
                        <Button size="3" onClick={startGame} style={{ cursor: "pointer", fontFamily: "Ownglyph_corncorn-Rg" }}>게임 시작</Button>
                        <Flex gapX="2"
                            style={{
                                position: "absolute",
                                right: 24,
                                bottom: 24,
                                textAlign: "right",
                                opacity: 0.8,
                                fontSize: "1.1rem"
                            }}
                        >
                            <Link href='https://radix-ui.com' target='_blank'>
                                <img src={RadixUiLogo} alt="RadixUi Logo" style={{ width: "24px", height: "24px", verticalAlign: "middle" }} />
                            </Link>
                            <Link href='https://github.com/ridanit-ruma/StroopGame' target='_blank'>
                                <img src={GithubLogo} alt="Github Logo" style={{ width: "24px", height: "24px", verticalAlign: "middle" }} />
                            </Link>
                        </Flex>
                    </Flex>
                ) : (
                    <Text size="8" weight="bold">{countDown}</Text>
                )
            ) : (
                <Flex direction="column" align="center" justify="center" gapY="9">
                    <Flex direction="column" align="center" justify="center" width="100vw" className="header">
                        <Flex direction="column" align="start">
                            <Text size="6" className="score">Round {round}</Text>
                            <Text size="6" className="score">Score: {changeNum(stopWatch)}</Text>
                            <Text size="6" className="best-score">Best Score: {changeNum(bestScore)}</Text>
                        </Flex>
                    </Flex>
                    <Flex direction="column" align="center" justify="center" gapY="4">
                        {
                            Array.from({ length: Math.ceil(grid.length / 4) }, (_, rowIndex) => (
                                <Flex key={rowIndex} direction="row" gapX="4" justify="center">
                                    {
                                        grid.slice(rowIndex * 4, rowIndex * 4 + 4).map((item, index) => (
                                            <Button
                                                key={rowIndex * 4 + index}
                                                size="4"
                                                variant="outline"
                                                disabled={highlightCorrect}
                                                style={{
                                                    color: item[1],
                                                    fontWeight: "bold",
                                                    fontFamily: "Ownglyph_corncorn-Rg",
                                                    borderColor: item[1],
                                                    cursor: "pointer",
                                                    backgroundColor:
                                                        rowIndex * 4 + index === selectedIndex
                                                            ? (rowIndex * 4 + index === correctIndex ? "lightgreen" : "lightgrey")
                                                            : highlightCorrect && rowIndex * 4 + index === correctIndex
                                                            ? "lightgreen"
                                                            : "transparent",
                                                }}
                                                className="grid-item"
                                                onClick={() => {
                                                    handleCellClick(rowIndex, index);
                                                }}
                                            >
                                                {item[0]}
                                            </Button>
                                        ))
                                    }
                                </Flex>
                            ))
                        }
                    </Flex>
                </Flex>
            )}
        </Flex>
    )
}
