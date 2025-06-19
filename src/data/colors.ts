export const colorNames = [
    "검정",
    "빨강",
    "주황",
    "노랑",
    "초록",
    "파랑",
    "보라"
] as const;

export const colorHexs = [
    "#000000", // 검정
    "#FF0000", // 빨강
    "#FFA500", // 주황
    "#FFD700", // 노랑
    "#008000", // 초록
    "#0000FF", // 파랑
    "#800080"  // 보라
];

let colorDicts: any[] = [];
let colorMatchs: any[] = [];
for (let i = 0; i < colorNames.length; i++) {
    for (let j = 0; j < colorHexs.length; j++) {
        if (i === j) {
            colorDicts.push([colorNames[i], colorHexs[j]]);
        } else {
            colorMatchs.push([colorNames[i], colorHexs[j]]);
        }
    }
}

export { colorDicts, colorMatchs };
