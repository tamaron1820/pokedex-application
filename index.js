/*
 * Name: Tatsuhiko Araki
 * Date: May 4, 2023
 * Section: CSE 154 AA
 *
 * This is the JS file that implements the Pokédex.
 * This program displays the Pokémon that the user searches for or
 * a Pokémon that is randomly selected.
 */

"use strict";
(function() {
  window.addEventListener("load", init);
  const POKE_URL = "https://pokeapi.co/api/v2/pokemon/";
  const POKEMON_RANDOM_NUM = 898;
  const CHANGE_UNIT = 10;

  /**
   * Initialize all the button and id
   */
  function init() {
    id("pokemon-form").addEventListener("submit", function(event) {
      event.preventDefault();
      makePokemonRequest();
    });
    id("random-pokemon-button").addEventListener("click", makeRandomPokemonRequest);
  }

  /**
   * Makes a fetch request for the specified Pokémon name and processes the response data.
   */
  function makePokemonRequest() {
    let pokemonName = id("pokemon-name").value;
    fetch(POKE_URL + pokemonName.toLowerCase())
      .then(statusCheck)
      .then(res => res.json())
      .then(processPokemonData)
      .catch(handleError);
  }

  /**
   * Makes a fetch request for a random Pokémon and processes the response data.
   */
  function makeRandomPokemonRequest() {
    let pokemonRandom = Math.floor(Math.random() * POKEMON_RANDOM_NUM + 1);
    fetch(POKE_URL + pokemonRandom)
      .then(statusCheck)
      .then(res => res.json())
      .then(processPokemonData)
      .catch(handleError);
  }

  /**
   * Processes the Pokémon data from the API response and updates the DOM with the new information.
   *
   * @param {Object} res - The JSON object containing the Pokémon data from the API.
   */
  function processPokemonData(res) {
    // Remove existing information
    let infoDiv = id("pokemon-info");
    while (infoDiv.firstChild) {
      infoDiv.removeChild(infoDiv.firstChild);
    }

    // Create new elements and append them to the DOM
    let nameHeader = gen("h2");
    nameHeader.textContent = res.name;
    infoDiv.appendChild(nameHeader);

    if (res.sprites && res.sprites.front_default) {
      let img = gen("img");
      img.src = res.sprites.front_default;
      infoDiv.appendChild(img);
    }

    let typePara = gen("p");
    typePara.innerHTML = `Type: <span>${res.types[0].type.name}</span>`;
    infoDiv.appendChild(typePara);

    let abilityPara = gen("p");
    abilityPara.innerHTML = `Ability: <span>${res.abilities[0].ability.name}</span>`;
    infoDiv.appendChild(abilityPara);

    let heightPara = gen("p");
    heightPara.innerHTML = `Height: <span>${res.height / CHANGE_UNIT}</span> m`;
    infoDiv.appendChild(heightPara);

    let weightPara = gen("p");
    weightPara.innerHTML = `Weight: <span>${res.weight / CHANGE_UNIT}</span> kg`;
    infoDiv.appendChild(weightPara);
  }

  /**
   * Checks the status of the response from the fetch request.
   * If the response is not ok, it throws an error with the response text.
   *
   * @param {Response} res - The response object from the fetch request.
   * @returns {Response} - The same response object if the status is ok.
   * @throws {Error} - If the response status is not ok, an error is
   * thrown with the response text.
   */
  async function statusCheck(res) {
    if (!res.ok) {
      throw new Error(await res.text);
    }
    return res;
  }

  /**
   * Handles errors by logging them to the console and displaying an alert to the user.
   *
   * @param {Error} error - The error object that was caught during the fetch request.
   */
  function handleError(error) {
    console.error(error);
    let errorMessage = document.createElement("p");
    errorMessage.textContent = "An error occurred while fetching data.";
    id("pokemon-info").appendChild(errorMessage);
  }

  /**
   * Return the element with specified ID attribute
   *
   * @param {string} id - element ID
   * @returns {HTMLElement} DOM object associated with id.
   */
  function id(id) {
    return document.getElementById(id);
  }

  /**
   * This function creates a new HTML element with the specified tag name.
   *
   * @param {string} tagName - The tag name of the HTML
   * @returns {HTMLElement} - A new HTML element with the tag name specified
   * by the tagName parameter.
   */
  function gen(tagName) {
    return document.createElement(tagName);
  }

})();
