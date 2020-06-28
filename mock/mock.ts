import { Place } from '../src/app/places/places.model';

const DUMMY_PLACES = [
  new Place(
    'p1',
    'Basantapur',
    'Kathmandu',
    'This is capital',
    'http://ecs.com.np/fckimage/article/images/2015/9/basantapur_2.jpg',
    1200,
    new Date('2020-01-01'),
    new Date('2022-02-25'),
    'abc'
  ),
  new Place(
    'p2',
    'Patan',
    'Lalitpur',
    'This is tourist place',
    'https://www.wondermondo.com/wp-content/uploads/2017/10/PatanDurbarSquare.jpg?ezimgfmt=ng:webp/ngcb9',
    1000,
    new Date('2022-08-01'),
    new Date('2022-11-11'),
    'xyz'
  ),
  new Place(
    'p3',
    'Bhaktapur',
    'Bhaktapur',
    'This is another famous tourist place',
    'http://www.holidaynepal.com/gallery/images/bhaktapur.jpg',
    889,
    new Date('2024-07-03'),
    new Date('2025-07-03'),
    'xyz'
  ),
];
