const { Firestore } = require('@google-cloud/firestore');

async function storeData(id, data) {
    try {
        const db = new Firestore();
        const predictCollection = db.collection('predictions');
        await predictCollection.doc(id).set(data);
        console.log('Data berhasil disimpan ke Firestore.');
    } catch (error) {
        console.error('Gagal menyimpan data ke Firestore:', error.message);
        throw error;
    }
}

   
  module.exports = storeData;