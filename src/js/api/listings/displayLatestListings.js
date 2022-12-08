import { getListings } from "../fetch/fetchListings.mjs";
import { listingsHTML } from "../../components/templates/listingsTemplate.js";
import { getLastItem } from "../../components/getLatestBid.mjs";
import { convertEndtime } from "../../time/convertEndtime.mjs";

async function getLastestListings() {
  const listings = await getListings();
  const container = document.querySelector(".latest-listings-container");

  for (let i = 0; i < 3; i++) {
    const bid = await getLastItem(listings[i].bids, "No Bids");
    console.log(listings[i].id);
    const { date, time } = convertEndtime(listings[i].endsAt);
    container.innerHTML += listingsHTML(
      listings[i].media,
      listings[i].title,
      listings[i].seller.name,
      date,
      time,
      bid.amount ? bid.amount : bid,
      listings[i].id
    );
  }
}

getLastestListings();
