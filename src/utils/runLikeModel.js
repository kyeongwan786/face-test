import * as tf from "@tensorflow/tfjs";

let cachedModel = null;
let cachedLabels = null;

/** 연예인 닮은꼴 모델 로딩 */
export async function loadLikeModel(gender = "male") {
    if (cachedModel && cachedLabels) return { model: cachedModel, labels: cachedLabels };

    const modelUrl = `/models/like/${gender}/model.json`; // 예: models/like/male/model.json
    const metadataUrl = `/models/like/${gender}/metadata.json`;

    // 모델 & 메타데이터 동시 로딩
    const [model, metadataRes] = await Promise.all([
        tf.loadLayersModel(modelUrl), // ✅ Teachable Machine은 layers 모델
        fetch(metadataUrl),
    ]);

    const metadata = await metadataRes.json();
    const labels = metadata.labels;

    cachedModel = model;
    cachedLabels = labels;

    return { model, labels };
}

/** 연예인 닮은꼴 예측 */
export async function runLikeEstimation(img, gender = "male") {
    const { model, labels } = await loadLikeModel(gender);

    const INPUT_SIZE = 224;
    const tensor = tf.tidy(() =>
        tf.browser
            .fromPixels(img)
            .resizeBilinear([INPUT_SIZE, INPUT_SIZE])
            .toFloat()
            .div(255.0)
            .expandDims(0)
    );

    const prediction = await model.predict(tensor).data(); // 확률 배열
    const maxIndex = prediction.indexOf(Math.max(...prediction));
    const bestLabel = labels[maxIndex];
    const confidence = prediction[maxIndex]; // 확률값 (0~1)

    tf.dispose([tensor]);

    return {
        label: bestLabel,
        confidence: (confidence * 100).toFixed(1), // 예: 87.3
        all: labels.map((name, idx) => ({
            name,
            score: (prediction[idx] * 100).toFixed(1),
        })),
    };
}
