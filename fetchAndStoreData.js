import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });
import axios from "axios";
import dbConnect from "./src/db/dbConnect.js";
import Beer from "./src/db/models/Beer.js";

const API_URL = process.env.API_URL;
const API_KEY = process.env.API_KEY;

async function fetchBeers(cursor) {
  const credentials = Buffer.from(`${API_KEY}:`).toString("base64");
  const url = cursor ? `${API_URL}/beer?cursor=${cursor}` : `${API_URL}/beer`;
  try {
    console.log("URL in request: ", url);
    const response = await axios.get(url, {
      headers: {
        Authorization: `Basic ${credentials}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching beers:", error);
    throw error;
  }
}

async function storeBeers(beers) {
  await dbConnect();

  try {
    await Beer.insertMany(
      beers.data.map((beer) => ({
        externalId: beer.id,
        name: beer.name,
      }))
    );
    console.log(`${beers.length} beers were inserted.`);
  } catch (error) {
    console.error("Error storing beers:", error);
    throw error;
  }
}

async function main() {
  let cursor = null;
  let hasMore = true;

  while (hasMore) {
    try {
      const data = await fetchBeers(cursor);
      console.log("Beers data: ", data);
      const beers = data;
      await storeBeers(beers);
      hasMore = beers.has_more;
      cursor = beers.next_cursor;
      console.log("New cursor: ", cursor);
    } catch (error) {
      console.error("Error in main execution:", error);
      hasMore = false;
    }
  }
}

main();
