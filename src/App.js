import React, { useState, useEffect } from "react";
import Header from "./components/Header";
import RecipeExcerpt from "./components/RecipeExcerpt";
import RecipeFull from "./components/RecipeFull";
import NewRecipeForm from "./components/NewRecipeForm";
import "./App.css";

function App() {
  const [recipes, setRecipes] = useState([]);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [newRecipe, setNewRecipe] = useState({
    title: "",
    ingredients: "",
    instructions: "",
    servings: 1, // conservative default
    description: "",
    image_url: "https://images.pexels.com/photos/9986228/pexels-photo-9986228.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" //default
  });
  const [showNewRecipeForm, setShowNewRecipeForm] = useState(false);

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
  
  // Hide recipe form
  const hideRecipeForm = () => {
    setShowNewRecipeForm(false);
  };

  // Show recipe form
  const showRecipeForm = () => {
    setShowNewRecipeForm(true);
    setSelectedRecipe(null);
  };

  // Update newRecipe
  const onUpdateForm = (e) => {
    const { name, value } = e.target;
    setNewRecipe({ ...newRecipe, [name]: value });
  };

  // Add new recipe to database
  const handleNewRecipe = async (e, newFormRecipe) => {
    e.preventDefault();

    try {
      const response = await fetch("/api/recipes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(newFormRecipe)
      });

      if (response.ok) {
        const data = await response.json();
        setRecipes([...recipes, data.recipe]);
        setShowNewRecipeForm(false);
        setNewRecipe({
          title: "",
          ingredients: "",
          instructions: "",
          servings: 1,
          description: "",
          image_url: "https://images.pexels.com/photos/9986228/pexels-photo-9986228.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
        });
      } else {
        console.log("Could not add recipe");
      }
    } catch (error) {
      console.error("An error occurred during the request: ", error);
    }
  };

  return (
    <div className='recipe-app'>
      <Header showRecipeForm={showRecipeForm} />
      {showNewRecipeForm && <NewRecipeForm newRecipe={newRecipe} hideRecipeForm={hideRecipeForm} onUpdateForm={onUpdateForm} handleNewRecipe={handleNewRecipe} />}
      {selectedRecipe && <RecipeFull selectedRecipe={selectedRecipe} handleUnselectRecipe={handleUnselectRecipe} />}
      {!selectedRecipe && !showNewRecipeForm && (
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
