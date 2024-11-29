const InputError = require("../exception/InputError");
const predictClassification = require("../services/infrencemodel");
const crypto = require("crypto");
const storeData = require('../services/storeData');

async function afterPredcitHandler(request, h) {
  const { image } = request.payload;
  // console.log('Request Payload:', request.payload);
  const { model } = request.server.app;
  if (!image || !Buffer.isBuffer(image)) {
    return h
      .response({
        status: "fail",
        message: "Gambar tidak valid atau data gambar tidak ditemukan",
      })
      .code(400); // 400 for bad request
  }

  const MAX_SIZE = 1000000; // Batas maksimal 1MB

  // Memeriksa ukuran file
  if (image.length > MAX_SIZE) {
    return h
      .response({
        status: "fail",
        message: `Payload content length greater than maximum allowed: ${MAX_SIZE}`,
      })
      .code(413); // 413 for Payload Too Large
  }
  try {
    const { label, suggestion } = await predictClassification(model, image);
    const id = crypto.randomUUID();
    const createdAt = new Date().toISOString();

    const data = {
      "id": id,
      "result": label,
      "suggestion": suggestion,
      "createdAt": createdAt,
    };

    await storeData(id, data);

    const response = h.response({
      status: "success",
      message: "Model is predicted successfully",
      data,
    });
    response.code(201);
    return response;
  } catch (error) {
    const response = h.response({
      status: "fail",
      message: "Terjadi kesalahan dalam melakukan prediksi",
    });
    response.code(400);
    return response;
  }
}
module.exports = afterPredcitHandler;