const catData = [
  { name: "CatBW", id: 1 },
  { name: "CatBrown", id: 2 },
  { name: "CatDeer", id: 3 },
  { name: "CatOrange", id: 4 },
];

const validSpawnArea = {
  x: { min: 300, max: 900 },
  y: { min: 70, max: 650 },
};

let cats = [];
let furnitures = [];

let backgroundImage;
let house;

async function fetchFurnitureData() {
  try {
    const response = await fetch("http://localhost:3004/furnitures");
    const furnitureData = await response.json();
    return furnitureData;
  } catch (error) {
    console.error("Error fetching furniture data:", error);
  }
}

function preload() {
  backgroundImage = loadImage("images/Grass.png");
  house = loadImage("images/House.png");
}

function setup() {
  let cnv = createCanvas(960, 720);
  cnv.parent("canvasContainer");
  imageMode(CENTER);

  SpawnAllCats();
  SpawnAllFurniture();
}

function draw() {
  image(backgroundImage, width / 2, height / 2);

  if (furnitures.length > 0) {
    furnitures.forEach((furniture) => {
      furniture.Display();
    });
  }
  if (cats.length > 0) {
    cats.forEach((cat) => {
      cat.moveToTarget();
      cat.Display();
    });
  }

  // update targets every 4 seconds
  if (frameCount % (60 * 4) == 0) {
    console.log("Updating targets");
    for (let cat of cats) {
      cat.updateTarget(furnitures, validSpawnArea);
    }
  }

  // // box showing valid spawn area
  // stroke("red");
  // noFill();
  // rect(
  //   validSpawnArea.x.min,
  //   validSpawnArea.y.min,
  //   validSpawnArea.x.max - validSpawnArea.x.min,
  //   validSpawnArea.y.max - validSpawnArea.y.min
  // );

  if (keyIsDown(32)) {
    cats.forEach((cat) => {
      text(`Cat ${cat.id}: ${cat.name}`, 300, 400+50 * (cat.id + 1));
    });

    furnitures.forEach((item, i) => {
      text(
        `Furniture name: ${item.name}, xPos: ${item.xPos}, yPos: ${item.yPos}, enabled: ${item.enabled}`,
        300,
        50 * (i + 1)
      );
    });
  }

  image(house, width / 2, height / 2);
}

function SpawnAllCats() {
  cats = catData.map((data) => new Cat(data));

  cats.forEach((cat) => {
    cat.Spawn();
  });
}

async function SpawnAllFurniture() {
  const fetchedFurnitureData = await fetchFurnitureData();
  if (fetchedFurnitureData && fetchedFurnitureData.length > 0) {
    furnitures = fetchedFurnitureData.map((data) => new Furniture(data));
  }

  furnitures.forEach((furniture) => {
    furniture.Spawn();
  });

  for (let cat of cats) {
    cat.updateTarget(furnitures, validSpawnArea);
  }
}