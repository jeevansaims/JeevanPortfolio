export type PhotoCategory = {
  title: string
  slug: string
  photos: string[]
}

// Drop Sandhya's photos into public/photos/<category>/ and update filenames.
// Example filename: sandhya-portraits-natural-light-01.jpg
export const photoCategories: PhotoCategory[] = [
  {
    title: "Portraits",
    slug: "portraits",
    photos: [],
  },
  {
    title: "Travel",
    slug: "travel",
    photos: [],
  },
  {
    title: "Street",
    slug: "street",
    photos: [],
  },
  {
    title: "Nature",
    slug: "nature",
    photos: [],
  },
  {
    title: "Weddings",
    slug: "weddings",
    photos: [],
  },
]
