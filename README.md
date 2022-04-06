# S01E02-ShaderDoodle
Episode #2 Shader Doodle!

# Step 1: Project Setup
We start our "Space Doodle" app with a bit of front-end tooling setup. For this project, we'll 
be using Typescript and delve into using some web-dev server plugins.

To begin, we start with installing 3 packages
- Lit - we used this in Episode 1 and we'll be using it again to help with Web Component dev
- @web-dev/server - Also used in Episode 1 and we'll be using it again to serve our dev environment
- Typescript - Adds types to our JS variables and functions, but also is one way to use decorators in Lit

Next, we'll set up some tasks in our package.json. New to us will be the Typescript compilation task, and
the task to transpile and watch our TS files. The serve task that launches our page for development has 
been covered in Episode 1 and adds TS transpilation to the mix. TS and serving are done with an ampersand
(&) so they both execute in parallel. TS files will be watched and when changes happen will be transpiled to JS.
And these JS files that were transpiled will force the page to be reloaded. We'll also need a simple `tsconfig.json`
file to kick us off with some light and relaxed settings for Typescript.

Now we're ready to create our app. We'll be creating our index.html file which, like Episode 1 will be styled and
sized to the full page and doesn't scroll.

We'll also add the `doodle-app` component/tag/element to our page body, and include a script link to our
"Space Doodle" app entry point found at `src/doodle.js`

In our application entrypoint, doodle.ts (which is Typescript), we'll create a mostly empty class. This class
will be our `doodle-app` web component which uses Lit by extending it. Inside this class will be the 
Lit `render` call which renders nothing yet (by way of an empty html tagged template).

To define the Web Component, we'll be using our first "decorator". 

Next up, we'll demonstrate adding style to our component. Unlike Episode 1, we won't be using CSS in JS,
or rather we won't LOOK like we are. We'll start by creating a `doodle.css` file and adding a simple `:host`
rule to make our page red.

We'll import this CSS in the same way, however it won't quite work yet. We'll need to create a `web-dev-server.config.js`
file to start editing our web-dev server config. Here we'll allow the CSS MIME type to be treated as JS, as well
as using the `rollup-plugin-lit-css` Rollup plugin to wrap our CSS inside of Lit-ready JS, so we can import
it into our component.

Lastly, to make Typescript happy, we need to create a global rule to give any CSS we import a proper type definition.

With all that, we have a full page application with simply a red background.
