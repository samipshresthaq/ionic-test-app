import { Component, OnInit } from '@angular/core';
import { Recipe } from './recipe.model';

@Component({
  selector: 'app-recipes',
  templateUrl: './recipes.page.html',
  styleUrls: ['./recipes.page.scss'],
})
export class RecipesPage implements OnInit {

  recipes: Recipe[] = [
    {
    id: '1',
    title: 'Momo',
    // tslint:disable-next-line: max-line-length
    imageURL: 'https://food.fnr.sndimg.com/content/dam/images/food/fullset/2018/1/10/0/DV2802_Nepali-Momo_s4x3.jpg.rend.hgtvcom.826.620.suffix/1515644556794.jpeg',
    ingredients: ['kachela', 'pitho', 'soup']
    },
    {
      id: '2',
      title: 'Chow Mein',
      // tslint:disable-next-line: max-line-length
      imageURL: 'https://simplyhomecooked.com/wp-content/uploads/2019/08/vegetable-chow-mein-8.jpg',
      ingredients: ['Buff meat piece', 'ketchup','Noodle Sticks']
      }
  ];

  constructor() { }

  ngOnInit() {
  }

}
