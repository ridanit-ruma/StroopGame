import { colorDicts, colorMatchs } from '../data/colors';
import { shuffle } from './shuffle';

export function generateRoundData() {
    const randomNumbers = shuffle(Array.from({ length: 16 }, (_, i) => i));
    const correctIndex = randomNumbers[0];
    const colorRandom = shuffle(colorMatchs);
    let result: any[] = [];

    for (let i = 0; i < 16; i++) {
        if (i === correctIndex) {
            result[i] = shuffle(colorDicts)[0];
        } else {
            result[i] = colorRandom[i];
        }
    }
    console.log(result)
    return {
        grid: result,
        correctIndex: correctIndex
    };
}
