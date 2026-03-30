// Copy this file to config.js and edit it to add your terminology server environments.
// config.js is gitignored and will never be committed to the repository.
//
// If config.js is absent, the Terminology Server dropdown will show only "Other…",
// which lets you type any server URL manually.

window.VS_CHECKER_CONFIG = {
  environments: [
    { name: "My Server", url: "https://your-terminology-server.example.org/fhir" }
  ]
};
