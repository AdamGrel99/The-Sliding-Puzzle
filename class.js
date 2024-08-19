class Board{
  constructor(imgNaturalSizeWidth, imgNaturalSizeHeight, rowCols){
    this.rowCols = rowCols;
    // długości całego obrazka
    this.width = 540;
    this.height = 540;
    // długości puzzla
    this.widthIP = Math.floor(imgNaturalSizeWidth / this.rowCols);
    this.heightIP = Math.floor(imgNaturalSizeHeight / this.rowCols);
    // długość każdego kawałka puzzla
    this.tileWidth = Math.floor(this.width / this.rowCols);
    this.tileHeight = Math.floor(this.height / this.rowCols);
  }
}