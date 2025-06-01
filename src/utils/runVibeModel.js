import * as tf from "@tensorflow/tfjs";


// 타입 라벨 (모델 훈련시 순서 기준으로)
const CLASS_LABELS = [
    "smart",
    "cold",
    "warm",
    "funny",
    "confident",
    "soft",
    "sharp",
    "stylish",
    "hardy"
];

let cachedModel = null;

/**
 * 모델 로딩
 * @param {"male" | "female"} gender
 * @returns {Promise<tf.LayersModel>}
 */
export async function loadVibeModel(gender = "male") {
    if (cachedModel) return cachedModel;

    const modelUrl = `/models/vibe/${gender}/model.json`;
    cachedModel = await tf.loadLayersModel(modelUrl);
    return cachedModel;
}

/**
 * 얼굴 인상 타입 예측
 * @param {HTMLImageElement | HTMLCanvasElement} img
 * @param {"male" | "female"} gender
 * @returns {Promise<string>} 예측된 타입 이름
 */
export async function runVibeEstimation(img, gender = "male") {
    const model = await loadVibeModel(gender);
    const INPUT_SIZE = 224;

    const tensor = tf.tidy(() =>
        tf.browser
            .fromPixels(img)
            .resizeBilinear([INPUT_SIZE, INPUT_SIZE])
            .toFloat()
            .div(255.0)
            .expandDims(0)
    );

    const prediction = model.predict(tensor);
    const data = prediction.dataSync(); // 확률 배열
    const index = data.indexOf(Math.max(...data)); // 최고 확률 인덱스

    tf.dispose([tensor, prediction]);
    return CLASS_LABELS[index];
}
