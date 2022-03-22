# S01E02-ShaderDoodle
Episode #2 Shader Doodle!

# Step 3: Add Shader Doodle (and code editor)
Now it's time to pop in our remaining components. Of COURSE we need Shader Doodle but, we'll need a code
editor as well. I found something called `lit-code` which is a PrismJS + Lit based code editor.

We'll add those packages to our package.json. Note that for Shader Doodle we're pulling the experimental alpha.
We should also import PrismJS so it's default languages like JS can have some nice syntax coloring in `lit-code`.
It might make more sense to set the language to HLSL (shader language), but it's a bit of a hassle to get
working, and I've found that it looks virtually identical to JS in practice (at least as far as the color styling goes).

Starting slowly by experimenting and adding shaders manually to our Shader Doodle HTML markup, we'll get a bit more 
organized and use the separate `shaders.ts` file to hold and export a set of sample shaders. We'll do the same with
the `lit-code` component. As a middle step, however, we'll store the entire shader script tag in a variable and use
Lit's `unsafeHTML` to render it, just to show this particular escape hatch exists when we need it.

Lastly, we can add some dark style CSS vars to our 'lit-code' element to match the dark mode we already have for
the overall web app with Spectrum Web Component.


# Step 2: Add the UI
It's time to add our UI. We'll be adding (mostly) non-functional UI as a first step of building our
application. We will NOT be paying attention to organization, so we'll be overloading our one single component
with all of our markup. For a real application this would be less than ideal - it's better to split things
up more granularly as smaller and less complicated components, but thats not what we'll be focusing on today,
so I'm allowing this project to get a bit messy.

We start by adding Spectrum Web Components to our package.json. For Episode 2, I'm using dark mode in Spectrum 
just because in Episode 1 we used light mode.

The application will be divided into two sections on the left and right. On the left,
there will be a canvas area where editable text overlays the `shader-doodle` component.
Below that there will be some controls for setting the text color and recording a GIF
of the canvas.

On the right, we have some dropdowns to allow us to load different sample shaders, and different textures (if applicable).
Also, one nuance of `shader-doodle` is additional configuration to run "ShaderToy" shaders, so there is a switch
to turn that off and on.

Below that is an accordion menu that will contain text editing capabilities for the vertex and fragment shaders
for the shader set. And lastly, a simple button to reload/refresh the shader after a user has made edits.

But of course, none of this is wired up!


# Step 1: Project Setup
We start our "Space Doodle" app with a bit of front-end tooling setup. For this project, we'll 
be using Typescript and delve into using some web-dev server plugins.

To begin, we start with installing 3 packages
- Lit - we used this in Episode 1 and we'll be using it again to help with Web Component dev
- @web-dev/server - Also used in Episode 1 and we'll be using it again to serve our dev environment
- Typescript - Adds types to our JS variables and functions, but also is one way to use decorators in Lit

Next, we'll set up some tasks in our package.json. New to use will be the Typescript compilation task, and
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
