import { urlArray } from "./addListingImg.mjs";
import { fetchContent } from "../fetch/fetchContent.mjs";
import { getLocalStorage } from "../../components/getLocalstorage.mjs";
import { setEndTime } from "../../time/setEndTime.mjs";
import { convertEndtime } from "../../time/convertEndtime.js";

const { accessToken } = getLocalStorage();

async function addListing(e) {
  e.preventDefault();

  const titleInput = document.querySelector("#listing-title").value;
  const descriptionInput = document.querySelector("#listing-description").value;

  const endsAt = sessionStorage.getItem("endTime");

  const newPostBody = {
    title: titleInput,
    description: descriptionInput,
    media: urlArray,
    endsAt: endsAt,
  };

  const options = {
    method: "POST",
    body: JSON.stringify(newPostBody),
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-type": "application/json; charset=UTF-8",
    },
  };
  try {
    if (!titleInput.length) {
      document.querySelector(".title-error").classList.remove("hidden");
    } else {
      const response = await fetchContent("/listings", options);

      if (response.ok) {
        document.querySelector(".new-listing-form").classList.add("hidden");
        document.querySelector(".new-listing-heading").classList.add("hidden");
        document.querySelector(".post-success").classList.remove("hidden");
        document.querySelector(".post-success").classList.add("flex");
      } else {
        const json = await response.json();
        document.querySelector(".place-bid-error").innerHTML = json.errors[0].message;
      }
    }
  } catch (error) {
    document.querySelector(".new-listing-container").classList.add("hidden");
    document.querySelector(".error-message").classList.remove("hidden");
  }
}

const form = document.querySelector(".new-listing-form");

form.addEventListener("submit", (e) => {
  addListing(e);
});

// Set endtime

let endDate;
const btnParent = document.querySelector(".auction-duration-container");

/**
 * Function to set endtime on new listing.
 * This listens for click on the parent container.
 * If the target has the HTML attribute "data-duration", the
 * function will get the value of the data from HTML and set the duration
 * to the same time the user clicked, only x amount of days forward
 */
function endsAt(e) {
  if (e.target.hasAttribute("data-duration")) {
    const duration = e.target.dataset.duration;
    const durationNum = parseInt(duration);
    endDate = setEndTime(durationNum);
    sessionStorage.setItem("endTime", endDate);
    const { date, time } = convertEndtime(endDate);

    document.querySelector(".view-endtime").innerHTML = `${date}, ${time}`;
  }
}

btnParent.addEventListener("click", (e) => {
  endsAt(e);
});

// Refresh on error

document.querySelector(".refresh-btn").addEventListener("click", () => {
  window.location.reload();
});

// Not logged in

if (!accessToken) {
  const notLoggedIn = document.querySelector(".not-logged-in");
  notLoggedIn.classList.add("flex");
  notLoggedIn.classList.remove("hidden");
  document.querySelector(".new-listing-container ").classList.add("hidden");
}
