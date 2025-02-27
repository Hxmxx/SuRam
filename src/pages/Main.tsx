import { useState, useEffect } from "react";
import styled, { ThemeProvider, createGlobalStyle } from "styled-components";
import GNB from "../components/GNB.tsx";
import { mathProblems } from "../data/mathProblems.ts";  // 문제 데이터 임포트
// import ThemeButton from "../components/ThemeButton.tsx";

const lightTheme = {
    bgColor: "#f8f9fa",
    textColor: "#212529",
    buttonBg: "#007bff",
    buttonText: "#fff",
    inputBg: "#fff",
    inputBorder: "#ced4da",
};

const darkTheme = {
    bgColor: "#212529",
    textColor: "#f8f9fa",
    buttonBg: "#6c757d",
    buttonText: "#fff",
    inputBg: "#343a40",
    inputBorder: "#495057",
};

const GlobalStyle = createGlobalStyle`
    body {
        background-color: ${(props) => props.theme.bgColor};
        color: ${(props) => props.theme.textColor};
        transition: all 0.3s ease-in-out;
        font-family: Arial, sans-serif;
    }
`;

const Container = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100vh;
    text-align: center;
    position: relative;
`;

const Title = styled.h3`
    font-size: 1.5rem;
    margin-bottom: 20px;
`;

const TimeDisplay = styled.h2`
    font-size: 2.5rem;
    margin: 20px 0;
`;

const InputContainer = styled.div`
    display: flex;
    gap: 15px;
    align-items: center;
    justify-content: center;
    margin: 15px 0;
`;

const Input = styled.input`
    width: 55px;
    padding: 6px;
    font-size: 1rem;
    background-color: ${(props) => props.theme.inputBg};
    border: 1px solid ${(props) => props.theme.inputBorder};
    color: ${(props) => props.theme.textColor};
    text-align: center;
    border-radius: 5px;
    outline: none;
`;

const Select = styled.select`
    padding: 6px;
    font-size: 1rem;
    background-color: ${(props) => props.theme.inputBg};
    border: 1px solid ${(props) => props.theme.inputBorder};
    color: ${(props) => props.theme.textColor};
    text-align: center;
    border-radius: 5px;
`;

const Button = styled.button`
    padding: 12px 18px;
    font-size: 1rem;
    border: none;
    border-radius: 5px;
    background-color: ${(props) => props.theme.buttonBg};
    color: ${(props) => props.theme.buttonText};
    cursor: pointer;
    transition: all 0.3s ease-in-out;
    margin-top: 20px;

    &:hover {
        opacity: 0.8;
    }
`;

const MathProblemContainer = styled.div`
    margin-top: 20px;
    display: flex;
    flex-direction: column;
    align-items: center;
