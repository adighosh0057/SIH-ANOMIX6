// Function to ask user if they want replies in Hindi
function askHindiPreference() {
  return "Would you like to receive replies in Hindi? (yes/no)";
}

// Prompt the user for Hindi preference at the start
const readline = require('readline');
const fs = require('fs');
const diseaseDB = JSON.parse(fs.readFileSync('package.json', 'utf8'));

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

let useHindi = false;

function promptSymptoms() {
  rl.question(useHindi ? 'कृपया अपने लक्षण दर्ज करें:\n' : 'Please enter your symptoms:\n', (symptomInput) => {
    const result = guessDiseaseFromSymptoms(symptomInput, diseaseDB, useHindi);
    console.log(result);
    rl.close();
  });
}

console.log('Welcome! I can help you identify common diseases based on your symptoms.');
rl.question(askHindiPreference() + '\n', (answer) => {
  if (answer.trim().toLowerCase() === 'yes') {
    useHindi = true;
    console.log('आपको उत्तर हिंदी में मिलेंगे।');
  } else {
    console.log('You will receive replies in English.');
  }
  promptSymptoms();
});

// Example function: guess disease based on symptom count matching
function guessDiseaseFromSymptoms(inputText, diseaseDB, useHindi = false) {
  const text = inputText.toLowerCase();
  let matchedDisease = null;
  let maxMatches = 0;
  for (const [disease, info] of Object.entries(diseaseDB)) {
    const matches = info.symptoms.reduce((count, symptom) => count + (text.includes(symptom) ? 1 : 0), 0);
    if (matches > maxMatches && matches >= 2) {
      matchedDisease = disease;
      maxMatches = matches;
    }
  }
  if (!matchedDisease) return useHindi ? "कोई बीमारी नहीं मिली।" : "No disease matched.";
  const diseaseInfo = diseaseDB[matchedDisease];
  if (useHindi && diseaseInfo.hi) {
    return `बीमारी: ${matchedDisease}\nविवरण: ${diseaseInfo.hi.overview}\nलक्षण: ${diseaseInfo.hi.symptoms.join(", ")}\nरोकथाम: ${diseaseInfo.hi.prevention.join(", ")}\nइलाज: ${diseaseInfo.hi.treatment.join(", ")}\nडॉक्टर से कब मिलें: ${diseaseInfo.hi.seekCare.join(", ")}`;
  } else {
    return `Disease: ${matchedDisease}\nOverview: ${diseaseInfo.overview}\nSymptoms: ${diseaseInfo.symptoms.join(", ")}\nPrevention: ${diseaseInfo.prevention.join(", ")}\nTreatment: ${diseaseInfo.treatment.join(", ")}\nWhen to seek care: ${diseaseInfo.seekCare.join(", ")}`;
  }
}
