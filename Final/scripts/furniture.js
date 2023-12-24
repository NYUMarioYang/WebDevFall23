class Furniture {
  occupiedBy = "none";

  constructor(data) {
    this.name = data.name;
    this.enabled = data.enabled;
    this.xPos = data.xPos;
    this.yPos = data.yPos;
    this.id = data.id;
  }

  Spawn(){
    this.image = loadImage(`images/${this.name}.png`);
  }

    Display() {
        if(this.enabled == true){
            image(this.image, this.xPos, this.yPos);
        }
    }
}
