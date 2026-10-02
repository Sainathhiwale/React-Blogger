# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:


# Folio

A React dashboard for managing a publication, stories, and audience activity.

## Development

```sh
npm install
npm run dev
```

Run `npm run lint` for ESLint and `npm run build` for the production bundle.

## Application structure

```text
src/
	features/
		auth/        Sign-in and registration UI and state
		dashboard/   Workspace shell and overview sections
		stories/     Story list, editor, initial data, and state
	shared/
		components/  Reusable presentation components
		hooks/       Cross-feature UI hooks
	App.jsx        Application composition root
	main.jsx       React DOM entry point
```

Feature-specific state and components live alongside their feature. `App.jsx` coordinates features and shared dialogs; `main.jsx` only mounts the React tree. The initial stories and sign-in/register flow are client-side demo data. A production deployment still needs a backend for persistence, authentication, authorization, and real analytics; credentials are not sent to a service by this demo.
