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
  const [searchTerm, setSearchTerm] = useState("");

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

  // Update recipe
  const onUpdateForm = (e, action = "new") => {
    const { name, value } = e.target;
    if (action === "update") {
      setSelectedRecipe({ ...selectedRecipe, [name]: value });
    } else if (action === "new") {
      setNewRecipe({ ...newRecipe, [name]: value });
    }
  };

  // Add new recipe to database
  const handleNewRecipe = async (e, newRecipe) => {
    e.preventDefault();

    try {
      const response = await fetch("/api/recipes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(newRecipe)
      });

      if (response.ok) {
        const data = await response.json();
        setRecipes([...recipes, data.recipe]);
        console.log("Recipe added");
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

  // Save updated recipe to database
  const handleUpdateRecipe = async (e, selectedRecipe) => {
    e.preventDefault();
    const { id } = selectedRecipe;

    try {
      const response = await fetch(`/api/recipes/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(selectedRecipe)
      });

      if (response.ok) {
        const data = await response.json();
        setRecipes(recipes.map((recipe) => recipe.id === id ? data.recipe : recipe));
        console.log("Recipe updated");
      } else {
        console.log("Could not edit recipe");
      }
    } catch (error) {
      console.error("An error occurred during the request: ", error);
    }
    setSelectedRecipe(null);
  };

  // Delete a recipe
  const handleDeleteRecipe = async (recipeId) => {
    try {
      const response = await fetch(`/api/recipes/${recipeId}`, {
        method: "DELETE"
      });

      if (response.ok) {
        setRecipes(recipes.filter((recipe) => recipe.id !== recipeId))
        setSelectedRecipe(null);
        console.log("Recipe deleted");
      } else {
        console.log("Could not delete recipe");
      }
    } catch (error) {
      console.error("An error occurred during the request: ", error);
    }
  };

  // Update search term
  const updateSearchTerm = (text) => {
    setSearchTerm(text);
  };

  // Filter recipes using search term
  const handleSearch = () => {
    const searchResults = recipes.filter((recipe) => {
      const valuesToSearch = [recipe.title, recipe.ingredients, recipe.description];
      return valuesToSearch.some((value) => value.toLowerCase().includes(searchTerm.toLowerCase()));
    });
    return searchResults;
  };

  const displayedRecipes = searchTerm ? handleSearch() : recipes;

  return (
    <div className='recipe-app'>
      <Header showRecipeForm={showRecipeForm} searchTerm={searchTerm} updateSearchTerm={updateSearchTerm} />
      {showNewRecipeForm && <NewRecipeForm newRecipe={newRecipe} hideRecipeForm={hideRecipeForm} onUpdateForm={onUpdateForm} handleNewRecipe={handleNewRecipe} />}
      {selectedRecipe && <RecipeFull selectedRecipe={selectedRecipe} handleUnselectRecipe={handleUnselectRecipe} onUpdateForm={onUpdateForm} handleUpdateRecipe={handleUpdateRecipe} handleDeleteRecipe={handleDeleteRecipe} />}
      {!selectedRecipe && !showNewRecipeForm && (
        <div className="recipe-list">
          {displayedRecipes.map((recipe) => (
            <RecipeExcerpt recipe={recipe} key={recipe.id} handleSelectRecipe={handleSelectRecipe} />
          ))}
        </div>
      )}
    </div>
  );
}

export default App;
