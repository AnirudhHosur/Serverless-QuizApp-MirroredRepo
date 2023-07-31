import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
	setIsQuestionLoading,
	setQuiz,
	updateQuiz,
} from '../../redux/quizSlice';
import { useNavigate } from 'react-router-dom';
import { setScore } from '../../redux/teamScoreSlice';

export const WebSocketContext = React.createContext(null);

export default ({ children }) => {
	let ws = useRef(null);
	const [webSocket, setWebSocket] = useState(null);
	const [message, setMessage] = useState(null);
	const wsApi = 'wss://rireb5nnb2.execute-api.us-east-1.amazonaws.com/dev';
	const dispatch = useDispatch();
	const navigate = useNavigate();

	const teamId = 'team-1689466532241';

	const handleMessage = useCallback(
		(messageEvent) => {
			const message = JSON.parse(messageEvent.data);
			console.log('Got Message!');
			console.log('message: ', message);

			if (message && message.action === 'FIRST_QUESTION') {
				console.log('FIRST_QUESTION.data', message.data);
				dispatch(setIsQuestionLoading(false));
				dispatch(setQuiz(message.data));
				navigate('/Quiz');
			}

			if (message && message.action === 'END_GAME') {
				console.log('END_GAME.data', message.data.scores);
				dispatch(setIsQuestionLoading(false));
				const scores = message.data.scores;

				dispatch(setScore(scores[teamId]));
				navigate('/ScorePage');
			}

			if (message && message.action === 'NEXT_QUESTION') {
				console.log('NEXT_QUESTION.data', message.data);
				dispatch(
					updateQuiz({
						nextResponder: message.data.nextResponder,
						currentQuestion: message.data.question,
						currentQuestionIndex: message.data.questionIndex,
						isQuestionLoading: false,
					})
				);
			}
		},
		[dispatch]
	);

	useEffect(() => {
		ws.current = new WebSocket(wsApi);

		ws.current.onopen = () => {
			setWebSocket(ws.current);
			console.log('Connected to websocket');
		};

		ws.current.onmessage = handleMessage;

		ws.current.onclose = (e) => {
			if (e.code !== 1000) {
				// 1000 means normal closure
				console.log(
					'Socket is closed. Reconnect will be attempted.',
					e.reason
				);
				setTimeout(() => {
					setWebSocket(null);
					ws.current = new WebSocket(wsApi);
				}, 5000);
			}
		};

		ws.current.onerror = (err) => {
			console.error(
				'Socket encountered error: ',
				err.message,
				'Closing socket'
			);
			ws.current.close();
		};
		return () => {
			ws.current.close();
		};
	}, []);

	return (
		<WebSocketContext.Provider value={{ webSocket, message }}>
			{children}
		</WebSocketContext.Provider>
	);
};
