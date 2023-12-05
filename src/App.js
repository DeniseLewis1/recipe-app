import React, { useState, useEffect } from "react";
import Header from "./components/Header";
import RecipeExcerpt from "./components/RecipeExcerpt";
import "./App.css";

function App() {
  const [recipes, setRecipes] = useState([]);

  // Fetch all recipes
  const fetchAllRecipes = async () => {
    try {
      const response = await fetch("/api/recipes");
      if (response.ok) {
        const data = await response.json();
        setRecipes(data);
      } else {
        console.log("Could not fetch recipes");
      }
    } catch (error) {
      console.error("An error occurred during the request: ", error);
      console.log("An unexpected error occurred. Please try again later.");
    }
  };

  useEffect(() => {
    fetchAllRecipes();
  }, []);

  return (
    <div className='recipe-app'>
      <Header />
      <div className="recipe-list">
        {recipes.map((recipe, index) => <RecipeExcerpt recipe={recipe} key={index} />)}
      </div>
    </div>
  );
}

export default App;
