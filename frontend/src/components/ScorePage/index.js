import React from 'react';
import { Typography, Box, Card, CardContent, Grid } from '@mui/material';
import { useSelector } from 'react-redux';

const ScorePage = () => {
	const score = useSelector((state) => state.score.score);
	if (!score) {
		return <div>Loading...</div>;
	}

	return (
		<Box
			sx={{
				minHeight: '100vh',
				backgroundColor: '#f4f6f8',
				p: 2,
				display: 'flex',
				flexDirection: 'column',
				justifyContent: 'center',
			}}
		>
			<Grid container justifyContent='center'>
				<Grid item xs={12} sm={8} md={6}>
					<Card
						sx={{ p: 2, backgroundColor: '#ffffff' }}
						elevation={3}
					>
						<CardContent>
							<Typography variant='h4' sx={{ color: '#0d47a1' }}>
								Team Score: {score.teamScore}
							</Typography>
							{score.members &&
								Object.entries(score.members).map(
									([email, scores]) => (
										<Card
											sx={{
												my: 2,
												backgroundColor: '#e0f7fa',
											}}
											elevation={1}
										>
											<CardContent>
												<Typography
													variant='h6'
													sx={{ color: '#bf360c' }}
												>
													{email}
												</Typography>
												<Typography variant='body1'>
													Correct Answers:{' '}
													{scores.correctAnswersCount}
												</Typography>
												<Typography variant='body1'>
													Incorrect Answers:{' '}
													{
														scores.incorrectAnswersCount
													}
												</Typography>
											</CardContent>
										</Card>
									)
								)}
						</CardContent>
					</Card>
				</Grid>
			</Grid>
		</Box>
	);
};

export default ScorePage;
