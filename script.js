// tutaj tworzymy Image objekt, a nastepnie wiążemy(binding) funkcje eventListener onload z obrazkiem do canvas 
let img = new Image();
img.addEventListener('load', cutImageIntoPieces);
img.src = picture;
// tworzymy pomocne zdjęcie
helperImage.src = picture;

function cutImageIntoPieces() {
  board = new Board(this.naturalWidth, this.naturalHeight, howManyPictures);

  // używamy metod i właściwości canvas oraz ctx (głównie do stylu)
  canvas.width = board.width;
  canvas.height = board.height;
  canvas.addEventListener('click', move);
  ctx.fillStyle = 'gray';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // część logiczna do pocięcia obrazka na mniejsze części
  // tworzymy tymczasowy element canvas z context 2D
  let temporaryCanvas = document.createElement('canvas');
  temporaryCanvas.width = board.tileWidth;
  temporaryCanvas.height = board.tileHeight;
  let temporaryCtx = temporaryCanvas.getContext('2d');

  for (let row = 0; row < board.rowCols; row++) {
    for (let col = 0; col < board.rowCols; col++) {
      temporaryCtx.drawImage(this, row * board.widthIP, col * board.heightIP, board.widthIP, board.heightIP, 0, 0, temporaryCanvas.width, temporaryCanvas.height);
      tileImgs.push(temporaryCanvas.toDataURL());
      let id = row + col * board.rowCols;
      tileIds.push(id);
    }
  }

  shuffle();
  drawAllTiles();
}

function shuffle() {
  shuffledIds = [...tileIds]; // tworzenie kopii tablicy tileIds
  shuffledIds.sort(() => Math.random() - 0.5);
  for (let i = 0; i < shuffledIds.length; i++) {
    if (shuffledIds[i] != tileIds[i]) {
      // Idea tego jest taka, aby pusty element był obrazkiem, który po ułożeniu jest ostatnim elementem ( czyli znajduje się w prawym dolnym rogu)  
      let blank = shuffledIds.indexOf(shuffledIds.length - 1);
      shuffledIds[blank] = -1;
      return;
    }
    shuffle();
  }
}

function drawAllTiles() {
  for (let index = 0; index < shuffledIds.length; index++) {
    if (shuffledIds[index] == -1) continue;
    let coord = getRowColFromIndex(index);
    let x = coord.x;
    let y = coord.y;
    let imgURL = tileImgs[shuffledIds[index]];
    let imgObj = new Image();
    imgObj.addEventListener('load', function () {
      ctx.drawImage(this, 0, 0, this.width, this.height, x * board.tileWidth, y * board.tileHeight, board.tileWidth, board.tileHeight);
    });
    imgObj.src = imgURL;
  }
}

function getRowColFromIndex(i) {
  let col = Math.floor(i / board.rowCols);
  let row = i % board.rowCols;
  return { x: row, y: col };
}

function move(e) {
  // clientX zapewnia poziomą współrzędną w oknie aplikacji, w której wystąpiło zdarzenie
  // clientY zapewnia pionową współrzędną w oknie aplikacji, w której wystąpiło zdarzenie 
  let coords = getMouseCoords(e.clientX, e.clientY);
  let tileX = coords.x;
  let tileY = coords.y;
  let blankCoords = getRowColFromIndex(findBlankIndex());
  let blankX = blankCoords.x;
  let blankY = blankCoords.y;
  if (!hasBlankNeighbour(tileX, tileY, blankX, blankY)) return;

  const swapDataImage = ctx.getImageData(tileX * board.tileWidth, tileY * board.tileHeight, board.tileWidth, board.tileHeight); // getImageData() zwraca obiekt ImageData reprezentujący podstawowe dane pikseli dla określonej części płótna.
  ctx.fillRect(tileX * board.tileWidth, tileY * board.tileHeight, board.tileWidth, board.tileHeight);
  ctx.putImageData(swapDataImage, blankX * board.tileWidth, blankY * board.tileHeight);

  const imgIdx = getIndexFromCoords(tileX, tileY);
  const blankIdx = getIndexFromCoords(blankX, blankY);

  swapIndex(imgIdx, blankIdx);

  if (isSolved()) {
    canvas.removeEventListener('click', move);
    drawLastTile();
  }
}

