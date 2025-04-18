import { useState, useEffect } from 'react'
import { 
  CircularProgress,
  Button,
  Box,
  Grid,
  Pagination,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Snackbar,
  Alert
} from '@mui/material'
import FilterListIcon from '@mui/icons-material/FilterList'
import { useAppDispatch, useAppSelector } from '../../hooks/redux-hooks'
import { updateFavorited } from '../../slices/userSlice'
import axiosInstance from '../../api/axiosInstance'
import { Dog } from '../../types/Dog'
import { DogLocation } from '../../types/DogLocation'
import DogCard from '../../components/DogCard'
import NavBar from '../../components/NavBar'
import { US_STATES } from '../../constants/constants'
import FilterBreeds from '../../components/FilterBreeds'
import FilterAge from '../../components/FilterAge'

// Home page after logging in where the user can search for dogs
const Home = () => {
  const dispatch = useAppDispatch()
  const userBasicInfo = useAppSelector((state) => state.user)

  const [dogs, setDogs] = useState<Dog[]>([])
  const [breeds, setBreeds] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [favorites, setFavorites] = useState<string[]>(userBasicInfo?.favorited || [])
  const [snackOpen, setSnackOpen] = useState(false)
  const pageSize = 50

  // Filter state
  const [showFilters, setShowFilters] = useState(false)
  const [selectedBreeds, setSelectedBreeds] = useState<string[]>([])
  const [minAge, setMinAge] = useState<number | ''>('')
  const [maxAge, setMaxAge] = useState<number | ''>('')
  const [sortField, setSortField] = useState<'breed' | 'name' | 'age'>('breed')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc')

  const sort = `${sortField}:${sortOrder}`

  useEffect(() => {
    fetchBreeds()
    handleApplyFilters()
  }, [])

  useEffect(() => {
    dispatch(updateFavorited(favorites))
  }, [favorites])

  const fetchDogs = async (pageNum = 1) => {
    setLoading(true)
    const offset = (pageNum - 1) * pageSize
    const params: any = { 
      breeds: selectedBreeds,
      from: offset, 
      size: pageSize,
      sort: sort,
    }
    if (minAge !== '') {
      params.ageMin = minAge
    }
    if (maxAge !== '') {
      params.ageMax = maxAge
    }
    
    // Get dogs based on filter options
    const searchRes = await axiosInstance.get('/dogs/search', { params })
    const dogsRes = await axiosInstance.post('/dogs', searchRes.data.resultIds)

    // Get dogs location based on zip codes
    const zipCodes = dogsRes.data.map((dog: Dog) => dog.zip_code)
    const locationsRes = await axiosInstance.post('/locations', zipCodes)
    const locationMap = new Map<string, DogLocation>(
      locationsRes.data
        .filter((loc: DogLocation): loc is DogLocation => loc !== null)
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
    })
    setDogs(newDogs)
    setTotalPages(Math.ceil(searchRes.data.total / pageSize))
    setLoading(false)
  }

  // Get all possible breeds to display on filter bar
  const fetchBreeds = async () => {
    const breedsRes = await axiosInstance.get('/dogs/breeds')
    setBreeds(breedsRes.data)
  }

  const handlePageChange = (_: React.ChangeEvent<unknown>, value: number) => {
    setPage(value)
    fetchDogs(value)
  }

  const toggleFavorite = (dogId: string) => {
    setFavorites((prev) => {
      const isFav = prev.includes(dogId)
      if (isFav) {
        return prev.filter((id) => id !== dogId)
      }
      // Number of favorites must not go above 100 to accomodate the POST /dogs/match request
      else if (prev.length < 100) {
        return [...prev, dogId]
      } 
      else {
        setSnackOpen(true)
        return prev
      }
    })
  }

  const handleApplyFilters = () => {
    setPage(1)
    fetchDogs(1)
  }

  return (
    <>      
      <Box
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: theme => theme.zIndex.drawer + 2,
        }}
      >
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
              <Button
                variant='outlined'
                color='inherit'
                size='small'
                onClick={() => setShowFilters(prev => !prev)}
                sx={{ m:1 }}
              >
                <FilterListIcon />
                Filter
              </Button>
            </Grid>
          </Box>
        </Grid>
      </Box>

      {/* Dog card Display */}
      {loading ? (
        <CircularProgress size={24} color='inherit' />
      ) : (
        <Grid container mt={10} mb={14} mx={3} spacing={2} columns={60}>
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

      {/* Favorites Limit Alert */}
      <Snackbar open={snackOpen} autoHideDuration={3000} onClose={() => setSnackOpen(false)}>
        <Alert onClose={() => setSnackOpen(false)} severity='warning' sx={{ width: '100%' }}>
          Favorites limit reached (100 dogs max)
        </Alert>
      </Snackbar>

      <footer style={{ color: 'gray', position: 'fixed', bottom: 0, right: 10 }}>
        <Box 
          my={4} 
          display='flex' 
          justifyContent='center' 
          bgcolor={'primary'}
          p={1}
          sx={{ 
            backgroundColor: '#333', 
            borderRadius: '25px',
            borderTop: '1px solid #555',
          }}
        >
          <Pagination
            count={totalPages}
            page={page}
            onChange={handlePageChange}
            color='primary'
            variant='outlined'
          />
        </Box>
      </footer>
    </>
  )
}

export default Home