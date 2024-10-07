const htmlTags = ["a", "abbr", "address", "area", "article", "aside", "audio", "b", "base", "bdi", 
  "bdo", "blockquote", "body", "br", "button", "canvas", "caption", "cite", "code", 
  "col", "colgroup", "data", "datalist", "dd", "del", "details", "dfn", "dialog", 
  "div", "dl", "dt", "em", "embed", "fieldset", "figcaption", "figure", "footer", 
  "form", "h1", "h2", "h3", "h4", "h5", "h6", "head", "header", "hr", "html", "i", 
  "iframe", "img", "input", "ins", "kbd", "label", "legend", "li", "link", "main", 
  "map", "mark", "menu", "meta", "meter", "nav", "noscript", "object", "ol", "optgroup", 
  "option", "output", "p", "picture", "pre", "progress", "q", "rp", "rt", "ruby", "s", 
  "samp", "script", "section", "select", "small", "source", "span", "strong", "style", 
  "sub", "sup", "svg", "table", "tbody", "td", "template", "textarea", "tfoot", "th", 
  "thead", "time", "title", "tr", "track", "u", "ul", "var", "video", "wbr",];
const nonTextTags = ["button", "img", "video", "table", "iframe", "input", "textarea", "select", "picture",];

 let lastClickedElement = null;
const wrapDivArray = [];

document.addEventListener("DOMContentLoaded", function () {
  const tagSelect = document.getElementById("tag");
  const allFields = document.querySelectorAll(".attribute");
  const textColorField = document.getElementById("colorSection");
  const bgColorContainer = document.getElementById("backgroundColorContainer");

  // Hide all fields initially
  hideAllFields();

  // Dynamically add options to the tag select dropdown
  htmlTags.forEach(function (tag) {
    const option = document.createElement("option");
    option.value = tag;
    option.textContent = tag.toUpperCase();
    tagSelect.appendChild(option);
  });

  // Show relevant fields when a tag is selected
  tagSelect.addEventListener("change", function () {
    hideAllFields(); // Hide all fields first
    const selectedTag = tagSelect.value;

    // Show specific fields based on the selected tag
    const fieldsToShow = document.querySelectorAll("." + selectedTag + "-fields");
    fieldsToShow.forEach(function (field) {
      field.style.display = "block";
    });

    // Show text color field for text-based tags (h1, h2, p)
    if (["h1", "h2", "h3", "p", "span", "blockquote"].includes(selectedTag)) {
      textColorField.style.display = "block";
    }

    // Show background color for non-text tags
    bgColorContainer.style.display = nonTextTags.includes(selectedTag) ? "block" : "none";
  });

  // Function to hide all fields
  function hideAllFields() {
    allFields.forEach(function (field) {
      field.style.display = "none";
    });
  }
});

// Function to validate URLs
function isValidUrl(url) {
  try {
    new URL(url);
    return true;
  } catch (_) {
    return false;
  }
}

document.getElementById("tagForm").onsubmit = function (event) {
  event.preventDefault();
  const tag = document.getElementById("tag").value;
  const text = document.getElementById("text").value || "Default Text";
  const color = document.getElementById("color").value;
  const fontFamily = document.getElementById("fontFamily").value;
  const textAlignOrPosition = document.getElementById("textAlignOrPosition").value;
  const bgColor = document.getElementById("bgColor").value;

  // Error handling - Ensure a tag is selected
  if (!tag) {
    alert("Please select a tag.");
    return;
  }

  if (tag === "img" || tag === "iframe" || tag === "video") {
    const src = prompt("Enter the source URL:");
    
    if (!src || !isValidUrl(src)) {
      alert("Please enter a valid URL.");
      return;
    }
  }

  // Numeric validation for width and height
  if (tag === "img" || tag === "video") {
    const width = document.getElementById("width").value;
    const height = document.getElementById("height").value;

    if (isNaN(width) || isNaN(height)) {
      alert("Please enter valid numbers for width and height.");
      return;
    }
  }

  // Handle H1 validation
  if (tag === "h1" && wrapDivArray.some((div) => div.querySelector("h1"))) {
    alert("An H1 element already exists on the page. Only one H1 is allowed.");
    return;
  }

  const wrapDiv = document.createElement("div");
  wrapDiv.style.border = "1px solid transparent";
  wrapDiv.style.padding = "5px";
  wrapDiv.style.marginBottom = "5px";
  wrapDiv.style.position = "relative";
  wrapDiv.style.cursor = "pointer";

  const outputElement = document.createElement(tag);

  // Assign values to the created element based on its tag
  if (["h1", "p", "h2", "span", "blockquote"].includes(tag)) {
    outputElement.textContent = text || "Default Text";
    outputElement.style.color = color;
    outputElement.style.fontFamily = fontFamily;
    outputElement.style.textAlign = textAlignOrPosition;
  }

  if (nonTextTags.includes(tag)) {
    outputElement.style.backgroundColor = bgColor;
  }

  // Append the created element to the wrapDiv and push to array
  wrapDiv.appendChild(outputElement);
  wrapDivArray.push(wrapDiv);

  // Add edit and delete functionality to the element
  addEditAndDeleteButtons(wrapDiv, tag, text, color, fontFamily, textAlignOrPosition, bgColor);

  // Render the current state of the wrapDivArray
  renderWrapDivArray();

  // Reset the form after submission
  document.getElementById("tagForm").reset();
  resetFormState(); // Reset hidden sections and fields
  resetFormSubmissionToDefault(); // Reset submission handler to default after editing
};

