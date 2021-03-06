import Layout from "@/components/Layout";
import ItemButton from "@/components/ItemButton";
import ItemSearch from "@/components/ItemSearch";
import ItemCard from "@/components/ItemCard";
import getUniqueKeys from "@/utils/sortItems";

import { useContext, useState } from "react";
import {
  CurrentShoppingList,
  ListDispatch,
} from "@/context/CurrentShoppingList/context.js";

// Insert button to add the items to the current shopping list context
function AddItemToList({ item }) {
  //Get context from the current shopping list
  const listDispatch = useContext(ListDispatch);

  const addToList = (e, product) => {
    e.preventDefault();

    listDispatch({
      type: "ADD_ITEM",
      item: product,
    });
  };

  return <ItemButton onClick={(e) => addToList(e, item)} />;
}

const IndexPage = ({ data }) => {
  // Initiate word filter state
  const [wordFilter, setWordFilter] = useState("");

  // Initialize the body
  let body = "";

  // Apply the content for the body
  if (data.message) {
    body = <p>{data.message}</p>;
  } else {
    let arrItems = data.filter((item) =>
      item.name.toLowerCase().includes(wordFilter)
    );

    // Get the keys to sort the items by categories
    const [arr, uniqueCategories] = getUniqueKeys(arrItems, "category");

    body = (
      <div className="item-list">
        {uniqueCategories.map((category, key) => (
          <div className="item-row" key={key}>
            <h2>{category}</h2>

            {arr
              .filter((item) => item.category == category)
              .map((item, key2) => (
                <ItemCard
                  key={key2}
                  item={item}
                  rightComponent={<AddItemToList item={item} />}
                />
              ))}
          </div>
        ))}
      </div>
    );
  }

  return (
    <>
      <Layout title="Home" rightPanel={<CurrentShoppingList />}>
        <ItemSearch handleFilterUpdate={(string) => setWordFilter(string)} />

        <h1>
          <span className="text-main-color">Shoppingify</span> allows you to
          take your shopping list wherever you go.
        </h1>

        {body}
      </Layout>
    </>
  );
};

export async function getServerSideProps(context) {
  // Fetch all items data from external API
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API_URL}/api/items`);
  const data = await res.json();

  // Pass data to the page via props
  return { props: { data } };
}

export default IndexPage;
