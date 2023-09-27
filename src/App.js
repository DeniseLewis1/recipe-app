import React from "react";
import { useState, useEffect } from "react";
import Header from "./components/Header";
import RecipeExcerpt from "./components/RecipeExcerpt";
import NewRecipeForm from "./components/NewRecipeForm";
import RecipeFull from "./components/RecipeFull";
import { ToastContainer } from "react-toastify";
import displayToast from "./helpers/toastHelper";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";

function App() {
  const [recipes, setRecipes] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [showNewRecipeForm, setShowNewRecipeForm] = useState(false);

  const [newRecipe, setNewRecipe] = useState({
    title: "",
    ingredients: "",
    instructions: "",
    description: "",
    image_url: "https://images.pexels.com/photos/9986228/pexels-photo-9986228.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    servings: 1
  });

  useEffect(() => {
    const fetchAllRecipes = async () => {
      try {
        const response = await fetch("/api/recipes");
        if (response.ok) {
          const data = await response.json();
          setRecipes(data);
        } else {
          displayToast("Oops - could not fetch recipes!", "error");
        }
      } catch (e) {
        console.error("An error occurred during the request:", e);
        displayToast("An unexpected error occurred. Please try again later.", "error");
      }
    };
    fetchAllRecipes();
  }, []);

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

        displayToast("Recipe added successfully!", "success");

        setShowNewRecipeForm(false);
        setNewRecipe({
          title: "",
          ingredients: "",
          instructions: "",
          description: "",
          imageUrl: "",
          servings: 1
        });
      } else {
        displayToast("Oops - could not add recipe!", "error");
      }
    } catch (e) {
      console.error("An error occurred during the request:", e);
      displayToast("An unexpected error occurred. Please try again later.", "error");
    }
  };

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

        setRecipes(
          recipes.map((recipe) => {
            if (recipe.id === id) {
              // Return the saved data from the db
              return data.recipe;
            }
            return recipe;
          })
        );
        displayToast("Recipe updated!", "success");
      } else {
        console.error("Recipe update failed.");
        displayToast("Failed to update recipe. Please try again.", "error");
      }
    } catch (error) {
      console.error("An error occurred during the request:", error);
      displayToast("An unexpected error occurred. Please try again later.", "error");
    }

    setSelectedRecipe(null);
  };

  const handleDeleteRecipe = async (recipeId) => {
    try {
      const response = await fetch(`/api/recipes/${selectedRecipe.id}`, {
        method: "DELETE"
      });

      if (response.ok) {
        setRecipes(recipes.filter((recipe) => recipe.id !== recipeId));
        setSelectedRecipe(null);
        displayToast("Recipe deleted successfully!");
      } else {
        displayToast("Oops - could not delete recipe!", "error");
      }
    } catch (e) {
      console.error("Something went wrong during the request:", e);
      displayToast("An unexpected error occurred. Please try again later.", "error");
    }
  };

  const handleSearch = () => {
    const searchResults = recipes.filter((recipe) => {
      const valuesToSearch = [recipe.title, recipe.ingredients, recipe.description];
      // Check if the search term is included in any of the values and will return a boolean value
      return valuesToSearch.some((value) => value.toLowerCase().includes(searchTerm.toLowerCase()));
    });

    return searchResults;
  };

  const onUpdateForm = (e, action = "new") => {
    const { name, value } = e.target;
    if (action === "update") {
      setSelectedRecipe({
        ...selectedRecipe,
        [name]: value
      });
    } else if (action === "new") {
      setNewRecipe({ ...newRecipe, [name]: value });
    }
  };

  const updateSearchTerm = (text) => {
    setSearchTerm(text);
  };

  const handleSelectRecipe = (recipe) => {
    setSelectedRecipe(recipe);
  };

  const handleUnselectRecipe = () => {
    setSelectedRecipe(null);
  };

  const hideRecipeForm = () => {
    setShowNewRecipeForm(false);
  };

  const showRecipeForm = () => {
    setShowNewRecipeForm(true);
    setSelectedRecipe(null);
  };

  const displayedRecipes = searchTerm ? handleSearch() : recipes;

  return (
    <div className='recipe-app'>
      <Header
        showRecipeForm={showRecipeForm}
        handleSearch={handleSearch}
        searchTerm={searchTerm}
        updateSearchTerm={updateSearchTerm}
        handleUnselectRecipe={handleUnselectRecipe}
        hideRecipeForm={hideRecipeForm}
      />
      {showNewRecipeForm && (
        <NewRecipeForm
          newRecipe={newRecipe}
          hideRecipeForm={hideRecipeForm}
          handleNewRecipe={handleNewRecipe}
          onUpdateForm={onUpdateForm}
        />
      )}
      {selectedRecipe && (
        <RecipeFull
          selectedRecipe={selectedRecipe}
          onUpdateForm={onUpdateForm}
          handleDeleteRecipe={handleDeleteRecipe}
          handleUpdateRecipe={handleUpdateRecipe}
          handleUnselectRecipe={handleUnselectRecipe}
          handleSelectRecipe={handleSelectRecipe}
        />
      )}
      {!selectedRecipe && !showNewRecipeForm && (
        <div className='recipe-list'>
          {displayedRecipes.map((recipe) => (
            <RecipeExcerpt key={recipe.id} recipe={recipe} handleSelectRecipe={handleSelectRecipe} />
          ))}
        </div>
      )}
      <ToastContainer />
    </div>
  );
}

export default App;
