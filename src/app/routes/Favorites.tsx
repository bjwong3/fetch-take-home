import { useState, useEffect } from 'react'
import { 
  CircularProgress,
  Button,
  Box,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
	Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions
} from '@mui/material'
import FilterListIcon from '@mui/icons-material/FilterList'
import NavBar from '../../components/NavBar'
import { Dog } from '../../types/Dog'
import DogCard from '../../components/DogCard'
import { useAppDispatch, useAppSelector } from '../../hooks/redux-hooks'
import { updateFavorited } from '../../slices/userSlice'
import axiosInstance from '../../api/axiosInstance'
import { DogLocation } from '../../types/DogLocation'
import { US_STATES } from '../../constants/constants'
import FilterBreeds from '../../components/FilterBreeds'
import FilterAge from '../../components/FilterAge'

// Displays favorited dogs and gives the option to find a match
const Favorites = () => {
	const dispatch = useAppDispatch()
	const userBasicInfo = useAppSelector((state) => state.user)

	const [dogs, setDogs] = useState<Dog[]>([])
	const [loading, setLoading] = useState(false)
  const [favorites, setFavorites] = useState<string[]>(userBasicInfo?.favorited || [])
	const [breeds, setBreeds] = useState<string[]>([])
	const [confirmOpen, setConfirmOpen] = useState(false)
	const [matchDialogOpen, setMatchDialogOpen] = useState(false)
  const [matchedDog, setMatchedDog] = useState<Dog | null>(null)

	// Filter state
	const [showFilters, setShowFilters] = useState(false)
  const [selectedBreeds, setSelectedBreeds] = useState<string[]>([])
  const [minAge, setMinAge] = useState<number | ''>('')
  const [maxAge, setMaxAge] = useState<number | ''>('')
  const [sortField, setSortField] = useState<'breed' | 'name' | 'age' | 'dateAdded'>('dateAdded')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc')

	useEffect(() => {
		handleApplyFilters()
	}, [])

	useEffect(() => {
		dispatch(updateFavorited(favorites))
	}, [favorites])

	const fetchFavorites = async () => {
    setLoading(true)
    // Get all dogs that were favorited
    const dogsRes = await axiosInstance.post('/dogs', favorites)

    // Get each dogs location based on their zip code
		const zipCodes = dogsRes.data.map((dog: Dog) => dog.zip_code)
		const locationsRes = await axiosInstance.post('/locations', zipCodes)
		const locationMap = new Map<string, DogLocation>(
      locationsRes.data
        .filter((loc: DogLocation): loc is DogLocation => loc !== null) // filters out nulls and narrows the type
        .map((loc: DogLocation) => [loc.zip_code, loc])
    )

    // Add state and city to Dog object
		const newDogs = dogsRes.data.map((dog: Dog) => {
			const location = locationMap.get(dog.zip_code)
			return {
				...dog,
				city: location?.city || '',
				state: location ? US_STATES[location.state] : ''
			}
		}) as Dog[]

    setDogs(newDogs)
    // Only show breeds that were favorited in the filter
		setBreeds([...new Set(newDogs.map(item => item.breed))])
    setLoading(false)

		return newDogs
  }

	const handleMatch = async () => {
    if (favorites.length === 0) return
  
    // Get matched dog based on favorites
    const matchRes = await axiosInstance.post('/dogs/match', favorites)
    const dogRes = await axiosInstance.post('/dogs', [matchRes.data.match])
    const zipCode = dogRes.data[0].zip_code
  
    // Get matched dog's location based on zip code
    const locationRes = await axiosInstance.post('/locations', [zipCode])
    const location = locationRes.data[0]
  
    if (!location) {
      console.warn(`No location found for zip code: ${zipCode}`)
      setMatchedDog({
        ...dogRes.data[0],
        city: '',
        state: ''
      })
    } else {
      setMatchedDog({
        ...dogRes.data[0],
        city: location.city,
        state: US_STATES[location.state] || location.state || ''
      })
    }
  
    // Display matched dog dialog
    setMatchDialogOpen(true)
  }

	const toggleFavorite = (dogId: string) => {
    setFavorites((prev) => {
      const isFav = prev.includes(dogId)
      const updatedFavorites = isFav
        ? prev.filter((id) => id !== dogId)
        : [...prev, dogId]
      return updatedFavorites
    })
  }

	const sortFunction = (a: Dog, b: Dog) => {
		if (sortField === 'dateAdded') {
			const aIndex = favorites.indexOf(a.id)
			const bIndex = favorites.indexOf(b.id)
			return sortOrder === 'asc' ? bIndex - aIndex : aIndex - bIndex
		}
	
		if (sortField === 'age') {
			return sortOrder === 'asc' ? a.age - b.age : b.age - a.age
		}
	
		return sortOrder === 'asc'
			? a[sortField].localeCompare(b[sortField])
			: b[sortField].localeCompare(a[sortField])
	}
	
	const handleApplyFilters = async () => {
		const dogsRes: Dog[] = await fetchFavorites()
	
		const filtered = dogsRes.filter((dog) => {
			const breedMatch = selectedBreeds.length === 0 || selectedBreeds.includes(dog.breed)
			const ageMinMatch = minAge === '' || dog.age >= minAge
			const ageMaxMatch = maxAge === '' || dog.age <= maxAge
			return breedMatch && ageMinMatch && ageMaxMatch
		})
	
		setDogs(filtered.sort(sortFunction))
	}

	return (
		<>
      {/* Navigation Bar */}
			<NavBar />
			<Grid container spacing={2} alignItems='right'>
          <Box 
            sx={{
              position: 'fixed',
              backgroundColor: '#333',
              top: 64,
              right: 4,
              mx: 2.5,
              width: 'fit-content',
              borderBottom: '1px solid #555',
              borderRadius: '5px',
              borderTop: '1px solid #555',
              zIndex: theme => theme.zIndex.drawer + 2
            }}
          >
            <Grid container spacing={2}>
              {showFilters && (
                <Grid container spacing={2} alignItems='center' sx={{ p:1 }}>
                  {/* Breeds Filter */}
                  <FilterBreeds
                    options={breeds}
                    selected={selectedBreeds}
                    setSelected={setSelectedBreeds}
                  />

                  
                  <Grid>
                    <Grid container spacing={1}>
                      {/* Age Filter */}
                      <FilterAge 
                        minAge={minAge}
                        maxAge={maxAge}
                        setMinAge={setMinAge}
                        setMaxAge={setMaxAge}
                      />

                      {/* Sort */}
                      <Grid>
                        <FormControl variant='outlined' size='small' fullWidth>
                          <InputLabel>Sort By</InputLabel>
                          <Select
                            value={sortField}
                            onChange={(e) => setSortField(e.target.value as 'breed' | 'name' | 'age')}
                            label='Sort By'
                          >
                            <MenuItem value='breed'>Breed</MenuItem>
                            <MenuItem value='name'>Name</MenuItem>
                            <MenuItem value='age'>Age</MenuItem>
														<MenuItem value='dateAdded'>Date Added</MenuItem>
                          </Select>
                        </FormControl>
                      </Grid>
                      <Grid>
                        <FormControl variant='outlined' size='small' fullWidth>
                          <InputLabel>Order</InputLabel>
                          <Select
                            value={sortOrder}
                            onChange={(e) => setSortOrder(e.target.value as 'asc' | 'desc')}
                            label='Order'
                          >
                            <MenuItem value='asc'>Ascending</MenuItem>
                            <MenuItem value='desc'>Descending</MenuItem>
                          </Select>
                        </FormControl>
                      </Grid>
                      <Grid>
                        <Button variant='contained' color='primary' onClick={handleApplyFilters} fullWidth>
                          Apply Filters
                        </Button>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              )}

              {/* Filter Button */}
							<Button
								variant='outlined'
								color='inherit'
								size='small'
								sx={{ my: 1, ml: 1}}
								onClick={() => setShowFilters(prev => !prev)}
							>
								<FilterListIcon />
								Filter
							</Button>
              {/* Match Button */}
							<Button
								variant='outlined'
								color='info'
								size='small'
								onClick={() => handleMatch()}
								sx={{ my: 1}}
							>
								Match
							</Button>
              {/* Clear Favorites Button */}
							<Button
								variant='outlined'
								color='error'
								size='small'
								onClick={() => setConfirmOpen(true)}
								sx={{ my: 1, mr: 1}}
							>
								Clear Favorites
							</Button>
            </Grid>
          </Box>
        </Grid>

      {/* Dog card display */}
			{loading ? (
				<CircularProgress size={24} color='inherit' />
			) : (
				<Grid alignItems='center' justifyContent='center' container mt={10} mb={14} mx={3} spacing={2} columns={60}>
					{dogs.map((dog) => (
						<Grid size={{ xs: 60, sm: 30, md: 20, lg: 12 }} key={dog.id} sx={{ minWidth: 358 }}>
							<DogCard 
								dog={dog}
								isFavorited={favorites.includes(dog.id)}
								onToggleFavorite={toggleFavorite}
							/>
						</Grid>
					))}
				</Grid>
			)}

      {/* Matched Dog Dialog */}
			<Dialog open={matchDialogOpen} onClose={() => setMatchDialogOpen(false)}>
        <DialogTitle>Your Favorite Matched Dog:</DialogTitle>
        <DialogContent>
          {matchedDog && <DogCard dog={matchedDog} isFavorited={favorites.includes(matchedDog.id)} onToggleFavorite={toggleFavorite} />}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setMatchDialogOpen(false)} color='primary'>
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* Clear Favorites Dialog */}
			<Dialog
				open={confirmOpen}
				onClose={() => setConfirmOpen(false)}
			>
				<DialogTitle>Clear Favorites</DialogTitle>
				<DialogContent>
					<DialogContentText>
						Are you sure you want to clear all favorites?
					</DialogContentText>
				</DialogContent>
				<DialogActions>
					<Button onClick={() => setConfirmOpen(false)} color='primary'>
						Cancel
					</Button>
					<Button
						onClick={() => {
							setFavorites([])
							setDogs([])
							setConfirmOpen(false)
						}}
						color='error'
					>
						Clear
					</Button>
				</DialogActions>
			</Dialog>
		</>
	)
}

export default Favorites