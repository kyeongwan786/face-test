// src/utils/runAgeModel.js
import * as tf from "@tensorflow/tfjs";

let cachedModel = null;
const CLASS_LABELS = ["10", "20", "30", "40", "50", "60"];

export async function loadAgeModel(gender = "male") {
    if (cachedModel) return cachedModel;
    const modelUrl = `/models/age/${gender}/model.json`; // models/age/male/model.json
    cachedModel = await tf.loadLayersModel(modelUrl); // ✅ 여기를 loadLayersModel로 수정
    return cachedModel;
}

export async function runAgeEstimation(img, gender = "male") {
    const model = await loadAgeModel(gender);

    const INPUT_SIZE = 224;
    const tensor = tf.tidy(() =>
        tf.browser
            .fromPixels(img)
            .resizeBilinear([INPUT_SIZE, INPUT_SIZE])
            .toFloat()
            .div(255.0)
            .expandDims(0)
    );

    const output = model.predict(tensor);
    const prediction = output.dataSync(); // [확률, 확률, ...]
    const classIndex = prediction.indexOf(Math.max(...prediction));
    const predictedLabel = CLASS_LABELS[classIndex];

    tf.dispose([tensor, output]);
    return parseInt(predictedLabel); // 예측된 나이대 숫자 반환
}
