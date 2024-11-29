const tf = require('@tensorflow/tfjs-node');


async function loadmodel(){
    console.log('MODEL_URL:', process.env.MODEL_URL);
    return tf.loadGraphModel(process.env.MODEL_URL);
    
}

module.exports = loadmodel;