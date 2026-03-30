# CrossFire

**Compare two versions of a FHIR CodeSystem or ValueSet**

A single-page web tool for comparing two versions of a FHIR CodeSystem or ValueSet and downloading the results as spreadsheet-ready CSV files.

## What it does

Given an older and a newer export of the same FHIR resource, the tool tells you:

- How many concepts were in the old version
- How many concepts were **added** in the new version
- How many concepts were **deleted** from the old version

It then lets you download three CSV files you can open in Excel or any spreadsheet application:

| File | Contents |
|------|----------|
| **OLD.csv** | Full list of every concept in the old version |
| **NEW.csv** | Full list of every concept in the new version |
| **DIFF.csv** | Only the changes — each row is marked **Added** or **Deleted** |

Each CSV includes the concept code and its preferred display term. For ValueSets, the source system URL is included as well.

## Requirements

- A modern web browser (Chrome, Edge, Firefox, Safari)
- No installation, no internet connection required after the page loads
- Your FHIR files must be in **JSON format** (`.json`), exported directly from your terminology server or registry

## How to use it

1. **Open** `codesystem_diff.html` in your browser — double-click the file or drag it into an open browser window.

2. **Load the OLD file** — click the OLD drop zone (or drag your file onto it) and select the JSON export of the earlier version.

3. **Load the NEW file** — do the same for the newer version.

   After loading each file, a badge will confirm whether it was recognised as a **CodeSystem** or **ValueSet**. If it shows **Unknown**, the file may not be a valid FHIR JSON export.

4. **Click RUN COMPARISON** — the button activates once both files are loaded.

5. **Review the summary** — three counts appear: concepts in the old version, concepts added, and concepts deleted.

6. **Download your CSVs** — click any of the three download buttons to save the file to your computer.

## Supported resource types

| Type | Supported |
|------|-----------|
| FHIR CodeSystem | Yes |
| FHIR ValueSet | Yes |
| Other FHIR resources | No |

Both files must be the same type (you cannot compare a CodeSystem against a ValueSet).

## Notes

- The tool runs entirely in your browser. No data is uploaded anywhere.
- File names are used to label the downloaded CSVs (e.g. `snomed_2024.json` produces `snomed_2024.csv`).
- The diff file is named `OLDNAME_vs_NEWNAME_DIFF.csv`.
- Concepts are compared by **code** only. Changes to display terms are not flagged — a concept whose code exists in both versions is treated as unchanged even if its name differs.