`;

const Main = () => {
    const [time, setTime] = useState(0);
    const [inputHour, setInputHour] = useState(''); // 초기값을 빈 문자열로 설정
    const [inputMinute, setInputMinute] = useState(''); // 초기값을 빈 문자열로 설정
    const [inputSecond, setInputSecond] = useState(''); // 초기값을 빈 문자열로 설정
    const [amPm, setAmPm] = useState("AM");
    const [isRunning, setIsRunning] = useState(false);
    const [darkMode] = useState(() =>
        window.matchMedia("(prefers-color-scheme: dark)").matches
    );
    const [mathProblem, setMathProblem] = useState({
        question: "",
        choices: [],
        correctAnswer: -1,
    });
    const [alarmAudio] = useState(new Audio("/alarm.mp3"));

    useEffect(() => {
        if (isRunning && time > 0) {
            const timer = setInterval(() => {
                setTime((prevTime) => prevTime - 1);
            }, 1000);

            return () => clearInterval(timer);
        }

        if (time === 0 && isRunning) {
            generateMathProblem(); // 타이머 종료 시 수학 문제 생성
            playAlarmLoop(); // 알람 울리기
        }
    }, [time, isRunning]);

    const playAlarmLoop = () => {
        alarmAudio.loop = true;
        alarmAudio.play();
    };

    const stopAlarm = () => {
        setIsRunning(false);
        setTime(0);
        alarmAudio.pause();
        alarmAudio.currentTime = 0;
    };

    const startTimer = () => {
        const hour = inputHour === '' ? 0 : Number(inputHour); // 빈 문자열이면 0으로 처리
        const minute = inputMinute === '' ? 0 : Number(inputMinute); // 빈 문자열이면 0으로 처리
        const second = inputSecond === '' ? 0 : Number(inputSecond); // 빈 문자열이면 0으로 처리

        const now = new Date();
        const targetTime = new Date(
            now.getFullYear(),
            now.getMonth(),
            now.getDate(),
            hour,
            minute,
            second
        );

        if (amPm === "PM" && inputHour < 12) {
            targetTime.setHours(targetTime.getHours() + 12); // PM일 경우 12시간 더함
        } else if (amPm === "AM" && inputHour === 12) {
            targetTime.setHours(targetTime.getHours() - 12); // 12AM을 0시로 설정
        }

        if (targetTime <= now) {
            targetTime.setDate(targetTime.getDate() + 1); // 다음 날로 설정
        }

        const totalMilliseconds = targetTime.getTime() - now.getTime();

        setTime(Math.floor(totalMilliseconds / 1000)); // 초 단위로 변환
        setIsRunning(true);
    };

    const formatTime = (seconds: number) => {
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        const s = seconds % 60;
        return `${h}:${m < 10 ? "0" : ""}${m}:${s < 10 ? "0" : ""}${s}`;
    };

    const generateMathProblem = () => {
        const problemIndex = Math.floor(Math.random() * mathProblems.length); // 문제 리스트에서 랜덤 선택
        const { question, choices, correctAnswer } = mathProblems[problemIndex];

        setMathProblem({ question, choices, correctAnswer });
    };

    const checkAnswer = (selectedAnswer: number) => {
        if (selectedAnswer === mathProblem.correctAnswer) {
            stopAlarm();
        } else {
            alert("틀렸습니다! 다시 선택하세요.");
        }
    };

    return (
        <ThemeProvider theme={darkMode ? darkTheme : lightTheme}>
            <GlobalStyle />
            <Container>
                <Title>⏰ 알람을 맞춰주세요</Title>
                <InputContainer>
                    <Input
                        type="number"
                        min="0"
                        max="12"
                        value={inputHour === '' ? '' : inputHour}  // 값이 비어있을 때 빈 문자열로 표시
                        onChange={(e) => setInputHour(e.target.value)}
                    />
                    <Input
                        type="number"
                        min="0"
                        max="59"
                        value={inputMinute === '' ? '' : inputMinute}  // 값이 비어있을 때 빈 문자열로 표시
                        onChange={(e) => setInputMinute(e.target.value)}
                    />
                    <Input
                        type="number"
                        min="0"
                        max="59"
                        value={inputSecond === '' ? '' : inputSecond}  // 값이 비어있을 때 빈 문자열로 표시
                        onChange={(e) => setInputSecond(e.target.value)}
                    />
                    <Select
                        value={amPm}
                        onChange={(e) => setAmPm(e.target.value)}
                    >
                        <option value="AM">AM</option>
                        <option value="PM">PM</option>
                    </Select>
                </InputContainer>
                <Button onClick={startTimer}>🔔 알람 시작</Button>
                <TimeDisplay>{formatTime(time)}</TimeDisplay>
                {time === 0 && isRunning && (  // 알람이 울리면 문제 생성
                    <MathProblemContainer>
                        <p>{mathProblem.question}</p>
                        {mathProblem.choices.map((choice, index) => (
                            <Button key={index} onClick={() => checkAnswer(index)}>
                                {choice}
                            </Button>
                        ))}
                    </MathProblemContainer>
                )}

                {/*<GNB />*/}
            </Container>
        </ThemeProvider>
    );
};

export default Main;