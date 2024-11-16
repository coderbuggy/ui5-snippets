function getInputValues() {
  const textArea = document.getElementById("deep-input");
  const inputText = textArea.value;

  // Split the text by newlines and filter out empty lines
  const values = inputText
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.length > 0);

  return values;
}

function generateOEntry(values) {
  let oEntryString = "var oEntry = {\n";

  values.forEach((value) => {
    oEntryString += `  "${value}": "",\n`;
  });

  oEntryString += "};\n\n";
  oEntryString += "sap.ui.core.BusyIndicator.show(0);\n\n";
  oEntryString += 'that.oDataModel.create("/", oEntry, {\n';
  oEntryString += "  success: function(oData) {\n";
  oEntryString += "    sap.ui.core.BusyIndicator.hide();\n";
  oEntryString += "    debugger;\n";
  oEntryString += "  },\n";
  oEntryString += "  error: function(oError) {\n";
  oEntryString += "    sap.ui.core.BusyIndicator.hide();\n";
  oEntryString += "    debugger;\n";
  oEntryString += "  }\n";
  oEntryString += "});";

  return oEntryString;
}

// Add event listener to add button to process input
document.querySelector(".add-button").addEventListener("click", function () {
  const values = getInputValues();
  const oEntryCode = generateOEntry(values);

  // Display the generated code in the textarea
  const generatedDeepCode = document.getElementById("generated-deep-code");
  generatedDeepCode.value = oEntryCode;
});

// Get all section elements
const deepEntitySection = document.getElementById("deep-entity-section");
const querySetSection = document.getElementById("query-set-section");
const i18nSection = document.getElementById("i18n-section");

// Get all button elements
const deepEntityButton = document.getElementById("deep-entity-button");
const querySetButton = document.getElementById("query-set-button");
const i18nButton = document.getElementById("i18n-converter-button");

// Function to hide all sections
function hideAllSections() {
  deepEntitySection.style.display = "none";
  querySetSection.style.display = "none";
  i18nSection.style.display = "none";
}

// Add click event listeners to buttons
deepEntityButton.addEventListener("click", () => {
  hideAllSections();
  deepEntitySection.style.display = "inline-block";
});

querySetButton.addEventListener("click", () => {
  hideAllSections();
  querySetSection.style.display = "inline-block";
});

i18nButton.addEventListener("click", () => {
  hideAllSections();
  i18nSection.style.display = "inline-block";
});

// Show deep entity section by default
hideAllSections();
deepEntitySection.style.display = "block";

// i18n converter functions
function textToUnicode(text) {
  return text
    .split("")
    .map((char) => {
      const code = char.charCodeAt(0);
      return code > 127 ? "\\u" + ("0000" + code.toString(16)).slice(-4) : char;
    })
    .join("");
}

function unicodeToText(unicode) {
  return unicode.replace(/\\u[\dA-F]{4}/gi, (match) => {
    return String.fromCharCode(parseInt(match.replace(/\\u/g, ""), 16));
  });
}

// Event listeners
document.getElementById("convert-button").addEventListener("click", () => {
  const input = document.getElementById("i18n-input").value;
  const isToUnicode = document.getElementById("to-unicode").checked;
  const output = isToUnicode ? textToUnicode(input) : unicodeToText(input);
  document.getElementById("i18n-code").textContent = output;
});

function copyToClipboard() {
  let textToCopy;

  if (deepEntitySection.style.display === "block") {
    textToCopy = document.getElementById("generated-deep-code").value;
  } else if (querySetSection.style.display === "block") {
    textToCopy = document.getElementById("query-code").textContent;
  } else if (i18nSection.style.display === "block") {
    textToCopy = document.getElementById("i18n-code").textContent;
  }

  if (textToCopy) {
    navigator.clipboard
      .writeText(textToCopy)
      .then(() => {
        alert("Copied to clipboard");
      })
      .catch((err) => {
        console.error("Failed to copy text: ", err);
        alert("Failed to copy to clipboard");
      });
  }
}
