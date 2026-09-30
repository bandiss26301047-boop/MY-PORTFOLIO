const searchForm = document.getElementById("search-form");
const searchInput = document.getElementById("search-input");

const status = document.getElementById("status");
const profile = document.getElementById("profile");

const repoHeading = document.getElementById("repo-heading");
const repositories = document.getElementById("repositories");


// ===============================
// SEARCH GITHUB USER
// ===============================

searchForm.addEventListener("submit", async function (event) {

  event.preventDefault();

  const username = searchInput.value.trim();

  if (!username) {
    showError("Please enter a GitHub username.");
    return;
  }

  // Clear previous results
  profile.innerHTML = "";
  repositories.innerHTML = "";
  repoHeading.textContent = "";

  // Loading state
  status.className = "status";
  status.textContent = "Searching GitHub...";

repositories.innerHTML = `
  <div class="skeleton"></div>
  <div class="skeleton"></div>
  <div class="skeleton"></div>
`;

  try {

    // Get profile
    const userResponse = await fetch(
      `https://api.github.com/users/${username}`
    );

    if (!userResponse.ok) {
  if (userResponse.status === 404) {
    throw new Error("USER_NOT_FOUND");
  }

  throw new Error("USER_FETCH_ERROR");
}

    const user = await userResponse.json();


    // ===============================
    // SHOW PROFILE
    // ===============================

    profile.innerHTML = `
      <div class="profile-card">

        <img
          class="profile-image"
          src="${user.avatar_url}"
          alt="${user.login} profile picture"
        >

        <div class="profile-info">

          <h2 class="profile-name">
            ${user.name || user.login}
          </h2>

          <p class="profile-username">
            @${user.login}
          </p>

          <p class="profile-bio">
            ${user.bio || "No bio available."}
          </p>

          <div class="profile-stats">

            <span class="stat">
              Repositories:
              <strong>${user.public_repos}</strong>
            </span>

            <span class="stat">
              Followers:
              <strong>${user.followers}</strong>
            </span>

            <span class="stat">
              Following:
              <strong>${user.following}</strong>
            </span>

          </div>

        </div>

      </div>
    `;


    // ===============================
    // GET REPOSITORIES
    // ===============================

    status.textContent = "Loading repositories...";

    const repoResponse = await fetch(
      `https://api.github.com/users/${username}/repos?sort=updated&per_page=30`
    );

    if (!repoResponse.ok) {
  throw new Error("REPO_ERROR");
}

    const repos = await repoResponse.json();


    // ===============================
    // SHOW REPOSITORIES
    // ===============================

    repoHeading.textContent =
      `Repositories (${repos.length})`;

    if (repos.length === 0) {

      repositories.innerHTML = `
        <p class="status">
          This user has no public repositories.
        </p>
      `;

    } else {

      repositories.innerHTML = "";

      repos.forEach(function (repo) {

        const card = document.createElement("article");

        card.className = "repo-card";

        card.innerHTML = `
          
          <h3 class="repo-name">

            <a
              href="${repo.html_url}"
              target="_blank"
              rel="noopener"
            >
              ${repo.name}
            </a>

          </h3>


          <p class="repo-description">
            ${
              repo.description ||
              "No description available."
            }
          </p>


          <div class="repo-meta">

            <span>
              ⭐ ${repo.stargazers_count}
            </span>

            <span>
              🍴 ${repo.forks_count}
            </span>

            <span>
              💻 ${repo.language || "Not specified"}
            </span>

          </div>

        `;

        repositories.appendChild(card);

      });

    }


    // Done
    status.textContent = "";

  } catch (error) {

    console.error(error);

    } catch (error) {

  console.error(error);

  if (error.message === "USER_NOT_FOUND") {
    showError("GitHub user not found. Please check the username.");
  } else {
    showError("Something went wrong. Please try again.");
  }

}

  }

});


// ===============================
// ERROR FUNCTION
// ===============================

function showError(message) {

  status.textContent = message;
  status.className = "status error";

  profile.innerHTML = "";
  repositories.innerHTML = "";
  repoHeading.textContent = "";

}
