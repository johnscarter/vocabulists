# FHIR IG ValueSet Checker

A browser-based tool for checking the ValueSet resources in a FHIR Implementation Guide (IG) package against a FHIR terminology server. It tells you which ValueSets are present on the server, what code system versions they draw from, whether any inactive or missing codes are included in their expansions, and how each ValueSet is defined.

---

## Contents

- [What the tool does and when to use it](#what-the-tool-does-and-when-to-use-it)
- [Prerequisites](#prerequisites)
- [Files](#files)
- [Configuring environments and registries before first use](#configuring-environments-and-registries-before-first-use)
- [Running a check](#running-a-check)
- [Interpreting the results](#interpreting-the-results)
- [Exporting results to CSV](#exporting-results-to-csv)
- [Common errors and what to do about them](#common-errors-and-what-to-do-about-them)

---

## What the tool does and when to use it

When you publish a FHIR IG, it typically defines a set of ValueSets. Before the IG can be used in production, those ValueSets usually need to be loaded onto a terminology server — and the codes they reference need to be valid and current in that server's code system version.

This tool helps you answer questions like:

- Are all the ValueSets from this IG package present on the terminology server?
- Which code system versions are in use?
- Are any inactive (deprecated) codes included in the ValueSet expansions?
- Are any codes declared in a ValueSet definition missing from the server's expansion?
- Are the ValueSets defined intensionally (by rules and filters) or extensionally (by explicit code lists)?
- What about ValueSets referenced in the IG's profiles but defined externally (e.g., by HL7 or SNOMED)?

**Typical use cases:**

- Checking a new IG release against a DEV or QA environment before promoting it
- Investigating terminology issues reported in testing
- Auditing a production environment for deprecated or missing codes
- Comparing what the IG defines against what the server actually holds

---

## Prerequisites

**Browser:** Any modern browser (Chrome, Edge, Firefox, Safari). No installation required.

**Network access:** The tool makes two types of outbound network requests from your browser:

1. **To the package registry** — to download the IG package (either `packages.simplifier.net` or `packages.fhir.org` depending on your selection). You must be able to reach the chosen registry.
2. **To the terminology server** — to query each ValueSet. You must be able to reach whichever server environment you select, and that server must allow cross-origin (CORS) requests from a locally opened HTML file.

> If either host is behind a firewall or VPN, ensure your browser session has access before running the tool.

---

## Files

| File | Purpose |
|---|---|
| `vs-checker.html` | The application — open this in your browser |
| `fflate.umd.js` | A local copy of the compression library used to unpack the IG package |
| `config.example.js` | Template for adding your own terminology server environments |
| `config.js` | Your local configuration — created by you, never shared (see below) |

All files must be kept in the same folder. `config.js` is optional but recommended if you have private terminology servers to add.

---

## Configuring environments before first use

Without any configuration, the **Terminology Server** dropdown contains one pre-configured option — the public `tx.fhir.org` server — plus an **Other…** option for typing in any URL manually.

To add your own private or organisational terminology servers, create a `config.js` file:

1. Copy `config.example.js` to `config.js` (in the same folder).
2. Open `config.js` in a text editor and edit the `environments` list.

```javascript
window.VS_CHECKER_CONFIG = {
  environments: [
    { name: "tx.fhir.org", url: "https://tx.fhir.org/r4" },
    { name: "My Server",   url: "https://your-server.example.org/fhir" }
  ]
};
```

Each entry requires a `name` (shown in the dropdown) and a `url` (the FHIR base URL of the server). Save the file and reload the page — your environments will appear in the dropdown.

### Adding authentication credentials

If a server requires Basic authentication, add `username` and `password` to its entry in `config.js`:

```javascript
{ name: "My Server", url: "https://your-server.example.org/fhir",
                     username: "myuser", password: "mypassword" }
```

When a configured environment with credentials is selected, the tool sends them automatically. No username or password fields are shown on screen.

> **Keep `config.js` private.** It is excluded from version control (listed in `.gitignore`) and should never be committed to a shared repository. Do not add credentials to `config.example.js`.

### Package registries

The package registry dropdown is pre-configured with Simplifier and the HL7 FHIR Registry and does not need to be changed for typical use.

---

## Running a check

1. Open `vs-checker.html` in your browser (File → Open, or double-click the file).

2. **Package Name** — enter the FHIR package identifier, for example `ca.on.ehr.r4`. Hover over the field for a reminder of where to find this.

3. **Version** — enter the package version, for example `1.0.0-snapshot22`. Package name and version are both shown on the **Releases** tab of the associated Simplifier project page.

4. **Package Registry** — select the registry to download the package from. Choose **Simplifier** for packages published on simplifier.net, or **HL7 FHIR Registry** for packages on packages.fhir.org.

5. **Terminology Server** — select the environment to check against. If you have configured environments in `config.js`, they appear here. To use a server not in the list, choose **Other…**, which reveals a **Custom URL** field and optional **Username** / **Password** fields for Basic authentication. Credentials entered manually are never saved beyond the current browser session.

6. Click **Run**.

The tool will:
- Download the package tgz from the selected registry (a progress bar shows status)
- Unpack it and find all `ValueSet-*.json` files
- Scan all `StructureDefinition-*.json` files for ValueSet references not defined in the package itself (these become *external* entries)
- Query the terminology server for each ValueSet, one at a time
- Display results as cards as each check completes

To stop a run in progress, click **Cancel**. If you change any input field while a run is in progress, the tool will warn you before cancelling.

---

## Interpreting the results

Each ValueSet gets its own card. The summary line at the top of the results shows total counts: found, not found, and server errors.

### Card header

The card header shows the ValueSet **title**, **name** (technical identifier), and a row of badges. Immediately after the name is a small link icon — clicking it opens the ValueSet page in the published IG (for package ValueSets) or the canonical URL destination (for external ValueSets) in a new tab.

Below the header, the canonical URL and version are shown, followed by the description if one is present.

### Badges

| Badge | Colour | Meaning |
|---|---|---|
| **External** | Purple | This ValueSet is not defined in the IG package. It was found referenced in a profile binding but defined elsewhere (e.g., by HL7 or SNOMED). Metadata is populated from the server if the VS is found there. |
| **Found** | Green | The ValueSet was found on the selected terminology server. |
| **Not Found** | Grey | The ValueSet was not found on the server. The card is greyed out and no expansion details are shown. |
| **Server Error** | Red | The terminology server could not be reached, or returned an unexpected error. |
| **N inactive codes** | Amber | The expansion contains one or more inactive (deprecated) codes. |
| **No inactive codes** | Green | The expansion completed successfully and contains no inactive codes. |
| **N missing codes** | Rose | One or more codes declared in the ValueSet's extensional definition were absent from the server's expansion. See [Missing codes](#missing-codes) below. |
| **Intensional** | Blue | The ValueSet is defined by rules or filters (e.g., "all codes from system X where property Y = Z"). |
| **Extensional** | Purple | The ValueSet is defined by an explicit enumerated list of codes. |
| **Mixed** | Orange | The ValueSet uses a combination of intensional and extensional includes or excludes. |

### Compose section

Below the description, the card shows how the ValueSet is composed — its `include` and `exclude` entries:

- **Include** / **Include all** entries are shown with a blue border. *Include all* means the entire code system is imported with no filter.
- **Exclude** entries are shown with a red border.
- Intensional entries list their filter conditions as `where {property} {op} {value}`.
- Extensional entries show up to five codes (`code  display`). If there are more, a note such as `[+ 42 more]` is shown.

### Code system version chips

If the ValueSet was found and successfully expanded, a row of chips shows the distinct **code system + version** pairs drawn from the expansion. For example:

> `http://snomed.info/sct · v20240701`

This tells you which version of each code system the server resolved the ValueSet against. Multiple chips indicate the ValueSet draws from more than one code system. For code systems that use a full URI as their version identifier (such as SNOMED CT), the chip shows only the final path segment for readability; hovering over the chip reveals the full version URI.

### Inactive codes

If the expansion contains inactive codes, a collapsible **N inactive codes** section appears below the chips. Click it to expand a table showing the system, code, and display for each inactive code.

Inactive codes indicate that deprecated terms are included in the ValueSet expansion. Depending on your context, this may or may not be intentional — for example, some ValueSets deliberately include inactive codes to support legacy data.

### Missing codes

For extensional or mixed ValueSets, the tool compares the codes declared in the ValueSet's `compose.include` entries against the codes returned in the expansion. Any code that appears in the definition but is absent from the expansion is flagged in a collapsible **N missing codes** table showing system, code, and display.

A missing code typically means the code does not exist in the version of the code system currently loaded on the server, or that the server silently omitted it. This is distinct from an inactive code, which is present in the expansion but marked as deprecated.

> Note: this check only applies to extensional includes (explicit code lists). Intensional includes (filter-based) have no declared code list to compare against.

---

## Exporting results to CSV

Once a run completes, the **Export CSV** button becomes available. Click it to download `vs-check-results.csv`.

### CSV columns

| Column | Description |
|---|---|
| `vs_title` | ValueSet title |
| `vs_name` | ValueSet name (technical identifier) |
| `vs_canonical_url` | Canonical URL |
| `vs_version` | Version |
| `external` | `true` if the VS is external to the package |
| `present_on_server` | `true` / `false`, or blank if a server error occurred |
| `cs_system` | Code system URL for the row (or the first/matching CS for a no-inactive row) |
| `cs_version` | Version of that code system |
| `inactive_code_system` | Code system for the inactive code |
| `inactive_code` | The inactive code value |
| `inactive_code_display` | Display text for the inactive code |

### Row structure

- **One row per inactive code** for ValueSets that have inactive codes. VS metadata columns are repeated on every row.
- **One row with `inactive_code = NO_INACTIVE_CODES`** for ValueSets that were found and expanded cleanly.
- **One row with VS metadata only** for ValueSets that were not found on the server (expansion columns are blank).

### Suggested uses

- Filter `inactive_code != NO_INACTIVE_CODES` to get a list of all deprecated codes across all ValueSets
- Filter `present_on_server = false` to identify ValueSets that still need to be loaded
- Filter `external = true` to review third-party ValueSet dependencies separately
- Load into Excel or a BI tool for reporting or sign-off tracking

---

## Common errors and what to do about them

### Package not found (404)

> *Package ca.on.ehr.r4@1.0.0-snapshot22 was not found (404).*

The package name or version does not exist on the selected registry. Double-check both values — for Simplifier packages, the **Releases** tab of the project page is the authoritative source. Package names are case-sensitive. If the package is not on Simplifier, try switching to the **HL7 FHIR Registry**.

### Network error downloading package

> *Network error downloading package: Failed to fetch.*

The tool could not reach the package registry. Check that your browser has internet access and that the host is not blocked by a firewall or proxy. If you are on a VPN, confirm that public internet access is permitted.

### Terminology server unreachable

> *Terminology server unreachable: Failed to fetch. Verify the server URL and your network access.*

The tool could not reach the selected terminology server. Common causes:

- You are not connected to the network or VPN required to access that environment
- The server URL in `config.js` is incorrect or outdated
- A custom URL was entered incorrectly
- The server is down
- The server does not allow CORS requests from a locally opened HTML file (some servers restrict this)

When this error occurs, all remaining ValueSets in the run are marked **Server Error**. Fix the connectivity issue and re-run.

### Unauthorized (401)

If a terminology server requires authentication and the credentials are wrong or missing, the server will return a 401 response, which the tool reports as a server error.

- For a server configured in `config.js` — check that the `username` and `password` values are correct and reload the page.
- For **Other…** — re-enter the correct username and password and re-run.

### $expand error or OperationOutcome

> *$expand error: Unable to expand ValueSet — content not available.*

The server found the ValueSet but could not expand it. This is a server-side issue, typically meaning the underlying code system content is not loaded on that server, or the ValueSet was loaded without a `compose` element. The card will still show the Found badge and compose information extracted from the package; only the expansion details (CS versions, inactive codes, and missing codes) will be unavailable.

### $expand timed out

> *$expand timed out*

The expansion request took longer than 30 seconds. This can happen with very large ValueSets. The card will show all other available information. If this occurs consistently, contact the server administrator.

### No ValueSet files found in package

> *No ValueSet-*.json files found in this package.*

The package was downloaded and unpacked successfully, but contained no ValueSet resources. Verify you have the right package — some packages contain only profiles or other resource types with no ValueSets of their own.
