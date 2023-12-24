class Cat {
  myFurniture;
  foundFurniture = false;
  targetX = 0;
  targetY = 0;
  rotation = 0;
  rotationSpeed = 0.003;
  rotationDirection = 1;
  maxRotation = Math.PI / 32;
  moveRotationMultiplier = 4;
  moveSpeed = 3;

  needToFlip = false;

  constructor(data) {
    this.id = data.id;
    this.name = data.name;
    this.size = 200;
  }

  Spawn() {
    this.xPos = random(0, 100);
    this.yPos = random(validSpawnArea.y.min, validSpawnArea.y.max);
    this.image = loadImage(`images/${this.name}.png`);
    this.flippedImage = loadImage(`images/${this.name}Flipped.png`);
  }

  Display() {
    push();
    translate(this.xPos, this.yPos);
    rotate(this.rotation);
    imageMode(CENTER);

    if (this.needToFlip) {  
      image(this.flippedImage, 0, 0);
    }
    else{
      image(this.image, 0, 0);
    }

    pop();
  }

  moveToTarget() {
    if (this.targetX === 0 && this.targetY === 0) return;

    // use pythagorean to calculate the vector
    let stepSize = this.moveSpeed;
    let dx = this.targetX - this.xPos;
    let dy = this.targetY - this.yPos;
    let distance = Math.sqrt(dx * dx + dy * dy);

    if (distance < stepSize) {
      this.xPos = this.targetX;
      this.yPos = this.targetY;
    } else {
      let vx = (dx / distance) * stepSize;
      let vy = (dy / distance) * stepSize;

      this.xPos += vx;
      this.yPos += vy;
    }

    if (dx != 0 || dy != 0) {
      this.updateRotation(this.rotationSpeed * this.moveRotationMultiplier);
    } else {
      this.updateRotation(this.rotationSpeed);
    }
  }

  updateRotation(speed) {
    this.rotation += this.rotationDirection * speed;
    if (Math.abs(this.rotation) > this.maxRotation) {
      // If the rotation exceeds the limit, reverse the direction
      this.rotationDirection *= -1;
    }
  }

  updateTarget(furnitureArray, validSpawnArea) {
    setTimeout(() => {
      let attempts = 0;
      const maxAttempts = 10;

      while (attempts < maxAttempts && !this.foundFurniture) {
        const randomFurniture =
          furnitureArray[Math.floor(Math.random() * furnitureArray.length)];
        if (randomFurniture.occupiedBy == "none" && randomFurniture.enabled) {
          this.myFurniture = randomFurniture;
          randomFurniture.occupiedBy = this.name;
          this.foundFurniture = true;
          this.targetX = randomFurniture.xPos;
          this.targetY = randomFurniture.yPos;
          console.log(`Cat ${this.id} is going to ${randomFurniture.name}`);
        }
        attempts++;
      }

      if (!this.foundFurniture) {
        this.targetX = random(validSpawnArea.x.min, validSpawnArea.x.max);
        this.targetY = random(validSpawnArea.y.min, validSpawnArea.y.max);
        console.log(
          `Cat ${this.id} is wandering to ${this.targetX}, ${this.targetY}`
        );
      }

      if (this.xPos > this.targetX) {
        this.needToFlip = true;
      } else {
        this.needToFlip = false;
      }
    }, random(500, 2000));
  }

  distanceTo(x, y) {
    let dx = this.x - x;
    let dy = this.y - y;
    return Math.sqrt(dx * dx + dy * dy);
  }

  // initially used to have wandering cats not overlap, but kinda unnecessary cuz them overlapping is cute
  overlaps(otherCat) {
    if (this === otherCat) return false;
    if (otherCat.xPos === undefined || otherCat.yPos === undefined)
      return false;
    let distance = dist(this.xPos, this.yPos, otherCat.xPos, otherCat.yPos);
    return distance < this.size;
  }
}
