const express = require("express");
const app = express();

const { initializeDatabase } = require("./db/db.connect");
const Recipe = require("./models/recipe.models");

app.use(express.json());

initializeDatabase();

async function deleteById(recipeId) {
  try {
    const deleteRecipe = await Recipe.findByIdAndDelete(recipeId);
    return deleteRecipe;
  } catch (error) {
    throw error;
  }
}

app.delete("/recipes/:recipeId", async (req, res) => {
  try {
    const recipe = await deleteById(req.params.recipeId);
    if (recipe) {
      res.status(200).json({ message: "deleted successfully" });
    } else {
      res.status(404).json({ error: "recipe not found" });
    }
  } catch (error) {
    res.status(500).json({ error: "failed to fetch data" });
  }
});

async function updateByTitle(recipeTitle, dataToUpdate) {
  try {
    const updatedRecipe = await Recipe.findOneAndUpdate(
      { title: recipeTitle },
      dataToUpdate,
      { new: true },
    );
    return updatedRecipe;
  } catch (error) {
    throw error;
  }
}

app.post("/recipes/:recipeTitle", async (req, res) => {
  try {
    const recipe = await updateByTitle(req.params.recipeTitle, req.body, {
      new: true,
    });
    if (recipe) {
      res
        .status(200)
        .json({ message: "successfully updated", updatedRecipe: recipe });
    } else {
      res.status(404).json({ error: "recipe not found" });
    }
  } catch (error) {
    res.status(500).json({ error: "failed to fetch data" });
  }
});

async function updateTheDifficulty(recipeId, dataToUpdate) {
  try {
    const updatedRecipe = await Recipe.findByIdAndUpdate(
      recipeId,
      dataToUpdate,
      { new: true },
    );
    return updatedRecipe;
  } catch (error) {
    throw error;
  }
}

app.post("/recipes/level/:recipeId", async (req, res) => {
  try {
    const recipeUpdate = await updateTheDifficulty(
      req.params.recipeId,
      req.body,
    );
    if (recipeUpdate) {
      res.status(200).json({
        message: "successfully updated data",
        updatedData: recipeUpdate,
      });
    } else {
      res.status(404).json({ error: "recipe not found" });
    }
  } catch (error) {
    res.status(500).json({ error: "failed to fetch data" });
  }
});

async function getRecipeByDifficulty(recipeDifficulty) {
  try {
    const recipesByDifficulty = await Recipe.find({
      difficulty: recipeDifficulty,
    });
    return recipesByDifficulty;
  } catch (error) {
    throw error;
  }
}

app.get("/recipes/:recipeDifficulty", async (req, res) => {
  try {
    const recipe = await getRecipeByDifficulty(req.params.recipeDifficulty);
    if (recipe.length !== 0) {
      res.json(recipe);
    } else {
      res.status(404).json({ error: "recipe not found" });
    }
  } catch (error) {
    res.status(500).json({ error: "failed to fetch data" });
  }
});

async function getRecipeByAuthor(recipeAuthor) {
  try {
    const recipeByAuthor = await Recipe.find({ author: recipeAuthor });
    return recipeByAuthor;
  } catch (error) {
    throw error;
  }
}

app.get("/recipes/:recipeAuthor", async (req, res) => {
  try {
    const recipe = await getRecipeByAuthor(req.params.recipeAuthor);
    if (recipe.length !== 0) {
      res.json(recipe);
    } else {
      res.status(404).json({ error: "author not found" });
    }
  } catch (error) {
    res.status(500).json({ error: "failed to fetch data" });
  }
});

async function getRecipeByTitle(recipeTitle) {
  try {
    const recipeByTitle = await Recipe.findOne({ title: recipeTitle });
    return recipeByTitle;
  } catch (error) {
    throw error;
  }
}

app.get("/recipes/:recipeTitle", async (req, res) => {
  try {
    const recipe = await getRecipeByTitle(req.params.recipeTitle);
    if (recipe.length !== 0) {
      res.json(recipe);
    } else {
      res.status(404).json({ error: "recipe not found" });
    }
  } catch (error) {
    res.status(500).json({ error: "failed to fetch data" });
  }
});

async function getAllRecipe() {
  try {
    const recipes = await Recipe.find();
    return recipes;
  } catch (error) {
    throw error;
  }
}

app.get("/recipes", async (req, res) => {
  try {
    const recipes = await getAllRecipe();
    res.json(recipes);
  } catch (error) {
    res.status(500).json({ error: "failed to fetch data" });
  }
});

async function createRecipe(newRecipe) {
  try {
    const recipe = new Recipe(newRecipe);
    const saveRecipe = await recipe.save();
    return saveRecipe;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

app.post("/recipes", async (req, res) => {
  try {
    const recipe = await createRecipe(req.body);
    res
      .status(200)
      .json({ message: "New Recipe added successfully", newRecipe: recipe });
  } catch (error) {
    res.status(500).json({ error: "failed to fetch" });
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`server is running in port ${PORT}`);
});
