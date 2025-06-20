import { useEffect, useRef, useState } from 'react';
import './App.css'
import { Box, Button, Flex, Link, Progress, Text } from '@radix-ui/themes';
import { generateRoundData } from './utils/generateMap';
import ViteLogo from './assets/vite.svg';
import ReactLogo from './assets/react.svg';
import TsLogo from './assets/typescript.png';
import RadixUiLogo from './assets/radixui.png';
import GithubLogo from './assets/github.svg';

const ROUND_TIME = 60.0;

function App() {
    const [gameStarted, setGameStarted] = useState(false);
    const [countdown, setCountdown] = useState(3);
    const [timeLeft, setTimeLeft] = useState(0);
    const [score, setScore] = useState(0);
    const [bestScore, setBestScore] = useState(() => Number(localStorage.getItem('bestScore') || 0));
    const [grid, setGrid] = useState<[string, string][]>([]);
    const [correctIndex, setCorrectIndex] = useState(-1);
    const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
    const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
    const [highlightCorrect, setHighlightCorrect] = useState(false);
    
    useEffect(() => {
        if (score > bestScore) {
            setBestScore(score);
            localStorage.setItem('bestScore', score.toString());
        }
    }, [score]);

    function startGame() {
        if (gameStarted) return;
        setGameStarted(true);
        setCountdown(3);
        setTimeLeft(ROUND_TIME);
        setScore(0);
        setGrid([]);
        setCorrectIndex(-1);
        timerRef.current = setInterval(() => {
            setCountdown(prev => {
                if (prev > 1) {
                    return prev - 1;
                } else {
                    clearInterval(timerRef.current!);
                    startRound();
                    return 0;
                }
            });
        }, 1000);
    }

    function startRound() {
        timerRef.current && clearInterval(timerRef.current);
        timerRef.current = setInterval(() => {
            setTimeLeft(prev => {
                if (prev <= 0) {
                    clearInterval(timerRef.current!);
                    endGame();
                    return 0;
                } else {
                    return prev - 0.1;
                }
            });
        }, 100);
        const { grid, correctIndex } = generateRoundData();
        setGrid(grid);
        setCorrectIndex(correctIndex);
    }

    function endGame() {
        setGameStarted(false);
        timerRef.current && clearInterval(timerRef.current);
    }

    function handleClick(rowIndex: number, index: number) {
        const clickedIndex = rowIndex * 4 + index;
        setSelectedIndex(clickedIndex);

        if (clickedIndex === correctIndex) {
            setHighlightCorrect(true);
            setTimeout(() => {
                setHighlightCorrect(false);
                setSelectedIndex(null);
                setScore(prev => prev + 1);
                startRound();
            }, 1000);
        } else {
            setTimeout(() => {
                setHighlightCorrect(false);
                setSelectedIndex(null);
                startRound();
            }, 1000);
        }
    }

    return (
        <Flex direction="column" align="center" justify="center" width={"100vw"} height="100vh" className="app">
            { !gameStarted ? (
                <Flex direction="column" align="center" justify="center" gapY="9">
                    <Flex direction="column" gapY="7">
                        <Flex direction={"column"}>
                            <Text size="9" weight="bold" className="title">스트루프 게임</Text>
                            <Text size="7" className="subtitle">- 2025 RAON</Text>
                        </Flex>
                        <Flex direction="column">
                            <Text size="6">Score : {score}</Text>
                            <Text size="6">Best Score : {bestScore}</Text>
                        </Flex>
                    </Flex>
                    <Button size="3" onClick={startGame} style={{ cursor: "pointer" }}>게임 시작</Button>
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
                        <Text size="3" className="credits">Made with</Text>
                        <Link href='https://vitejs.dev/' target='_blank'>
                            <img src={ViteLogo} alt="Vite Logo" style={{ width: "24px", height: "24px", verticalAlign: "middle" }} />
                        </Link>
                        <Link href='https://reactjs.org/' target='_blank'>
                            <img src={ReactLogo} alt="React Logo" style={{ width: "24px", height: "24px", verticalAlign: "middle" }} />
                        </Link>
                        <Link href='https://www.typescriptlang.org/' target='_blank'>
                            <img src={TsLogo} alt="Ts Logo" style={{ width: "24px", height: "24px", verticalAlign: "middle" }} />
                        </Link>
                        <Link href='https://radix-ui.com' target='_blank'>
                            <img src={RadixUiLogo} alt="RadixUi Logo" style={{ width: "24px", height: "24px", verticalAlign: "middle" }} />
                        </Link>
                        <Link href='https://github.com/ridanit-ruma/StroopGame' target='_blank'>
                            <img src={GithubLogo} alt="Github Logo" style={{ width: "24px", height: "24px", verticalAlign: "middle" }} />
                        </Link>
                    </Flex>
                </Flex>
            ) : (
                <Box>
                    { countdown > 0 ? (
                        <Flex direction="column" align="center" justify="center" gapY="6">
                            <Text size="9" weight="bold" className="countdown">{countdown}</Text>
                        </Flex>
                    ) : (
                        <Flex direction="column" align="center" justify="center" gapY="9">
                            <Flex direction="column" align="center" justify="center" width="100vw" className="header">
                                <Flex gapX="4" align="center" justify="between" width="384px">
                                    <Box width="70%">
                                        <Progress value={timeLeft / ROUND_TIME * 100} size="3" className="progress" />
                                    </Box>
                                    <Box>
                                        <Text size="7" weight="bold" className="timer" align="right">{timeLeft.toFixed(1)} 초</Text>
                                    </Box>
                                </Flex>
                                <Flex direction="row" align="start" gapX="4" wrap="wrap">
                                    <Text size="6" className="score">Score: {score}</Text>
                                    <Text size="6" className="best-score">Best Score: {bestScore}</Text>
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
                                                        style={{
                                                            color: item[1],
                                                            fontWeight: "bold",
                                                            borderColor: item[1],
                                                            cursor: "pointer",
                                                            backgroundColor:
                                                                rowIndex * 4 + index === selectedIndex
                                                                    ? (rowIndex * 4 + index === correctIndex ? "lightgreen" : "lightgrey")
                                                                    : highlightCorrect && rowIndex * 4 + index === correctIndex
                                                                    ? "green"
                                                                    : "transparent"
                                                        }}
                                                        className="grid-item"
                                                        onClick={() => {
                                                            if (!HighlightCorrect) {
                                                                handleClick(rowIndex, index);
                                                            }
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
                </Box>
            )}
        </Flex>
    )
}

export default App
