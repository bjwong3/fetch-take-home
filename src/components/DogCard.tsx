import { useState, memo } from 'react'
import { Card, CardMedia, CardContent, Typography, Box } from '@mui/material'
import FavoriteIcon from '@mui/icons-material/Favorite'
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder'
import { Dog } from '../types/Dog'

interface DogCardProps {
  dog: Dog
  isFavorited: boolean
  onToggleFavorite: (dogId: string) => void
}

// Card container to display a dogs photo and information
const DogCard: React.FC<DogCardProps> = memo(({ dog, isFavorited, onToggleFavorite }) => {
  const [hovered, setHovered] = useState(false)

  return (
    <Card
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      sx={{
        transition: 'transform 0.3s, box-shadow 0.3s',
        boxShadow: hovered ? 8 : 2,
        position: 'relative',
      }}
    >
      {/* Image */}
      <CardMedia
        component='img'
        height='400vh'
        image={dog.img}
        alt={dog.name}
      />
      {/* Content */}
      <Box sx={{ position: 'relative' }}>
        <CardContent
          sx={{
            color: 'white',
            bgcolor: '#12171d',
            textAlign: 'left'
          }}
        >
          <Typography variant='h6'>{dog.name}</Typography>
          <Typography variant='body2'>Breed: {dog.breed}</Typography>
          <Typography variant='body2'>Age: {dog.age} years old</Typography>
          <Typography variant='body2'>Zip: {dog.zip_code}</Typography>
          <Typography variant='body2'>State: {dog.state}</Typography>
          <Typography variant='body2'>City: {dog.city}</Typography>
        </CardContent>
        {/* Favorited overlay */}
        <Box
          sx={{
            position: 'absolute',
            top: 8,
            right: 8,
            cursor: 'pointer',
            opacity: hovered || isFavorited ? 1 : 0,
            transition: 'opacity 0.3s ease-in-out',
          }}
          onClick={(e) => {
            e.stopPropagation()
            onToggleFavorite(dog.id)
          }}
        >
          {isFavorited ? (
            <FavoriteIcon sx={{ color: '#ff0856', fontSize: 30 }} />
          ) : (
            <FavoriteBorderIcon sx={{ color: '#ff0856', fontSize: 30 }} />
          )}
        </Box>
      </Box>
    </Card>
  )
})

export default DogCard
