# JournalJoe

---

# 🚀 Git Workflow & Branch Rules

This project uses a structured Git workflow to keep the codebase clean, stable, and easy for everyone to collaborate on.
Please follow the rules below when contributing.

---

## 🔹 1. **Do NOT commit directly to the `main` branch**

The `main` branch is the **default and protected branch**.

* No one is allowed to push or commit directly to `main`.
* All changes must go through a **Pull Request (PR)**.
* Only the repository owner can approve and merge PRs.

---

## 🔹 2. **Always create a Pull Request (Commit Request)**

Before any code is added to `main`, you must:

1. Create your own branch
2. Commit your changes there
3. Open a Pull Request targeting `main`
4. Wait for review and approval

✔ PRs ensure quality, review, and prevent accidental mistakes
✔ This keeps `main` stable at all times

---

## 🔹 3. **Branch Naming Convention**

When creating branches, use the following format:

```
feature/<short-description>
```

Examples:

```
feature/login-ui
feature/ai-mood-detection
feature/api-journal-upload
feature/therapist-dashboard
```

---

## 🔹 4. **Resolve conflicts in your own branch**

If your branch has conflicts with `main`:

1. Pull the latest `main` into **your branch**
2. Resolve conflicts locally
3. Push updates to your branch
4. The PR will update automatically

❗ Do **not** try to fix conflicts directly in `main`.
❗ Never commit into `main` to override conflicts.

---



## Summary

| Rule                                   | Description                  |
| -------------------------------------- | ---------------------------- |
| ❌ No direct commits to `main`          | `main` is a protected branch |
| ✔ All changes require a PR             | PR → review → merge          |
| ✔ Use `feature/<name>` branches        | Keeps work organized         |
| ✔ Resolve conflicts in your own branch | Never in `main`              |
| ✔ Only repo owner merges PRs           | Ensures code quality         |

---

