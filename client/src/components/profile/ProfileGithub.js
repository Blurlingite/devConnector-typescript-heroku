// Section 10 Lecture 59 - Displaying Github Repos
import React, { useEffect } from "react";
import PropTypes from "prop-types";
import Spinner from "../layout/Spinner";
import { connect } from "react-redux";
import { getGithubRepos } from "../../actions/profile";

// we pass in the username, the getGithubRepos action, the repos (which come from the state)
const ProfileGithub = ({ username, getGithubRepos, repos }) => {
  useEffect(() => {
    getGithubRepos(username);
  }, [getGithubRepos]);

  return (
    <div className="profile-github">
      <h2 className="text-primary my-1">Github Repos</h2>
      {/* If there are no repos, show the spinner. Else, show the repos */}
      {repos === null ? (
        <Spinner />
      ) : (
        repos.map(repo => (
          <div key={repo._id} className="repo bg-white p-1 my-1">
            <div>
              <h4>
                <a
                  // "repo" has a field called "html_url" which is the link to the repo on Github
                  href={repo.html_url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {repo.name}
                </a>
              </h4>
              <p>{repo.description}</p>
            </div>
            <div>
              <ul>
                <li className="badge badge-primary">
                  {/* "repo" has a field called "stargazers_count" to show the number of stars  */}
                  Stars: {repo.stargazers_count}
                </li>

                <li className="badge badge-dark">
                  {/* "repo" has a field called "stargazers_count" to show the number of watchers  */}
                  Watchers: {repo.watchers_count}
                </li>

                <li className="badge badge-light">
                  {/* "repo" has a field called "forks_count" to show the number of forks  */}
                  Forks: {repo.forks_count}
                </li>
              </ul>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

ProfileGithub.propTypes = {
  getGithubRepos: PropTypes.func.isRequired,
  repos: PropTypes.array.isRequired,
  username: PropTypes.string.isRequired
};

const mapStateToProps = state => ({
  repos: state.profile.repos // get the repos from the profile in the state and assign it to "repos"
});

export default connect(
  mapStateToProps,
  { getGithubRepos }
)(ProfileGithub);
