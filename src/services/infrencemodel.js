const tf = require("@tensorflow/tfjs-node");
const InputError = require("../exception/InputError");

async function predictClassification(model, image) {
  try {
    const tensor = tf.node
      .decodeJpeg(image)
      .resizeNearestNeighbor([224, 224])
      .expandDims()
      .toFloat();
    const prediction = await model.predict(tensor);

    // Cek output dari model (satu nilai saja)
    const predictionData = await prediction.data();
    console.log("Prediction Data:", predictionData);

    // Tentukan threshold (misalnya, 0.5)
    const threshold = 0.5; // Sesuaikan jika perlu
    const label = predictionData[0] > threshold ? "Cancer" : "Non-cancer";

    let suggestion;
    if (label === "Cancer") {
      suggestion = "Segera periksa ke dokter!";
    } else {
      suggestion = "Penyakit kanker tidak terdeteksi.";
    }

    return { label, suggestion };
  } catch (error) {
    throw new InputError(`Terjadi kesalahan input: ${error.message}`);
  }
}

module.exports = predictClassification;
