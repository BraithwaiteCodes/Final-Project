/////////////////////////////////////////////////////
// LISTENERS for Profile
const profileModal = document.getElementById("profileModal");
const editInfoBtn = document.getElementById("editInfoBtn");
const profileOverlay = document.querySelector(".overlay-profile");

const openProfileModal = function () {
  profileModal.classList.remove("hidden-modal");
  profileOverlay.classList.remove("hidden-modal");
};

const closeProfileModal = function () {
  profileModal.classList.add("hidden-modal");
  profileOverlay.classList.add("hidden-modal");
};

editInfoBtn.addEventListener("click", function () {
  openProfileModal();
});

profileOverlay.addEventListener("click", function () {
  closeProfileModal();
});
