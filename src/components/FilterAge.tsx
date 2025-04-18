import { memo } from 'react'
import { 
	Grid,
	TextField,
} from '@mui/material'

interface FilterAgeProps {
	minAge: number | ''
	maxAge: number | ''
	setMinAge: (selected: number | '') => void
	setMaxAge: (selected: number | '') => void
	style?: {}
}

// Filter Age Option Component
const FilterAge: React.FC<FilterAgeProps> = memo(({ minAge, maxAge, setMinAge, setMaxAge, style={ width: 120 } }) => {
	return (
		<>
			<Grid>
				<TextField
					label='Min Age'
					type='number'
					value={minAge}
					onChange={(e) => {
						if (e.target.value) setMinAge(Number(e.target.value) >= 0 ? Number(e.target.value) : 0)
						else setMinAge('')
					}}
					variant='outlined'
					size='small'
					sx={style}
				/>
			</Grid>
			<Grid>
				<TextField
					label='Max Age'
					type='number'
					value={maxAge}
					onChange={(e) => {
						if (e.target.value) setMaxAge(Number(e.target.value) >= 0 ? Number(e.target.value) : 0)
						else setMaxAge('')
					}}
					variant='outlined'
					size='small'
					sx={style}
				/>
			</Grid>
		</>
	)
})

export default FilterAge