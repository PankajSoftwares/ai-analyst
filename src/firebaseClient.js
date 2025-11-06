// Mock Firebase client for demo purposes
async function saveReport(data) {
  console.log('Mock saving report to Firebase:', data);
  // In a real setup, this would save to Firestore
}

module.exports = { saveReport };
