import { CharacterId, MARVEL_CHARACTERS, MarvelCharacter } from '@/types/marvel';

const CHARACTERS = Object.values(MARVEL_CHARACTERS);

/**
 * Returns a character using the strict weighted probability distribution:
 * Hulk: 16%, Cap: 16%, Hawkeye: 16%, Black Widow: 16%, Spider-Man: 16%, Black Panther: 16%, Iron Man: 4%
 */
export function selectWeightedCharacter(): MarvelCharacter {
  const randomValue = Math.random() * 100; // 0 to 100
  let cumulativeWeight = 0;

  for (const char of CHARACTERS) {
    cumulativeWeight += char.weight;
    if (randomValue <= cumulativeWeight) {
      return char;
    }
  }

  // Fallback to Spider-Man if rounding edge-case occurs
  return MARVEL_CHARACTERS.spiderman;
}

/**
 * Calculates the exact rotation angle (in degrees) to position the target segment under the top pointer (12 o'clock).
 * @param targetIndex - The index of the character (0 to 6) in the wheel list
 * @param currentRotation - The current wheel rotation angle in degrees
 * @param totalSegments - Total segments on wheel (7)
 * @returns Target total rotation in degrees
 */
export function calculateWheelTargetAngle(
  targetIndex: number,
  currentRotation: number,
  totalSegments: number = 7
): number {
  const segmentAngle = 360 / totalSegments;
  
  // Angle of segment center relative to 12 o'clock top pointer when wheel rotation is 0
  const segmentCenter = targetIndex * segmentAngle;
  
  // To bring segmentCenter to the top pointer (0° / 360°), the wheel must rotate clockwise by:
  // (360 - segmentCenter) degrees.
  const targetOffset = (360 - segmentCenter) % 360;

  // We want 6 to 9 full spins (2160° to 3240°) for excitement lasting ~5 seconds
  const minFullSpins = 6;
  const extraSpinsDegrees = minFullSpins * 360;

  // Add small natural random jitter inside the segment slice (+/- 35% of segment angle)
  const jitter = (Math.random() - 0.5) * (segmentAngle * 0.7);

  // Normalize current rotation so we always spin forward smoothly
  const currentNormalized = currentRotation % 360;
  const targetNormalized = (targetOffset + jitter + 360) % 360;

  let angleDifference = targetNormalized - currentNormalized;
  if (angleDifference <= 0) {
    angleDifference += 360;
  }

  return currentRotation + extraSpinsDegrees + angleDifference;
}
