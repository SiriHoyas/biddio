import { getLocalStorage } from "../../components/getLocalstorage.mjs";
import { fetchContent } from "../fetch/fetchContent.mjs";

document.querySelector(".edit-avatar-btn").addEventListener("click", () => {
  const editContainer = document.querySelector(".edit-avatar");
  editContainer.classList.toggle("hidden");
  editContainer.classList.toggle("flex");
});

const editForm = document.querySelector(".edit-avatar-form");

editForm.addEventListener("submit", editProfileAvatar);

async function editProfileAvatar(e) {
  e.preventDefault();

  const urlInput = document.querySelector("#avatar-url").value;

  const { accessToken, userName } = getLocalStorage();

  const body = {
    avatar: `${urlInput}`,
  };

  const options = {
    method: "PUT",
    body: JSON.stringify(body),
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
  };

  const errorMessageContainer = document.querySelector(".edit-avatar-error");

  if (urlInput.length > 0) {
    try {
      const response = await fetchContent(`/profiles/${userName}/media`, options);
      const json = await response.json();

      if (response.ok) {
        localStorage.setItem("userAvatar", json.avatar);
        window.location.reload();
      } else {
        const errorMessage = json.errors[0].message;
        errorMessageContainer.innerHTML = errorMessage;
        errorMessageContainer.classList.remove("hidden");
      }
    } catch (error) {
      errorMessageContainer.innerHTML = "Something went wrong. Please try again later";
      errorMessageContainer.classList.remove("hidden");
    }
  } else {
    errorMessageContainer.innerHTML = "Avatar must be valid URL";
    errorMessageContainer.classList.remove("hidden");
  }
}
