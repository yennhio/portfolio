function createTile(project) {
  const template = document.getElementById("tile-template");
  const tile = template.content.cloneNode(true);

  const container = tile.querySelector(".tile-container");
  const tileDiv = container.querySelector(".tile");
  const title = container.querySelector(".tile-title");
  const tags = container.querySelector(".tile-tags");

  title.textContent = project.name;
  tags.textContent = project.tags;

  const img = tileDiv.querySelector(".tile-image");
  if (project.previewImage) {
    img.src = project.previewImage;
    img.alt = `Preview image of ${project.name}`;
  } else {
    img.alt = "No preview available";
    img.style.display = "none";
  }

  tileDiv.tabIndex = 0;

  tileDiv.addEventListener("click", () => openPopup(project));
  tileDiv.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      openPopup(project);
    }
  });

  return tile;
}

function openPopup(project) {
  const template = document.getElementById("popup-template");
  const popupClone = template.content.cloneNode(true);

  popupClone.querySelector("#popup-title").textContent = project.name;
  popupClone.querySelector(".popup-description").textContent =
    project.description;

  const previewContainer = popupClone.querySelector(".popup-preview-container");
  previewContainer.innerHTML = "";

  if (project.previewType === "pdf") {
    const embed = document.createElement("embed");
    embed.src = project.preview;
    embed.type = "application/pdf";
    embed.className = "popup-preview";
    previewContainer.appendChild(embed);
  } else if (project.previewType === "image") {
    const img = document.createElement("img");
    img.src = project.preview;
    img.alt = project.name;
    img.className = "popup-preview";
    previewContainer.appendChild(img);
  }

  // Close button
  popupClone
    .querySelector(".popup-close")
    .addEventListener("click", closePopup);

  // Close popup on Escape key
  popupClone
    .querySelector(".popup-overlay")
    .addEventListener("keydown", (e) => {
      if (e.key === "Escape") closePopup();
    });

  // Close popup when clicking outside popup-content
  const popupOverlay = popupClone.querySelector(".popup-overlay");
  popupOverlay.addEventListener("click", (e) => {
    if (e.target === popupOverlay) {
      // Only if clicked on overlay itself, not inside popup-content
      closePopup();
    }
  });

  // Append popup to body
  document.body.appendChild(popupOverlay);
  popupOverlay.focus();

  document.body.style.overflow = "hidden";

  requestAnimationFrame(() => {
    popupOverlay.classList.add("show"); // Trigger the fade-in
  });
}

function closePopup() {
  const popup = document.querySelector(".popup-overlay");
  if (popup) {
    popup.remove();
    document.body.style.overflow = "";

    // Wait 300ms before removing it from the DOM
    setTimeout(() => {
      popup.remove();
    }, 100);
  }
}

function renderRow(rowId, projectsArray) {
  const container = document.getElementById(rowId);
  projectsArray.forEach((project) => {
    const tile = createTile(project);
    container.appendChild(tile);
  });
}

// Render all rows on DOMContentLoaded to be safe
document.addEventListener("DOMContentLoaded", () => {
  renderRow("websites-row", projects.websites);
  renderRow("digital-assets-row", projects.digitalAssets);
  renderRow("personal-projects-row", projects.personalProjects);
});
