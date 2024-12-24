# Alfurqan-Institute-Michigan

A comprehensive web application designed to streamline event management, donation tracking, and impact reporting. Features include multi-language support, integrated prayer times, membership management, a donation platform with campaign visualization, and detailed fund allocation reporting.

# Postman Documentation
Access the published Postman documentation for this project [here](https://documenter.getpostman.com/view/25879868/2sAYJ4ig6X).


# Git Workflow Guide for Team Members

Welcome to the team! This document will guide you through the process of working with our project's Git repository, using GitHub to manage your contributions, and ensuring your changes are properly merged into the main repository. The steps below outline the workflow, from forking the original repository to submitting a pull request (PR).

## 1. Forking the Original Repository

To start contributing to the project, you need to create a copy of the original repository (also known as the **upstream repository**) in your GitHub account. This allows you to make changes in isolation before submitting them to the main project.

1. Go to the original repository (the **upstream repo**) on GitHub.
2. In the top-right corner of the page, click the **Fork** button to create a copy of the repository in your GitHub account.
3. Once the fork is created, you will have your own version of the repository under your GitHub account.

## 2. Cloning Your Forked Repository to Your Local Machine

Now that you've forked the repository, you need to clone it to your local machine to start working on it.

1. Go to your GitHub account and find your forked repository.
2. Click the **Code** button and copy the URL (either HTTPS or SSH).
3. Open your terminal or Git Bash and run the following command to clone the repository:

   ```bash
   git clone https://github.com/yourusername/repository-name.git
   ```

4. Navigate into the cloned repository's directory:

   ```bash
   cd repository-name
   ```

## 3. Setting Up the Original Repository (Upstream) as a Remote

To keep your fork up to date with the original repository (the **upstream repo**), you need to add the upstream repository as a remote.

1. In your terminal, run the following command to add the upstream remote:

   ```bash
   git remote add upstream https://github.com/original-owner/repository-name.git
   ```

2. To verify that the upstream remote was added correctly, run:

   ```bash
   git remote -v
   ```

   This should show both `origin` (your fork) and `upstream` (the original repository).

## 4. Syncing Your Fork with the Upstream Repository

Before you start working on any changes, ensure that your local fork is up to date with the latest changes from the original repository.

1. Fetch the latest changes from the upstream repository:

   ```bash
   git fetch upstream
   ```

2. Checkout your `dev` branch (or the branch you're working on):

   ```bash
   git checkout dev
   ```

3. Merge the latest changes from the upstream repository’s `dev` branch into your local `dev` branch:

   ```bash
   git pull upstream dev
   ```

   If you are working on the `main` branch, use `git pull upstream main` instead.

4. Push the changes to your forked repository on GitHub:

   ```bash
   git push origin dev
   ```

## 5. Creating a Feature Branch

When you're ready to work on a new feature or fix, it’s important to create a **feature branch** from the `dev` branch.

1. Make sure you are on the `dev` branch:

   ```bash
   git checkout dev
   ```

2. Create a new branch for your feature or bug fix:

   ```bash
   git checkout -b feature/your-feature-name
   ```

3. Work on your changes in this branch.

## 6. Committing Your Changes

Once you’ve made your changes, you need to commit them to your feature branch.

1. Stage your changes:

   ```bash
   git add .
   ```

2. Commit the changes with a descriptive message:

   ```bash
   git commit -m "Add feature: description of what you did"
   ```

3. Push your changes to your forked repository on GitHub:

   ```bash
   git push origin feature/your-feature-name
   ```

## 7. Opening a Pull Request (PR)

Once your changes are pushed to your fork, you can submit a pull request (PR) to merge your feature branch into the `dev` branch of the original repository (upstream).

1. Go to your forked repository on GitHub.
2. You'll see a banner suggesting you create a pull request for your recently pushed branch. Click on **Compare & pull request**.
3. In the PR form:
   - Select **dev** as the base branch (the branch you want to merge into) in the original repository.
   - Select your feature branch as the compare branch (the branch with your changes).
   - Add a detailed description of the changes you've made.
4. Click **Create pull request** to submit your PR.

## 8. Reviewing and Approving the PR

Once you open a PR, it will be reviewed by a collaborator or maintainer of the original repository.

- If your PR is approved, it will be merged into the `dev` branch of the main repository.
- If there are any issues with your PR, you’ll be asked to make changes. You can push updates to your feature branch, and the PR will automatically update.

## 9. Keeping Your Fork in Sync After PR is Merged

Once your PR is merged into the `dev` branch of the original repository, you should ensure that your fork remains up to date with the latest changes.

1. Fetch the latest changes from the upstream repository:

   ```bash
   git fetch upstream
   ```

2. Checkout your `dev` branch:

   ```bash
   git checkout dev
   ```

3. Merge the changes from the upstream `dev` branch:

   ```bash
   git pull upstream dev
   ```

4. Push the updated `dev` branch to your forked repository:

   ```bash
   git push origin dev
   ```

## 10. Best Practices

- **Write clear commit messages**: Ensure your commit messages are descriptive and follow the project's commit message guidelines.
- **Keep PRs focused**: Each pull request should ideally focus on a single feature or bug fix.
- **Sync your fork regularly**: Frequently pull changes from the upstream repository to avoid merge conflicts.
- **Communicate in PRs**: If your PR addresses specific issues or requires additional context, mention it in the PR description.

---

## Conclusion

By following this workflow, you ensure that your contributions are properly managed and that you’re always working on the latest version of the code. Collaborating in this way helps maintain a clean and organized repository, enabling smooth contributions from all team members. Happy coding!
