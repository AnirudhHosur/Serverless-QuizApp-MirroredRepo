import React, { useContext, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
	Table,
	TableHead,
	TableRow,
	TableCell,
	TableBody,
	Button,
	Typography,
	Box,
	CircularProgress,
} from '@mui/material';
import { styled } from '@mui/system';
import axios from 'axios';
import { WebSocketContext } from '../WebSocketContext/WebSocketProvider';
import { useDispatch, useSelector } from 'react-redux';
import ChatButton from '../teamchat/ChatButton';

const StyledButton = styled(Button)(({ theme, isready }) => ({
	color: '#fff',
	background: isready === 'true' ? '#4caf50' : '#f44336',
	'&:hover': {
		background: isready === 'true' ? '#45a049' : '#d32f2f',
	},
}));

const StatusBox = styled(Box)(({ theme, isready }) => ({
	color: isready === 'true' ? '#4caf50' : '#f44336',
	padding: '6px 16px',
	borderRadius: '4px',
	display: 'inline-block',
}));

const StartButton = styled(Button)(({ theme }) => ({
	marginTop: '20px',
	color: '#fff',
	backgroundColor: '#3f51b5',
	'&:hover': {
		backgroundColor: '#303f9f',
	},
	'&:disabled': {
		color: 'rgba(0, 0, 0, 0.26)',
		backgroundColor: 'rgba(0, 0, 0, 0.12)',
	},
}));

const TeamMembers = () => {
	// const teamId = 'team-1689466532241';
	const teamId = localStorage.getItem('teamId');

	// const gameId = '033c70b0-22e2-11ee-898b-dfc6867500b6';
	const gameId = localStorage.getItem('gameId');
	// console.log('gameId-----------', gameId);

	const [teamData, setTeamData] = useState(null);
	const [teamMembers, setTeamMembers] = useState([]);
	const [teamReady, setTeamReady] = useState(false);
	const [isLoading, setIsLoading] = useState(false);

	const sessionUserString = localStorage.getItem('currentUser');
	const sessionUser = JSON.parse(sessionUserString);
	const currentPlayerId = sessionUser ? sessionUser.email : null;

	const dispatch = useDispatch();

	const foundUser = teamMembers.find(
		(member) => member.userEmail === currentPlayerId
	);

	const fetchTeamMembers = async () => {
		try {
			// const response = await axios.get(
			// 	'https://nc0jzt33ed.execute-api.us-east-1.amazonaws.com/test/teams?teamId=team-1689466532241'
			// );
			const response = await axios.get(
				`https://sq9k6vbyqf.execute-api.us-east-1.amazonaws.com/test/team?teamId=${teamId}`
			);
			const data = response.data;
			setTeamData(data);
			setTeamMembers(data.teamMembers);
		} catch (error) {
			console.error('Error fetching team members:', error);
		}
	};

	const checkTeamReady = async () => {
		try {
			const response = await axios.post(
				'https://k0wesz1f4i.execute-api.us-east-1.amazonaws.com/dev/isready',
				// 'https://heot861m04.execute-api.us-east-1.amazonaws.com/dev/isready',
				{
					teamId: teamId,
				}
			);
			setTeamReady(response.data.allReady);
		} catch (error) {
			console.error('Error checking team readiness:', error);
		}
	};
	// console.log('checkTeamReady', checkTeamReady());

	const { webSocket, message } = useContext(WebSocketContext);

	useEffect(() => {
		const timer = setInterval(() => {
			fetchTeamMembers();
			checkTeamReady();
		}, 3000);

		// if (message && message.action === 'GAME_STARTED') {
		// 	// navigate('/Quiz');
		// }
		// if (message && message.action === 'FIRST_QUESTION') {
		// 	navigate('/Quiz', { state: { message: message } });
		// 	// navigate('/Quiz');
		// }
		if (message && message.action === 'FIRST_QUESTION') {
			setIsLoading(false);
		}
		return () => {
			clearInterval(timer);
		};
	}, [message]);

	const handleReadyToggle = async (userEmail) => {
		if (userEmail === currentPlayerId) {
			const memberIndex = teamMembers.findIndex(
				(member) => member.userEmail === userEmail
			);
			const newReadyStatus = !teamMembers[memberIndex].ready;

			setTeamMembers((prevTeamMembers) =>
				prevTeamMembers.map((member) =>
					member.userEmail === userEmail
						? { ...member, ready: newReadyStatus }
						: member
				)
			);

			try {
				const response = await axios.post(
					'https://zaji3l4fn6.execute-api.us-east-1.amazonaws.com/dev/status',
					// 'https://uuy9y7vzyl.execute-api.us-east-1.amazonaws.com/dev/status',
					{
						teamId: teamData.teamId,
						userEmail: userEmail,
						ready: newReadyStatus,
					}
				);
				const data = response.data;
				console.log(data);
			} catch (error) {
				console.error('Error updating status:', error);
			}
		}
	};

	const handleStartGame = async () => {
		setIsLoading(true);
		const request = {
			action: 'START_GAME',
			data: {
				teamId: teamId,
				gameId: gameId,
			},
		};
		webSocket.send(JSON.stringify(request));
	};

	if (!teamMembers.length) {
		// Show a loading indicator or return null until teamMembers data is available
		return <div>Loading...</div>;
	}

	return (
		<div style={{ margin: '20px' }}>
			<h2>Team Members</h2>
			<Table>
				<TableHead>
					<TableRow>
						<TableCell>Member</TableCell>
						<TableCell>Role</TableCell>
						<TableCell>Status</TableCell>
					</TableRow>
				</TableHead>
				<TableBody>
					{teamMembers.map((member) => (
						<TableRow key={member.userEmail}>
							<TableCell>{member.userEmail}</TableCell>
							<TableCell>{member.userRole}</TableCell>
							<TableCell>
								{member.userEmail === currentPlayerId ? (
									<StyledButton
										onClick={() =>
											handleReadyToggle(member.userEmail)
										}
										variant={
											member.ready
												? 'contained'
												: 'outlined'
										}
										isready={member.ready.toString()}
									>
										{member.ready ? 'Ready' : 'Not Ready'}
									</StyledButton>
								) : (
									<StatusBox
										isready={member.ready.toString()}
									>
										<Typography variant='button'>
											{member.ready
												? 'Ready'
												: 'Not Ready'}
										</Typography>
									</StatusBox>
								)}
							</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
			<StartButton
				variant='contained'
				disabled={!teamReady || foundUser.userRole !== 'admin'}
				onClick={handleStartGame}
			>
				{isLoading ? (
					<CircularProgress color='inherit' size={24} />
				) : (
					'Start'
				)}
			</StartButton>
			<div>
				<ChatButton />
			</div>
		</div>
	);
};

export default TeamMembers;
