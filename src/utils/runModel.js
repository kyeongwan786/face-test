import * as tmImage from "@teachablemachine/image";

let model = null;

export async function loadModelByGender(gender = "male") {
    console.log("👀 [loadModelByGender] gender =", gender);

    const modelURL = `/models/ugly/${gender}/model.json`;
    const metadataURL = `/models/ugly/${gender}/metadata.json`;

    try {
        model = await tmImage.load(modelURL, metadataURL);
        console.log("✅ Model loaded successfully.");
    } catch (err) {
        console.error("❌ Failed to load model:", err);
        throw err;
    }
}

export async function predictImage(imageElement) {
    if (!model) throw new Error("Model not loaded. Call loadModelByGender() first.");
    const prediction = await model.predict(imageElement);
    return prediction;
}
