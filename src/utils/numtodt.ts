export default function changeNum(num: number): string {
    // num은 0.01초 단위라고 가정 (예: 12345 → 123.45초)
    const totalSeconds = num / 100;
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;

    const formattedMinutes = String(minutes).padStart(2, '0');
    // 소수점 둘째 자리까지, 항상 05.23 이런 식으로
    const formattedSeconds = seconds.toFixed(2).padStart(5, '0');

    return `${formattedMinutes}:${formattedSeconds}`;
}