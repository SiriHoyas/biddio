import { getListings } from "../fetch/fetchListings.mjs";
import { listingsHTML } from "../../components/templates/listingsTemplate.js";
import { getLastItem } from "../../components/getLatestBid.mjs";

async function getLastestListings() {
  const listings = await getListings();
  const container = document.querySelector(".latest-listings-container");

  for (let i = 0; i < 3; i++) {
    const bid = await getLastItem(listings[i].bids, "No Bids");
    console.log(listings[i].id);

    if (bid.amount) {
      container.innerHTML += listingsHTML(
        listings[i].media,
        listings[i].title,
        listings[i].seller.name,
        listings[i].endsAt,
        bid.amount,
        listings[i].id
      );
    } else {
      container.innerHTML += listingsHTML(
        listings[i].media,
        listings[i].title,
        listings[i].seller.name,
        listings[i].endsAt,
        bid,
        listings[i].id
      );
    }
  }
}

getLastestListings();
