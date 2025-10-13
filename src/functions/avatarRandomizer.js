let maleAvatar1 = '../images/default-male1.png';
let maleAvatar2 = '../images/default-male2.png';
let maleAvatar3 = '../images/default-male3.png';
let femaleAvatar1 = '../images/default-female1.png';
let femaleAvatar2 = '../images/default-female2.png';
let femaleAvatar3 = '../images/default-female3.png';

export default function avatarandomizer(sex) {
  const randomNum = Math.random();
  
  if (sex === 'M') {
    if (randomNum < 0.33) {
      return maleAvatar1;
    } else if (randomNum < 0.66) {
      return maleAvatar2;
    } else {
      return maleAvatar3;
    }
  } else if (sex === 'F') {
    if (randomNum < 0.33) {
      return femaleAvatar1;
    } else if (randomNum < 0.66) {
      return femaleAvatar2;
    } else {
      return femaleAvatar3;
    }
  }
  
  return '../images/default-avatar.png'; 
}