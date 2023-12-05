import React, { useState, useEffect } from "react";
import Header from "./components/Header";
import RecipeExcerpt from "./components/RecipeExcerpt";
import RecipeFull from "./components/RecipeFull";
import "./App.css";

function App() {
  const [recipes, setRecipes] = useState([]);
  const [selectedRecipe, setSelectedRecipe] = useState(null);

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
  
  // Select a recipe
  const handleSelectRecipe = (recipe) => {
    setSelectedRecipe(recipe);
  };

  // Unselect a recipe
  const handleUnselectRecipe = () => {
    setSelectedRecipe(null);
  };

  return (
    <div className='recipe-app'>
      <Header />
      {selectedRecipe && <RecipeFull selectedRecipe={selectedRecipe} handleUnselectRecipe={handleUnselectRecipe} />}
      {!selectedRecipe && (
        <div className="recipe-list">
          {recipes.map((recipe) => (
            <RecipeExcerpt recipe={recipe} key={recipe.id} handleSelectRecipe={handleSelectRecipe} />
          ))}
        </div>
      )}
    </div>
  );
}

export default App;
