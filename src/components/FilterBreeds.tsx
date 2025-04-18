import { memo } from 'react'
import { 
  Grid,
  TextField,
  Checkbox,
  Autocomplete
} from '@mui/material'
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank'
import CheckBoxIcon from '@mui/icons-material/CheckBox'

interface FilterBreedsProps {
  options: string[]
  selected: string[]
  setSelected: (selected: string[]) => void
	style?: {}
}

// Filter Breeds Option Component
const FilterBreeds: React.FC<FilterBreedsProps> = memo(({ options, selected, setSelected, style={ width: 800 } }) => {
	const icon = <CheckBoxOutlineBlankIcon fontSize='small' />
  const checkedIcon = <CheckBoxIcon fontSize='small' />
	
	return (
		<>
			<Grid>
				<Autocomplete
					multiple
					options={options}
					value={selected}
					disableCloseOnSelect
					onChange={(_event, newValue) => setSelected(newValue)}
					renderOption={(props, option, { selected }) => {
						const { key, ...optionProps } = props
						return (
							<li key={key} {...optionProps}>
								<Checkbox
									icon={icon}
									checkedIcon={checkedIcon}
									style={{ marginRight: 8 }}
									checked={selected}
								/>
								{option}
							</li>
						)
					}}
					renderInput={(params) => (
						<TextField 
							{...params} 
							label={'Breeds'}
							placeholder='Search' 
							variant='outlined'
							size='small'
						/>
					)}
					style={style}
				/>
			</Grid>
		</>
	)
})

export default FilterBreeds