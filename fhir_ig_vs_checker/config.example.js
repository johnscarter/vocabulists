// Copy this file to config.js and edit it to add your terminology server environments.
// config.js is gitignored and will never be committed to the repository.
//
// If config.js is absent, the Terminology Server dropdown will show only "Other…",
// which lets you type any server URL manually.
//
// username and password are optional. If omitted, requests are sent without authentication.

window.VS_CHECKER_CONFIG = {
  environments: [
    { name: "tx.fhir.org", url: "https://tx.fhir.org/r4" },
    { name: "My Server",   url: "https://your-terminology-server.example.org/fhir",
                           username: "myuser", password: "mypassword" }
  ]
};