function getMouseCoords(x, y) {
  let offset = canvas.getBoundingClientRect(); // getBoundingClientRect() zwraca obiekt DOMRect dostarczający informacji o rozmiarze elementu i jego położeniu względem rzutni.
  let left = Math.floor(offset.left);
  let top = Math.floor(offset.top);
  // W tych zmiennych należy odjąć jeszcze przesunięcie left oraz top gdyż cały obraz jest przesunięty bliżej centrum
  let row = Math.floor((x - left) / board.tileWidth);
  let col = Math.floor((y - top) / board.tileHeight);
  return { x: row, y: col };
}

function findBlankIndex() {
  for (let i = 0; i < shuffledIds.length; i++) {
    if (shuffledIds[i] == -1) return i;
  }
}

function hasBlankNeighbour(tileX, tileY, blankX, blankY) {
  if (tileX != blankX && tileY != blankY) return false;
  if (Math.abs(tileX - blankX) == 1 || Math.abs(tileY - blankY) == 1) return true;
  return false;
}

function getIndexFromCoords(x, y) {
  return x + y * board.rowCols;
}

function swapIndex(imgIdx, blankIdx) {
  shuffledIds[blankIdx] = shuffledIds[imgIdx];
  shuffledIds[imgIdx] = -1;
}

function isSolved() {
  for (let i = 0; i < shuffledIds.length; i++) {
    if (shuffledIds[i] == -1) continue;
    if (shuffledIds[i] != tileIds[i]) return false;
  }
  resetButton[0].style.display = 'block';
  return true;
}

function drawLastTile() {
  let blank = findBlankIndex();
  coords = getRowColFromIndex(blank);
  let x = coords.x;
  let y = coords.y;
  let imgUrl = tileImgs[tileIds[blank]];
  const imgObj = new Image();
  imgObj.addEventListener('load', function () {
    ctx.drawImage(this, 0, 0, this.width, this.height, x * board.tileWidth, y * board.tileHeight, board.tileWidth, board.tileHeight);
  });
  imgObj.src = imgUrl;
}

const resetFun = () => {
  resetButton[0].style.display = 'none';

  tileImgs=[];
  tileIds=[];
  shuffledIds=[];

  helperImage.src = picture;
  img.addEventListener('load', cutImageIntoPieces);
  img.src = picture;
}

const changePictureFun = () => {
  resetButton[0].style.display = 'none';

  tileImgs=[];
  tileIds=[];
  shuffledIds=[];

  let temp = randomNumberToPicture;
  while(!isDiffrentNumber(randomNumberToPicture , temp)){
    randomNumberToPicture = Math.floor(Math.random() * 10) + 1;
    picture = `./foto/foto${randomNumberToPicture}.jpg`;
  }

  helperImage.src = picture;
  img.addEventListener('load', cutImageIntoPieces);
  img.src = picture;
}

function isDiffrentNumber(a, b){
  if(a == b) return false 
  return true
}

const chooseSizeFun = () => {
  // Ta funkcja odznacza wszytskie checkboxy i zaznacza ten, który został zaznaczony
  size.forEach((checkbox) => {
    if (checkbox !== event.target) {
      checkbox.checked = false;
    }
  });
  
  size.forEach((checkbox) => {
    if (checkbox.checked) {
      howManyPictures = Number(checkbox.value);
      resetFun();
    }
  });
}

resetButton[0].addEventListener('click', resetFun);
changePictureButton.addEventListener('click', changePictureFun);
size.forEach((element) => {
  element.addEventListener('change', chooseSizeFun);
});