// Function to reset the form submission handler to default (for creating new elements)
function resetFormSubmissionToDefault() {
  document.getElementById("tagForm").onsubmit = function (event) {
    event.preventDefault();
    // Revert to creating a new element after editing
    const tag = document.getElementById("tag").value;
    const text = document.getElementById("text").value;
    const color = document.getElementById("color").value;
    const fontFamily = document.getElementById("fontFamily").value;
    const textAlignOrPosition = document.getElementById("textAlignOrPosition").value;
    const bgColor = document.getElementById("bgColor").value;

    const wrapDiv = document.createElement("div");
    wrapDiv.style.border = "1px solid transparent";
    wrapDiv.style.padding = "5px";
    wrapDiv.style.marginBottom = "5px";
    wrapDiv.style.position = "relative";
    wrapDiv.style.cursor = "pointer";

    const outputElement = document.createElement(tag);
    outputElement.textContent = text || "Default Text";
    outputElement.style.color = color;
    outputElement.style.fontFamily = fontFamily;
    outputElement.style.textAlign = textAlignOrPosition;

    wrapDiv.appendChild(outputElement);
    wrapDivArray.push(wrapDiv);

    addEditAndDeleteButtons(wrapDiv, tag, text, color, fontFamily, textAlignOrPosition, bgColor);
    renderWrapDivArray();
   document.getElementById("tagForm").reset();
    resetFormState();
  };
}

function resetFormState() {
  hideAllFields();
  // Hide all input sections (e.g., color, font, text content)
  const sections = [
    document.getElementById("textContentSection"),
    document.getElementById("fontSection"),
    document.getElementById("textAlignSection"),
    document.getElementById("backgroundColorContainer"),
    document.getElementById("colorSection"),
    document.getElementById("additionalFields")
  ];

  sections.forEach(section => {
    if (section) section.style.display = "none";
  });

  // Reset any text or input values
  document.getElementById("text").value = '';
  document.getElementById("color").value = '#000000';
  document.getElementById("bgColor").value = '#ffffff';
  document.getElementById("fontFamily").value = 'Arial, sans-serif';
  document.getElementById("textAlignOrPosition").value = 'left';
    document.getElementById("tagForm").reset();
}

// Function to render the wrapDivArray to the output section
function renderWrapDivArray() {
  const outputDiv = document.getElementById("output");
  outputDiv.innerHTML = "";
  wrapDivArray.forEach(function (wrapDiv) {
    outputDiv.appendChild(wrapDiv);
  });
}

function addEditAndDeleteButtons(wrapDiv, tag, text, color, fontFamily, textAlignOrPosition, bgColor) {
  const editButton = createActionButton("Edit", "10px", "70px", function () {
    document.getElementById("tag").value = tag;
    document.getElementById("text").value = text;
    document.getElementById("color").value = color;
    document.getElementById("fontFamily").value = fontFamily;
    document.getElementById("textAlignOrPosition").value = textAlignOrPosition;
    document.getElementById("bgColor").value = bgColor;

    document.getElementById("tagForm").onsubmit = function (event) {
      event.preventDefault();
      updateElementProperties(wrapDiv, tag);
      renderWrapDivArray();
      document.getElementById("tagForm").reset();
            resetFormState();
      resetFormSubmissionToDefault(); // Reset the form to create new elements after editing
    };
  });

  const deleteButton = createActionButton("Delete", "10px", "10px", function () {
    wrapDiv.remove();
    const index = wrapDivArray.indexOf(wrapDiv);
    if (index !== -1) {
      wrapDivArray.splice(index, 1); 
      renderWrapDivArray();
    }
  });

  wrapDiv.appendChild(editButton);
  wrapDiv.appendChild(deleteButton);

  wrapDiv.addEventListener("click", handleWrapDivClick(wrapDiv, editButton, deleteButton));
}

function handleWrapDivClick(wrapDiv, editButton, deleteButton) {
  return function (event) {
    event.stopPropagation();

    if (lastClickedElement && lastClickedElement !== wrapDiv) {
  if (lastClickedElement.style) {
    lastClickedElement.style.border = "1px solid transparent";
  }
  const editButton = lastClickedElement.querySelector("button:nth-child(1)");
  const deleteButton = lastClickedElement.querySelector("button:nth-child(2)");
  
  if (editButton && deleteButton) {
    editButton.style.display = "none";
    deleteButton.style.display = "none";
  }
}
    const isVisible = editButton.style.display === "block";
    wrapDiv.style.border = isVisible ? "1px solid transparent" : "1px solid #000";
    editButton.style.display = isVisible ? "none" : "block";
    deleteButton.style.display = isVisible ? "none" : "block";

    lastClickedElement = wrapDiv;
  };
}

