export const categories = {
  Animals: ["Lion","Elephant","Dog","Cat","Shark"],
  Food: ["Pizza","Burger","Pasta","Sushi","Ice Cream"],
  Sports: ["Soccer","Basketball","Tennis","Baseball","Hockey"]
};

const basePool = [
  `Something you'd see in nature`,
  `It can move fast`,
  `Often found with people`,
  `It's common but not too obvious`
];

export function generateClue(word, impostor=false){
  if(impostor){
    return `Kinda like it starts with ${word[0].toUpperCase()}?`; // vague / misleading
  }
  return basePool[Math.floor(Math.random()*basePool.length)];
}
