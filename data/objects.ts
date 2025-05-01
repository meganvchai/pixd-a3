export interface ArchiveObject {
  id: string;
  name: string;
  city: string;
  year: string;
  type: string;
  image: string; // path to the image file, e.g. "/images/objects/your-image.png"
}

export const archiveObjects: ArchiveObject[] = [
  { id: "object-1", name: "White Whale Bookstore", city: "Pittsburgh, PA", year: "2024", type: "Bookmark", image: "/images/objects/white whale.png" },
  { id: "object-2", name: "Cal Volleyball vs. Stanford", city: "Berkeley, CA", year: "2022", type: "Sports ticket", image: "/images/objects/volleyball.png" },
  { id: "object-3", name: "Tenryu-ji Temple", city: "Kyoto, Japan", year: "2023", type: "Attraction ticket", image: "/images/objects/tenryuji temple.png" },
  { id: "object-4", name: "Recycle Book Store", city: "San Jose, CA", year: "2023", type: "Bookmark", image: "/images/objects/recycle book store.png" },
  { id: "object-5", name: "Read More Books, Eat More Pickles", city: "New York, NY", year: "2023", type: "Bookmark", image: "/images/objects/pickle bookstore.png" },
  { id: "object-6", name: "Pittsburgh Ballet Presents The Nutcracker", city: "Pittsburgh, PA", year: "2024", type: "Theater ticket", image: "/images/objects/pittsburgh ballet.png" },
  { id: "object-7", name: "Olive Jellycat", city: "San Jose, CA", year: "2023", type: "Plushie", image: "/images/objects/olive jellycat.png" },
  { id: "object-8", name: "MTA Metro Card", city: "New York, NY", year: "2023", type: "Transportation ticket", image: "/images/objects/ny metro card.png" },
  { id: "object-9", name: "The Dance by Henri Matisse", city: "New York, NY", year: "2022", type: "Museum postcard", image: "/images/objects/moma.png" },
  { id: "object-10", name: "Miffy Doing Things", city: "Pittsburgh, PA", year: "2024", type: "Blind box figure", image: "/images/objects/miffy.png" },
  { id: "object-11", name: "Marukyu Koyamaen Matcha", city: "Kyoto, Japan", year: "2023", type: "Paper memento", image: "/images/objects/matcha.png" },
  { id: "object-12", name: "JR Rail Pass", city: "Tokyo, Japan", year: "2023", type: "Transportation ticket", image: "/images/objects/jr.png" },
  { id: "object-13", name: "Hawaiian Hello Kitty", city: "Honolulu, HI", year: "2023", type: "Plushie", image: "/images/objects/hello kitty.png" },
  { id: "object-14", name: "Gudetama EasyCard", city: "Taipei, Taiwan", year: "2023", type: "Transportation ticket", image: "/images/objects/gudetama card.png" },
  { id: "object-15", name: "Fournee Bakery", city: "Berkeley, CA", year: "2023", type: "Paper memento", image: "/images/objects/fournee.png" },
  { id: "object-16", name: "Daytrip", city: "Oakland, CA", year: "2022", type: "Restaurant card", image: "/images/objects/daytrip.png" },
  { id: "object-17", name: "Dishoom", city: "London, UK", year: "2024", type: "Restaurant card", image: "/images/objects/dishoom.png" },
  { id: "object-18", name: "Terrace in Central Park", city: "New York, NY", year: "2021", type: "Postcard", image: "/images/objects/central park.png" },
  { id: "object-19", name: "", city: "", year: "", type: "", image: "/images/objects/cat.png" },
  { id: "object-20", name: "", city: "", year: "", type: "", image: "/images/objects/carbone.png" },
  { id: "object-21", name: "", city: "", year: "", type: "", image: "/images/objects/big sur picture.png" },
  { id: "object-22", name: "", city: "", year: "", type: "", image: "/images/objects/cal pig.png" },
  { id: "object-23", name: "", city: "", year: "", type: "", image: "/images/objects/berkeley postcard.png" },
]; 