function createActionButton(text, topPosition, rightPosition, onClickHandler) {
  const button = document.createElement("button");
  button.textContent = text;
  button.style.position = "absolute";
  button.style.top = topPosition;
  button.style.right = rightPosition;
  button.style.display = "none";
  button.onclick = onClickHandler;
  return button;
}

function updateElementProperties(wrapDiv, originalTag) {
  const updatedTag = document.getElementById("tag").value;
  const updatedText = document.getElementById("text").value || "Default Text";
  const updatedColor = document.getElementById("color").value;
  const updatedFontFamily = document.getElementById("fontFamily").value;
  const updatedTextAlignOrPosition = document.getElementById("textAlignOrPosition").value;
  const updatedBgColor = document.getElementById("bgColor").value;

  const oldElement = wrapDiv.querySelector(originalTag); 
  const newElement = document.createElement(updatedTag); 

  if (["h1", "h2", "p", "span", "blockquote"].includes(updatedTag)) {
    newElement.textContent = updatedText;
    newElement.style.color = updatedColor;
    newElement.style.fontFamily = updatedFontFamily;
    newElement.style.textAlign = updatedTextAlignOrPosition;
  }

  if (nonTextTags.includes(updatedTag)) {
    newElement.style.backgroundColor = updatedBgColor;
  }

  wrapDiv.replaceChild(newElement, oldElement);
}

document.addEventListener("mouseover", function (event) {
    const wrapDiv = event.target.closest("div");
    if (wrapDiv) {
      const buttons = wrapDiv.querySelectorAll("button");
      buttons.forEach(function (button) {
        button.style.display = "block";
      });
    }
  });

  document.addEventListener("DOMContentLoaded", function () {
  const tagSelect = document.getElementById("tag");
  const textContentSection = document.getElementById("textContentSection");
  const fontSection = document.getElementById("fontSection");
  const textAlignSection = document.getElementById("textAlignSection");
  const backgroundColorContainer = document.getElementById("backgroundColorContainer");
  const colorSection = document.getElementById("colorSection");
  const additionalFields = document.getElementById("additionalFields");

  const sections = {
    h1: [
      textContentSection,
      fontSection,
      textAlignSection,
      backgroundColorContainer,
      colorSection,
    ],
    h2: [
      textContentSection,
      fontSection,
      textAlignSection,
      backgroundColorContainer,
      colorSection,
    ],
    h3: [
      textContentSection,
      fontSection,
      textAlignSection,
      backgroundColorContainer,
      colorSection,
    ],
    p: [
      textContentSection,
      fontSection,
      textAlignSection,
      backgroundColorContainer,
      colorSection,
    ],
    span: [
      textContentSection,
      fontSection,
      textAlignSection,
      backgroundColorContainer,
      colorSection,
    ],
    section: [
      textContentSection,
      fontSection,
      textAlignSection,
      backgroundColorContainer,
      colorSection,
    ],
    blockquote: [
      textContentSection,
      fontSection,
      textAlignSection,
      backgroundColorContainer,
      colorSection,
    ],
    input: [
      additionalFields.querySelector("#valueContainer"),
      textContentSection,
      backgroundColorContainer,
    ],
    img: [
      additionalFields.querySelector("#srcContainer"),
      additionalFields.querySelector("#altContainer"),
      additionalFields.querySelector("#widthContainer"),
      additionalFields.querySelector("#heightContainer"),
    ],
    a: [additionalFields.querySelector("#hrefContainer")],
    form: [
      additionalFields.querySelector("#idContainer"),
      additionalFields.querySelector("#classContainer"),
    ],
    ul: [textContentSection],
    ol: [textContentSection],
    li: [textContentSection],
    audio: [additionalFields.querySelector("#srcContainer")],
    video: [additionalFields.querySelector("#srcContainer")],
    table: [
      additionalFields.querySelector("#rowsContainer"),
      additionalFields.querySelector("#colsContainer"),
    ],
    iframe: [additionalFields.querySelector("#srcContainer")],
    button: [
      textContentSection,
      additionalFields.querySelector("#valueContainer"),
    ]
  };

  function showRelevantAttributes() {
    const selectedTag = tagSelect.value;

    // Hide all sections first
    [
      textContentSection,
      fontSection,
      textAlignSection,
      backgroundColorContainer,
      colorSection,
      ...Array.from(additionalFields.children), 
    ].forEach((section) => {
      section.style.display = "none";
    });

    // Show relevant sections based on the selected tag
    if (sections[selectedTag]) {
      sections[selectedTag].forEach((section) => {
        section.style.display = "block";
      });
    }
  }
  showRelevantAttributes();

  tagSelect.addEventListener("change", showRelevantAttributes);

  // This should be outside of the `DOMContentLoaded` listener
  document.addEventListener("mouseout", function (event) {
    const wrapDiv = event.target.closest("div");
    if (wrapDiv) {
      const buttons = wrapDiv.querySelectorAll("button");
      buttons.forEach(function (button) {
        button.style.display = "none";
      });
    }
  });
  });