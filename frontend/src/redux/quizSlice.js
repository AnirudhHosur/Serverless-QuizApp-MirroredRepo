// quizSlice.js
import { createSlice } from '@reduxjs/toolkit';

export const quizSlice = createSlice({
	name: 'quiz',
	initialState: {
		gameId: '',
		questions: [],
		nextResponder: {},
		totalQuestions: 0,
		currentQuestion: {},
		currentQuestionIndex: 0,
	},
	reducers: {
		setQuiz: (state, action) => {
			state.gameId = action.payload.gameId;
			state.nextResponder = action.payload.nextResponder;
			state.totalQuestions = action.payload.totalQuestions;
			state.currentQuestion = action.payload.question;
			state.currentQuestionIndex = action.payload.questionIndex;
		},
		updateQuiz: (state, action) => {
			Object.keys(action.payload).forEach((key) => {
				state[key] = action.payload[key];
			});
		},
		setGameId: (state, action) => {
			state.gameId = action.payload;
		},
		setCurrentQuestion: (state, action) => {
			state.currentQuestion = action.payload;
		},
		addQuestion: (state, action) => {
			state.questions.push(action.payload);
		},
		setTotalQuestions: (state, action) => {
			state.totalQuestions = action.payload;
		},
		setNextResponder: (state, action) => {
			state.nextResponder = action.payload;
		},
		setCurrentQuestionIndex: (state, action) => {
			state.currentQuestionIndex = action.payload;
		},
		resetQuiz: (state) => {
			state.gameId = '';
			state.questions = [];
			state.nextResponder = {};
			state.totalQuestions = 0;
			state.currentQuestion = {};
			state.currentQuestionIndex = 0;
		},
	},
});

export const {
	setQuiz,
	updateQuiz,
	setGameId,
	setCurrentQuestion,
	addQuestion,
	setTotalQuestions,
	setCurrentQuestionIndex,
	resetQuiz,
} = quizSlice.actions;

export default quizSlice.reducer;
