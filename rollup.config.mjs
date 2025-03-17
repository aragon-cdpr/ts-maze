import typescript from "rollup-plugin-typescript2";

export default {
  input: "src/index.ts", // your main TypeScript file
  output: {
    file: "dist/bundle.js", // bundled output file
    format: "iife", // Immediately Invoked Function Expression for browsers
    name: "Mazep", // global variable name for your bundle (if needed)
  },
  plugins: [typescript()],
  watch: {
    // Watch all files in the src folder
    include: "src/**",
    // Optionally disable clearing the screen on rebuild
    clearScreen: false,
    // You can also exclude certain files if needed
    // exclude: 'src/excluded-folder/**'
  },
};
