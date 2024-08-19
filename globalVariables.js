// tutaj tworzymy dynamiczny obiekt canvas i dodajemy 2D rendering context
let canvas = document.querySelector('#canvas');
let ctx = canvas.getContext('2d');

let board;
let tileImgs=[];
let tileIds=[];
let shuffledIds=[];

let howManyPictures = 3;
let randomNumberToPicture = 1;
let picture = `./foto/foto${randomNumberToPicture}.jpg`;