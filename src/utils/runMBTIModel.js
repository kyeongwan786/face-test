import * as tmImage from "@teachablemachine/image";

let model = null;

export async function loadMBTIModelByGender(gender = "male") {
    const basePath = `/models/mbti/${gender}`;
    const modelURL = `${basePath}/model.json`;
    const metadataURL = `${basePath}/metadata.json`;
    model = await tmImage.load(modelURL, metadataURL);
}

export async function predictMBTIImage(imageElement) {
    if (!model) throw new Error("MBTI 모델이 로드되지 않았습니다.");
    const predictions = await model.predict(imageElement);
    return predictions;
}
